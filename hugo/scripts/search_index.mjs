// Build the Pagefind index for public/ with Chinese text pre-segmented the way browsers segment queries.
//
// Pagefind segments Chinese at index time with its own dictionary (二叉树 stays one word), but its search
// code segments the query with the browser's Intl.Segmenter (二叉树 -> 二 | 叉 | 树), so most multi-character
// queries found nothing. Here every CJK run in the indexed copy is split with Intl.Segmenter and the pieces
// are joined with zero-width spaces: index and query tokens line up, and excerpts still read normally.
// The served HTML is not changed.
//
// Usage: node hugo/scripts/search_index.mjs hugo/public   (needs the `pagefind` npm package)
import fs from 'node:fs/promises';
import path from 'node:path';
import * as pagefind from 'pagefind';

const site = path.resolve(process.argv[2] || 'public');
const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
const CJK = /[㐀-鿿豈-﫿]/;

function segmentText(text) {
  if (!CJK.test(text)) return text;
  let out = '';
  for (const { segment } of segmenter.segment(text)) out += CJK.test(segment) ? segment + '​' : segment;
  return out;
}

// Only text between tags is touched; tags and attributes pass through unchanged.
const segmentHtml = (html) => html.split(/(<[^>]*>)/).map((part, i) => (i % 2 ? part : segmentText(part))).join('');

async function* htmlFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'pagefind') yield* htmlFiles(p);
    } else if (entry.name.endsWith('.html')) yield p;
  }
}

const { index, errors } = await pagefind.createIndex({});
if (!index) throw new Error(`pagefind: ${errors.join('; ')}`);

let files = 0, batch = [];
const flush = async () => {
  const results = await Promise.all(batch);
  for (const r of results) if (r.errors.length) throw new Error(`pagefind: ${r.errors.join('; ')}`);
  batch = [];
};
for await (const file of htmlFiles(site)) {
  const content = segmentHtml(await fs.readFile(file, 'utf8'));
  batch.push(index.addHTMLFile({ sourcePath: path.relative(site, file), content }));
  files++;
  if (batch.length >= 200) await flush();
}
await flush();

const out = path.join(site, 'pagefind');
await fs.rm(out, { recursive: true, force: true });
const written = await index.writeFiles({ outputPath: out });
if (written.errors.length) throw new Error(`pagefind: ${written.errors.join('; ')}`);
await pagefind.close();
console.log(`search index: ${files} HTML files -> ${out}`);
