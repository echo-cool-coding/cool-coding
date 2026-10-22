"""Convert the Docusaurus docs/ tree into a Hugo content tree.

Usage (from the repo root):  python3 hugo/scripts/convert.py
Writes hugo/content/ and hugo/static/docsrc/ (both generated, git-ignored).

Every page keeps the exact URL Docusaurus gives it (number prefixes stripped, `slug`
front matter honoured, trailing slash), so a switch would not change any public URL.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata
from datetime import datetime, timezone

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOCS = os.path.join(ROOT, 'docs')
OUT = os.path.join(ROOT, 'hugo', 'content')
STATIC = os.path.join(ROOT, 'hugo', 'static', 'docsrc')

# Same rule as Docusaurus' default numberPrefixParser.
NUM = re.compile(r'^(?P<n>\d+)\s*[-_.]+\s*(?P<rest>[^-_.\s].*)$')
FM = re.compile(r'\A---\n(.*?)\n---\n?', re.S)
ADMONITIONS = {'note': 'NOTE', 'tip': 'TIP', 'info': 'INFO', 'important': 'INFO',
               'warning': 'WARNING', 'caution': 'CAUTION', 'danger': 'DANGER', 'code': 'NOTE',
               'success': 'SUCCESS'}


IGNORED = re.compile(r'^\d+[-_.]\d+')


def strip_num(name):
    if IGNORED.match(name):
        return name, None
    m = NUM.match(name)
    return (m.group('rest'), int(m.group('n'))) if m else (name, None)


def dir_url(rel_dir):
    parts = [strip_num(p)[0] for p in rel_dir.split('/') if p]
    return '/docs/' + '/'.join(parts) if parts else '/docs'


def read(path):
    s = open(path, encoding='utf8').read()
    m = FM.match(s)
    fm = {}
    if m:
        try:
            fm = yaml.safe_load(m.group(1)) or {}
        except yaml.YAMLError:
            fm = {}
        if not isinstance(fm, dict):
            fm = {}
        s = s[m.end():]
    return fm, s


def create_excerpt(text):
    """Port of Docusaurus' createExcerpt: the description it gives pages without one."""
    lines = re.sub(r'^[^\r\n]*\r?\n[=]+', '', text.lstrip()).splitlines()
    in_code = in_import = False
    last_fence = ''
    for line in lines:
        if not line.strip() and in_import:
            in_import = False
        if not line.strip():
            continue
        if (re.match(r'^(?:import|export)\s.*', line) or in_import) and not in_code:
            in_import = True
            continue
        if line.strip().startswith('```'):
            fence = re.match(r'^`+', line.strip()).group(0)
            if not in_code:
                in_code, last_fence = True, fence
            elif len(fence) >= len(last_fence):
                in_code = False
            continue
        elif in_code:
            continue
        c = re.sub(r'<[^>]*>', '', line)
        c = re.sub(r'^#[^#]+#?', '', c, flags=re.M)
        c = re.sub(r'^#{1,6}\s*([^#]*?)\s*#{0,6}', r'\1', c, flags=re.M)
        c = re.sub(r'([*_]{1,3})(.*?)\1', r'\2', c)
        c = re.sub(r'~~(\S.*\S)~~', r'\1', c)
        c = re.sub(r'!\[(.*?)\][\[(].*?[\])]', r'\1', c)
        c = re.sub(r'\[\^.+?\](?:: .*$)?', '', c)
        c = re.sub(r'\[(.*?)\][\[(].*?[\])]', r'\1', c)
        c = re.sub(r'`(.+?)`', r'\1', c)
        c = re.sub(r'^\s{0,3}>\s?', '', c)
        c = re.sub(r':::.*', '', c, count=1)
        c = re.sub(r'\s?:(?:::|[^:\n])+:', '', c)
        c = re.sub(r'\{#*[\w-]+\}', '', c, count=1).strip()
        if c:
            return c
    return None


