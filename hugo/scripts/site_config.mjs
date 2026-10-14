// Dump the parts of docusaurus.config.js the Hugo templates reuse (navbar, footer, announcement bar).
// Usage: node hugo/scripts/site_config.mjs > hugo/data/site.json
// docusaurus.config.js imports a few npm packages (prism themes, remark/rehype plugins) that only matter to
// Docusaurus. When node_modules is absent (Hugo CI), resolve them to an empty stub instead of failing.
import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(`
export async function resolve(spec, ctx, next) {
  try { return await next(spec, ctx); } catch (e) {
    if (/^[@a-z]/i.test(spec) && !spec.startsWith('node:'))
      return { url: 'data:text/javascript,export default {};export const themes = {};', shortCircuit: true };
    throw e;
  }
}`));
const cfg = (await import(new URL('../../docusaurus.config.js', import.meta.url))).default;
const t = cfg.themeConfig;
const docs = cfg.presets?.[0]?.[1]?.docs ?? {};
process.stdout.write(JSON.stringify({
  title: cfg.title, tagline: cfg.tagline, navbar: t.navbar, footer: t.footer,
  announcementBar: t.announcementBar, editUrl: docs.editUrl,
  wechat: cfg.customFields?.wechat,
}, null, 1));