def git_dates():
    """Last commit date (UTC, YYYY-MM-DD) of every file, like Docusaurus' sitemap lastmod."""
    out = subprocess.run(['git', '-c', 'core.quotePath=false', 'log', '--format=@%ct', '--name-only', '--', 'docs', 'src/pages', 'blog'],
                         cwd=ROOT, capture_output=True, text=True, check=True).stdout
    dates, cur = {}, None
    for line in out.splitlines():
        if line.startswith('@'):
            cur = datetime.fromtimestamp(int(line[1:]), timezone.utc).strftime('%Y-%m-%d')
        elif line.strip() and line not in dates:
            dates[line] = cur
    return dates


def write_page(path, fm, body=''):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf8').write('---\n' + yaml.safe_dump(fm, allow_unicode=True, sort_keys=False) + '---\n\n' + body)


def convert_blog(dates):
    """blog/ -> /blog/ (list), /blog/<slug>/ (posts), /blog/archive/, plus RSS and Atom feeds."""
    src_root = os.path.join(ROOT, 'blog')
    write_page(os.path.join(OUT, 'blog', '_index.md'), {'title': 'Blog', 'description': 'Blog',
               'outputs': ['html', 'blogrss', 'blogatom']})
    write_page(os.path.join(OUT, 'blog-archive.md'), {'title': '历史博文', 'description': '历史博文', 'url': '/blog/archive/', 'type': 'blogarchive'})
    for name in sorted(os.listdir(src_root)):
        path = os.path.join(src_root, name)
        if os.path.isdir(path):
            path = next((os.path.join(path, f) for f in ('index.md', 'index.mdx') if os.path.exists(os.path.join(path, f))), None)
        if not path or not path.endswith(('.md', '.mdx')):
            continue
        m = re.match(r'^(\d{4}-\d{2}-\d{2})-(.*?)(?:\.mdx?)?$', name)
        fm, body = read(path)
        slug = str(fm.get('slug') or (m.group(2) if m else os.path.splitext(name)[0])).strip('/')
        rel = os.path.relpath(path, ROOT).replace(os.sep, '/')
        new_fm = {'title': str(fm.get('title', slug)), 'url': f'/blog/{slug}/', 'date': str(fm.get('date') or (m.group(1) if m else dates.get(rel))),
                  'description': fm.get('description') or create_excerpt(body) or '', 'srcfile': rel}
        if dates.get(rel):
            new_fm['lastmod'] = dates[rel]
        body = re.sub(r'<!--\s*truncate\s*-->', '<!--more-->', body)
        write_page(os.path.join(OUT, 'blog', slug + '.md'), new_fm, convert_body(body))


# CSS-module class names of src/pages/publisher.module.css in the Docusaurus build (static/css/docusaurus.css).
PUBLISHER_CLASSES = {'page': 'page_hCcq', 'article': 'article_oWI7', 'eyebrow': 'eyebrow_CcJv', 'lead': 'lead_cpEX'}


def jsx_page(path, dates):
    """src/pages/<name>.js (simple JSX: Layout, Heading, Link, styles.*) -> content/<name>.html at /<name>/."""
    src = open(path, encoding='utf8').read()
    name = os.path.splitext(os.path.basename(path))[0]
    title = re.search(r'<Layout\s+title="([^"]*)"', src).group(1)
    desc = re.search(r'<Layout[^>]*?description="([^"]*)"', src, re.S)
    body = re.search(r'(<main\b.*</main>)', src, re.S).group(1)
    body = re.sub(r'<Heading\s+as="(h\d)"\s*>(.*?)</Heading>', r'<\1>\2</\1>', body, flags=re.S)
    body = re.sub(r'<Link\s+to="([^"]*)"', lambda m: '<a href="%s"' % (m.group(1).rstrip('/') + '/' if m.group(1).startswith('/') else m.group(1)), body)
    body = body.replace('</Link>', '</a>')
    body = re.sub(r"\{\s*['\"]\s*['\"]\s*\}", ' ', body)
    body = re.sub(r'className=\{styles\.(\w+)\}', lambda m: f'class="{PUBLISHER_CLASSES[m.group(1)]}"', body)
    body = body.replace('className=', 'class=')
    body = re.sub(r'\{/\*.*?\*/\}', '', body, flags=re.S)
    if re.search(r'[{}]', body):
        raise SystemExit(f'{path}: unsupported JSX expression left in page body')
    fm = {'title': title, 'url': f'/{name}/', 'type': 'publisher', 'fullTitle': True}
    if desc:
        fm['description'] = desc.group(1)
    rel = os.path.relpath(path, ROOT).replace(os.sep, '/')
    if dates.get(rel):
        fm['lastmod'] = dates[rel]
    open(os.path.join(OUT, f'{name}.html'), 'w', encoding='utf8').write(
        '---\n' + yaml.safe_dump(fm, allow_unicode=True, sort_keys=False) + '---\n' + body + '\n')


def page_url(rel_dir, stem, fm, is_index):
    base = dir_url(rel_dir)
    slug = fm.get('slug')
    if isinstance(slug, str) and slug:
        url = '/docs' + slug if slug.startswith('/') else base + '/' + slug
    elif is_index:
        url = base
    else:
        url = base + '/' + strip_num(stem)[0]
    url = re.sub(r'/+', '/', url)
    return url.rstrip('/') + '/'


def convert_body(body, srcdir=''):
    # Docusaurus renders ```mdx-code-block fences as live MDX: unwrap them before converting.
    body = re.sub(r'^(`{3,})mdx-code-block[ \t]*\n(.*?)\n\1[ \t]*$', r'\2', body, flags=re.S | re.M)
    body = convert_tabs(body)
    body = convert_admonition_components(body)
    body = convert_image_components(body, srcdir)
    body = convert_jsx_attrs(body)
    body = fix_html_blocks(body)
    # R Markdown chunk fences (```{r, echo=FALSE}) are plain code to Docusaurus; Goldmark reads {..} as attributes.
    body = re.sub(r'^(\s*`{3,})\{\s*([\w+#-]*)[^}\n]*\}[ \t]*$', lambda m: m.group(1) + m.group(2), body, flags=re.M)
    # Docusaurus code titles (```js title="app.js") become Hugo code block attributes.
    body = re.sub(r'^(\s*`{3,}[\w+#-]+)[ \t]+title=(["\'])(.*?)\2.*$', lambda m: f'{m.group(1)} {{title="{m.group(3)}"}}', body, flags=re.M)
    out, fence, adm = [], None, 0
    for line in body.split('\n'):
        stripped = line.lstrip()
        m = re.match(r'(`{3,}|~{3,})', stripped)
        if m:
            tok = m.group(1)
            if fence is None:
                fence = tok
            elif stripped.startswith(fence) and stripped.strip() == stripped[:len(stripped.strip())] and set(stripped.strip()) <= set(fence[0]) and len(stripped.strip()) >= len(fence):
                fence = None
            out.append(('> ' * adm) + line)
            continue
        if fence is None:
            # MDX-only syntax
            if re.match(r'^import\s.+\sfrom\s+[\'"]', line) or re.match(r'^export\s', line):
                continue
            line = re.sub(r'\{/\*.*?\*/\}', '', line)
            if re.match(r'^\s*<TOCInline\b.*/>\s*$', line):
                continue
            am = re.match(r'^\s*::: ?(\w+)\s*(.*)$', line)
            if am and am.group(1).lower() in ADMONITIONS:
                kind = ADMONITIONS[am.group(1).lower()]
                title = am.group(2).strip()
                out.append(('> ' * adm) + f'> [!{kind}]' + (f' {title}' if title else ''))
                adm += 1
                continue
            if re.match(r'^\s*:::\s*$', line):
                # A closing ::: with no open admonition is a leftover; Docusaurus printed it as text.
                if adm:
                    adm -= 1
                    out.append('')
                continue
        out.append(('> ' * adm) + line if adm else line)
    return '\n'.join(out)


def _css_prop(k):
    k = k.strip().strip('"\'')
    return k if '-' in k else re.sub(r'[A-Z]', lambda m: '-' + m.group(0).lower(), k)


def _jsx_style(m):
    props = re.findall(r'([\w"\'-]+)\s*:\s*("[^"]*"|\'[^\']*\'|[^,}]+)', m.group(1))
    css = ';'.join(f'{_css_prop(k)}:{v.strip().strip(chr(34) + chr(39))}' for k, v in props)
    return f'style="{css}"'


def convert_jsx_attrs(body):
    """JSX attributes outside code: style={{...}} -> style="...", className -> class."""
    parts = re.split(r'(^\s*(?:`{3,}|~{3,}).*?^\s*(?:`{3,}|~{3,})\s*$)', body, flags=re.S | re.M)
    for i in range(0, len(parts), 2):
        t = re.sub(r'style=\{\{(.*?)\}\}', _jsx_style, parts[i], flags=re.S)
        parts[i] = re.sub(r'(<[a-zA-Z][^>`]*?)\bclassName=', r'\1class=', t)
    return ''.join(parts)


BLOCK_OPEN = re.compile(r'^(\s{0,3})<(div|center|section|figure|details)\b[^>]*>\s*$')


def _dedent(lines):
    ind = min((len(l) - len(l.lstrip()) for l in lines if l.strip()), default=0)
    return [l[ind:] for l in lines]


def fix_html_blocks(body):
    """MDX parses Markdown between JSX tags on their own lines and keeps <svg> together across blank lines;
    CommonMark ends HTML blocks at a blank line and treats indented lines as code. Rewrite so Hugo agrees:
    open/close tags get blank lines around dedented inner Markdown; <svg> blocks lose blank lines and indentation."""
    lines, out, i, fence = body.split('\n'), [], 0, None
    while i < len(lines):
        line = lines[i]
        fm = re.match(r'\s*(`{3,}|~{3,})', line)
        if fm:
            if fence is None:
                fence = fm.group(1)
            elif line.strip().startswith(fence) and set(line.strip()) <= set(fence[0]):
                fence = None
            out.append(line); i += 1; continue
        if fence is None:
            if re.match(r'^\s*<svg\b', line) and '</svg>' not in line:
                j = i
                while j < len(lines) and '</svg>' not in lines[j]:
                    j += 1
                out.extend(l.strip() for l in lines[i:j + 1] if l.strip())
                i = j + 1; continue
            m = BLOCK_OPEN.match(line)
            if m:
                tag, depth, j = m.group(2), 0, i
                while j < len(lines):
                    depth += len(re.findall(rf'<{tag}\b[^>]*(?<!/)>', lines[j])) - len(re.findall(rf'</{tag}\s*>', lines[j]))
                    if depth <= 0:
                        break
                    j += 1
                if j < len(lines) and re.match(rf'^\s*</{tag}>\s*$', lines[j]) and j > i + 1:
                    inner = fix_html_blocks('\n'.join(_dedent(lines[i + 1:j])))
                    pad = m.group(1)
                    block = [line.strip(), ''] + inner.split('\n') + ['', f'</{tag}>']
                    out.extend(pad + l if l.strip() else l for l in block)
                    i = j + 1; continue
        out.append(line); i += 1
    return '\n'.join(out)


def _outside_fences(body, fn):
    parts = re.split(r'(^\s*(?:`{3,}|~{3,}).*?^\s*(?:`{3,}|~{3,})\s*$)', body, flags=re.S | re.M)
    for i in range(0, len(parts), 2):
        parts[i] = fn(parts[i])
    return ''.join(parts)


def convert_image_components(body, srcdir):
    """@theme/IdealImage <Image img={require('./x.png')} style={{...}}/> and raw <img src="./x.png">
    -> <img> pointing at the copy under /docsrc/<source dir>/ (relative URLs would resolve against the page URL)."""
    def asset(path):
        return '/' + '/'.join(p for p in ('docsrc', srcdir, os.path.normpath(path).replace(os.sep, '/')) if p)

    def image(m):
        attrs = m.group(1)
        src = re.search(r'img=\{\s*require\(\s*([\'"])(.*?)\1\s*\)(?:\.default)?\s*\}', attrs)
        if not src:
            return m.group(0)
        style = re.search(r'style=\{\{(.*?)\}\}', attrs, re.S)
        alt = re.search(r'alt=([\'"])(.*?)\1', attrs)
        css = _jsx_style(style).replace('style=', ' style=') if style else ''
        return f'<img src="{asset(src.group(2))}" alt="{alt.group(2) if alt else ""}"{css} loading="lazy">'

    def fix(t):
        t = re.sub(r'<Image\b((?:[^>{]|\{[^}]*\}\}?)*?)/>', image, t, flags=re.S)
        return re.sub(r'(<img\b[^>]*?\bsrc=)(["\'])(\.{1,2}/[^"\']+)\2', lambda m: f'{m.group(1)}"{asset(m.group(3))}"', t)
    return _outside_fences(body, fix)


def convert_admonition_components(body):
    """<Admonition type="tip" title="...">...</Admonition> -> :::tip blocks (dedented inside)."""
    lines, out, i = body.split('\n'), [], 0
    while i < len(lines):
        m = re.match(r'^(\s*)<Admonition\b([^>]*)>\s*$', lines[i])
        if m:
            j = next((k for k in range(i + 1, len(lines)) if re.match(r'^\s*</Admonition>\s*$', lines[k])), None)
            if j is not None:
                kind = re.search(r'type=([\'"])(\w+)\1', m.group(2))
                title = re.search(r'title=([\'"])(.*?)\1', m.group(2))
                out.append(m.group(1) + ':::' + (kind.group(2) if kind else 'note') + (' ' + title.group(2) if title else ''))
                out.extend(m.group(1) + l if l.strip() else l for l in _dedent(lines[i + 1:j]))
                out.append(m.group(1) + ':::')
                i = j + 1
                continue
        out.append(lines[i])
        i += 1
    return '\n'.join(out)


TABS_OPEN = '<div class="theme-tabs-container tabs-container tabList__CuJ" data-tabs><ul role="tablist" aria-orientation="horizontal" class="tabs"></ul><div class="margin-top--md">'


def convert_tabs(body):
    """<Tabs>/<TabItem label=...> -> Docusaurus tabs markup; tab content is dedented so it stays Markdown."""
    if '<Tabs' not in body:
        return body
    out, item, fence = [], None, False
    for line in body.split('\n'):
        if re.match(r'^\s*(```|~~~)', line):
            fence = not fence
        if not fence:
            if re.match(r'^\s*<Tabs\b[^>]*>\s*$', line):
                out.append(TABS_OPEN)
                continue
            if re.match(r'^\s*</Tabs>\s*$', line):
                out.append('</div></div>')
                continue
            m = re.match(r'^\s*<TabItem\b(.*?)>\s*$', line)
            if m:
                lab = re.search(r'label=["\']([^"\']+)', m.group(1)) or re.search(r'value=["\']([^"\']+)', m.group(1))
                item = []
                out.append(f'<div role="tabpanel" class="tabItem_Ymn6" data-label="{lab.group(1) if lab else "Tab"}">')
                out.append('')
                continue
            if re.match(r'^\s*</TabItem>\s*$', line) and item is not None:
                # Indent is measured outside code fences: code lines may sit left of their fence.
                lines, inner = [], False
                for l in item:
                    if re.match(r'^\s*(```|~~~)', l):
                        inner = not inner
                        lines.append(l)
                    elif l.strip() and not inner:
                        lines.append(l)
                ind = min((len(l) - len(l.lstrip()) for l in lines), default=0)
                out.extend(l[min(ind, len(l) - len(l.lstrip())):] for l in item)
                out.extend(['', '</div>'])
                item = None
                continue
        if item is not None:
            item.append(line)
        else:
            out.append(line)
    return '\n'.join(out)


def category_meta(dir_path):
    p = os.path.join(dir_path, '_category_.json')
    if os.path.exists(p):
        try:
            return json.load(open(p, encoding='utf8'))
        except ValueError:
            pass
    return {}


def main():
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    if os.path.exists(STATIC):
        shutil.rmtree(STATIC)
    pages = 0
    urls = {}
    dates = git_dates()
    for dirpath, dirnames, filenames in os.walk(DOCS):
        rel_dir = os.path.relpath(dirpath, DOCS).replace(os.sep, '/')
        rel_dir = '' if rel_dir == '.' else rel_dir
        out_dir = os.path.join(OUT, 'docs', rel_dir)
        os.makedirs(out_dir, exist_ok=True)
        cat = category_meta(dirpath)
        dir_name = os.path.basename(dirpath)
        _, dir_weight = strip_num(dir_name)
        index_src = None
        for f in filenames:
            stem, ext = os.path.splitext(f)
            if ext in ('.md', '.mdx') and stem.lower() in ('index', 'readme'):
                index_src = f
        for f in sorted(filenames):
            src = os.path.join(dirpath, f)
            stem, ext = os.path.splitext(f)
            if ext not in ('.md', '.mdx'):
                if f != '_category_.json':
                    dst = os.path.join(STATIC, rel_dir, f)
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    shutil.copy2(src, dst)
                continue
            is_index = f == index_src
            fm, body = read(src)
            url = page_url(rel_dir, stem, fm, is_index)
            _, w = strip_num(stem)
            title = fm.get('title') or (re.search(r'^# (.+)$', body, re.M) or [None, stem])[1]
            new_fm = {
                'title': str(title),
                'url': url,
                # Hugo treats weight 0 as "unset", so shift Docusaurus' 0-based positions by one.
                'weight': (fm['sidebar_position'] if isinstance(fm.get('sidebar_position'), (int, float)) else (w if w is not None else 998)) + 1,
                'srcdir': rel_dir,
                'srcfile': os.path.relpath(src, ROOT).replace(os.sep, '/'),
            }
            for k in ('description', 'sidebar_label', 'keywords', 'tags'):
                if fm.get(k):
                    new_fm[k] = fm[k]
            if not fm.get('description'):
                ex = create_excerpt(body)
                if ex:
                    new_fm['description'] = ex
            if dates.get(new_fm['srcfile']):
                new_fm['lastmod'] = dates[new_fm['srcfile']]
            if is_index:
                new_fm['weight'] = (dir_weight if dir_weight is not None else cat.get('position', 998)) + 1
                if cat.get('label'):
                    new_fm['sidebar_label'] = cat['label']
            name = '_index.md' if is_index else re.sub(r'\.mdx$', '.md', f)
            text = '---\n' + yaml.safe_dump(new_fm, allow_unicode=True, sort_keys=False) + '---\n\n' + convert_body(body, rel_dir)
            open(os.path.join(out_dir, name), 'w', encoding='utf8').write(text)
            if url in urls:
                print('DUPLICATE URL', url, urls[url], src, file=sys.stderr)
            urls[url] = src
            pages += 1
        has_docs = any(f.endswith(('.md', '.mdx')) for _, _, fs in os.walk(dirpath) for f in fs)
        if not index_src and has_docs:
            # Section without its own page in Docusaurus: list it in menus, render nothing.
            label = cat.get('label') or strip_num(dir_name)[0].replace('-', ' ').title()
            new_fm = {'title': label, 'weight': (dir_weight if dir_weight is not None else cat.get('position', 998)) + 1,
                      'build': {'render': 'never', 'list': 'always'}, 'srcdir': rel_dir}
            if rel_dir == '':
                new_fm = {'title': 'Docs', 'build': {'render': 'never', 'list': 'always'}}
            open(os.path.join(out_dir, '_index.md'), 'w', encoding='utf8').write(
                '---\n' + yaml.safe_dump(new_fm, allow_unicode=True, sort_keys=False) + '---\n')
    for f in sorted(os.listdir(os.path.join(ROOT, 'src', 'pages'))):
        if f.endswith('.js') and f != 'index.js':
            jsx_page(os.path.join(ROOT, 'src', 'pages', f), dates)
    open(os.path.join(OUT, 'search.md'), 'w').write('---\ntitle: Search the documentation\nurl: /search/\ntype: search\nrobots: noindex, follow\n---\n')
    # Reader-account pages (layouts/learning, layouts/profile), same as compilenrun.com.
    write_page(os.path.join(OUT, 'learn.md'), {
        'title': '我的学习', 'url': '/learn/', 'type': 'learning',
        'description': '继续学习你的课程，并在多台设备间同步学习进度。',
    })
    write_page(os.path.join(OUT, 'profile.md'), {
        'title': '个人资料', 'url': '/profile/', 'type': 'profile',
        'description': '管理你的代码酷个人资料、登录方式和账户设置。',
        'robots': 'noindex, nofollow',
    })
    home =open(os.path.join(ROOT, 'src', 'pages', 'index.js'), encoding='utf8').read()
    write_page(os.path.join(OUT, '_index.md'), {
        'title': re.search(r'<Layout\s+title="([^"]*)"', home).group(1),
        'description': re.search(r'<Layout[^>]*?description="([^"]*)"', home, re.S).group(1),
        'fullTitle': True, 'lastmod': dates.get('src/pages/index.js')})
    convert_blog(dates)
    tutorials = sidebar_tutorials()
    write_category_pages(tutorials, urls)
    os.makedirs(os.path.join(ROOT, 'hugo', 'data'), exist_ok=True)
    json.dump(tutorials, open(os.path.join(ROOT, 'hugo', 'data', 'tutorials.json'), 'w'), indent=1)
    json.dump(urls, open(os.path.join(ROOT, 'hugo', 'urls.json'), 'w'), indent=0)
    print(f'converted {pages} pages')


def kebab(label):
    """github-slugger, which Docusaurus uses for generated-index slugs: lower-case, drop punctuation and
    symbols (ASCII and CJK alike), keep letters/digits/'-'/'_' in any script, spaces become '-'."""
    out = []
    for ch in label.lower():
        cat = unicodedata.category(ch)
        if ch in '-_' or ch.isspace():
            out.append('-' if ch.isspace() else ch)
        elif cat[0] in 'LNM':
            out.append(ch)
    return ''.join(out)


def sidebar_tutorials():
    """Read (label, dirName) pairs from sidebars.js in order, with Docusaurus' generated-index slugs."""
    src = open(os.path.join(ROOT, 'sidebars.js'), encoding='utf8').read()
    src = re.sub(r'^\s*//.*$', '', src, flags=re.M)
    seen = {}
    out = []
    for m in re.finditer(r"label:\s*'([^']+)'[\s\S]{0,400}?dirName:\s*'([^']+)'", src):
        label, d = m.group(1), m.group(2)
        base = kebab(label)
        n = seen.get(base, 0)
        seen[base] = n + 1
        slug = base if n == 0 else f'{base}-{n}'
        out.append({'label': label, 'dir': d, 'url': f'/docs/category/{slug}/', 'group': d.split('/')[0]})
    return out


def write_category_pages(tutorials, urls):
    d = os.path.join(OUT, 'tutorial-index')
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, '_index.md'), 'w').write('---\ntitle: Tutorials\nbuild:\n  render: never\n  list: never\n---\n')
    for i, t in enumerate(tutorials):
        fm = {'title': t['label'], 'url': t['url'], 'tutdir': t['dir'], 'type': 'tutorialindex',
              'description': f"代码酷{t['label']}的全部章节目录，按小节排列。"}
        open(os.path.join(d, f'{i:03d}.md'), 'w', encoding='utf8').write(
            '---\n' + yaml.safe_dump(fm, allow_unicode=True, sort_keys=False) + '---\n')
        urls[t['url']] = 'sidebars.js'


if __name__ == '__main__':
    main()
