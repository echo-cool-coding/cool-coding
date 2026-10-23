/* Client behaviour that Docusaurus' React theme provides, for the static Hugo build. */
(function () {
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Color mode (same 'theme' key as Docusaurus) ---------- */
  function setTheme(choice) {
    var t = choice === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : choice;
    root.setAttribute('data-theme', t);
    root.setAttribute('data-theme-choice', choice);
    if (choice === 'system') { try { localStorage.removeItem('theme'); } catch (e) {} } else store.set('theme', choice);
    var frame = document.querySelector('iframe.giscus-frame');
    if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, 'https://giscus.app');
  }
  document.querySelectorAll('[data-toggle-theme]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = { system: 'light', light: 'dark', dark: 'system' };
      setTheme(next[root.getAttribute('data-theme-choice')] || 'light');
    });
  });

  /* ---------- Announcement bar ---------- */
  var bar = document.querySelector('[data-announcement]');
  if (bar && root.getAttribute('data-announcement-bar-initially-dismissed') === 'true') bar.remove();
  var barClose = document.querySelector('[data-announcement-close]');
  if (barClose) barClose.addEventListener('click', function () {
    store.set('docusaurus.announcement.dismiss', 'true');
    store.set('docusaurus.announcement.id', {{ site.Data.site.announcementBar.id | jsonify | safeJS }});
    root.setAttribute('data-announcement-bar-initially-dismissed', 'true');
    bar.remove();
  });

  /* ---------- Mobile navbar sidebar ---------- */
  var navbar = document.querySelector('[data-navbar]');
  function mobileMenu(open) {
    var slot = document.querySelector('[data-mobile-sidebar]');
    var tree = document.querySelector('[data-doc-sidebar] .theme-doc-sidebar-menu');
    if (open && slot && tree && !slot.firstChild) slot.appendChild(tree.cloneNode(true));
    navbar.classList.toggle('navbar-sidebar--show', open);
    root.style.overflow = open ? 'hidden' : '';
  }
  document.querySelectorAll('[data-navbar-toggle]').forEach(function (b) { b.addEventListener('click', function () { mobileMenu(true); }); });
  document.querySelectorAll('[data-navbar-close]').forEach(function (b) { b.addEventListener('click', function () { mobileMenu(false); }); });
  var back = document.querySelector('[data-navbar-back]');
  if (back) back.addEventListener('click', function () {
    document.querySelector('[data-navbar-items]').classList.remove('navbar-sidebar__items--show-secondary');
  });

  /* ---------- Collapsible sidebar categories ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-collapse]');
    if (!t) return;
    e.preventDefault();
    var li = t.closest('.menu__list-item');
    var collapsed = li.classList.toggle('menu__list-item--collapsed');
    t.setAttribute('aria-expanded', String(!collapsed));
  });

  /* ---------- Active sidebar link: the sidebar HTML is shared by every page of a tutorial ---------- */
  /* Compare decoded paths: Chinese URLs arrive percent-encoded in location.pathname. */
  var dec = function (u) { try { return decodeURI(u); } catch (e) { return u; } };
  var here = dec(location.pathname);
  document.querySelectorAll('.theme-doc-sidebar-menu').forEach(function (menu) {
    var active = null;
    menu.querySelectorAll('a.menu__link[href]').forEach(function (a) {
      if (dec(a.getAttribute('href')) === here) active = a;
    });
    if (!active) return;
    active.classList.add('menu__link--active');
    active.setAttribute('aria-current', 'page');
    var li = active.closest('.menu__list-item');
    while (li) {
      li.classList.remove('menu__list-item--collapsed');
      var own = li.querySelector(':scope > .menu__list-item-collapsible > .menu__link');
      if (own) own.classList.add('menu__link--active');
      var caret = li.querySelector(':scope > .menu__list-item-collapsible > [data-collapse]');
      if (caret) caret.setAttribute('aria-expanded', 'true');
      li = li.parentElement.closest('.menu__list-item');
    }
    if (menu.closest('[data-doc-sidebar]')) {
      var nav = menu.closest('[data-doc-sidebar]');
      var r = active.getBoundingClientRect(), nr = nav.getBoundingClientRect();
      if (r.top < nr.top || r.bottom > nr.bottom) nav.scrollTop += r.top - nr.top - nr.height / 3;
    }
  });

  /* ---------- Table of contents: highlight the heading in view ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('[data-toc] .table-of-contents__link'));
  if (tocLinks.length) {
    var heads = tocLinks.map(function (a) { return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); });
    var onScroll = function () {
      var offset = (navbar ? navbar.offsetHeight : 60) + 10, current = 0;
      heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top - offset <= 1) current = i; });
      tocLinks.forEach(function (a, i) { a.classList.toggle('table-of-contents__link--active', i === current); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  var tocMobile = document.querySelector('[data-toc-mobile]');
  if (tocMobile) tocMobile.querySelector('[data-toc-mobile-toggle]').addEventListener('click', function () {
    var c = tocMobile.querySelector('.collapsibleContent_i85q');
    c.hidden = !c.hidden;
    tocMobile.classList.toggle('tocCollapsibleExpanded_sAul', !c.hidden);
    this.classList.toggle('tocCollapsibleButtonExpanded_MG3E', !c.hidden);
  });

  /* ---------- Back to top ---------- */
  var top = document.querySelector('[data-back-to-top]');
  if (top) {
    window.addEventListener('scroll', function () { top.classList.toggle('backToTopButtonShow_xfvO', window.scrollY > 300); }, { passive: true });
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- Tabs (markup produced by convert.py) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var list = box.querySelector('.tabs');
    var panels = box.querySelectorAll(':scope > .margin-top--md > [role="tabpanel"]');
    panels.forEach(function (p, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'tab');
      li.className = 'tabs__item tabItem_LNqP' + (i === 0 ? ' tabs__item--active' : '');
      li.textContent = p.getAttribute('data-label');
      li.tabIndex = i === 0 ? 0 : -1;
      li.addEventListener('click', function () {
        list.querySelectorAll('.tabs__item').forEach(function (x, j) { x.classList.toggle('tabs__item--active', j === i); });
        panels.forEach(function (x, j) { x.hidden = j !== i; });
      });
      list.appendChild(li);
      p.hidden = i !== 0;
    });
  });

  /* ---------- Copy buttons on code blocks ---------- */
  var copyIcons = '<span class="copyButtonIcons_IEyt" aria-hidden="true"><svg viewBox="0 0 24 24" class="copyButtonIcon_TrPX"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path></svg><svg viewBox="0 0 24 24" class="copyButtonSuccessIcon_cVMy"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></span>';
  document.querySelectorAll('.codeBlockContent_QJqH').forEach(function (box) {
    var group = document.createElement('div');
    group.className = 'buttonGroup_M5ko';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'clean-btn';
    btn.title = 'Copy';
    btn.setAttribute('aria-label', '复制代码到剪贴板');
    btn.innerHTML = copyIcons;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(box.querySelector('code').innerText.replace(/\n$/, '')).then(function () {
        btn.classList.add('copyButtonCopied_Vdqa');
        setTimeout(function () { btn.classList.remove('copyButtonCopied_Vdqa'); }, 1000);
      });
    });
    group.appendChild(btn);
    box.appendChild(group);
  });

  /* ---------- Search (Pagefind) ---------- */
  /* scripts/search_index.mjs joins Chinese words with zero-width spaces in the index; keep them out of results. */
  window.cnrCleanResult = function (r) {
    var z = /\u200b/g, clean = function (o) { if (o.title) o.title = o.title.replace(z, ''); if (o.excerpt) o.excerpt = o.excerpt.replace(z, ''); };
    if (r.meta && r.meta.title) r.meta.title = r.meta.title.replace(z, '');
    clean(r); (r.sub_results || []).forEach(clean);
    return r;
  };
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) {
    var k = document.querySelector('.DocSearch-Button-Key');
    if (k) k.textContent = 'Ctrl';
  }
  var modal = document.querySelector('[data-search-modal]');
  var ui = null;
  function openSearch() {
    modal.hidden = false;
    root.style.overflow = 'hidden';
    var bundle = modal.getAttribute('data-bundle');
    var start = function () {
      if (!ui) ui = new PagefindUI({ element: '#cnr-search-ui', bundlePath: bundle, showSubResults: true, showImages: false, autofocus: true, processResult: window.cnrCleanResult });
      var input = modal.querySelector('input');
      if (input) input.focus();
    };
    if (window.PagefindUI) return start();
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = bundle + 'pagefind-ui.css';
    document.head.appendChild(css);
    var s = document.createElement('script');
    s.src = bundle + 'pagefind-ui.js';
    s.onload = start;
    document.head.appendChild(s);
  }
  function closeSearch() { modal.hidden = true; root.style.overflow = ''; }
  document.querySelectorAll('[data-search-open]').forEach(function (b) { b.addEventListener('click', openSearch); });
  document.querySelectorAll('[data-search-close]').forEach(function (b) { b.addEventListener('click', closeSearch); });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); modal.hidden ? openSearch() : closeSearch(); }
    else if (e.key === 'Escape' && !modal.hidden) closeSearch();
  });

  /* ---------- Giscus comments (same settings as src/components/Comments) ---------- */
  function giscusTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark_tritanopia' : 'light_tritanopia'; }
  var giscus = document.querySelector('[data-giscus]');
  if (giscus) {
    var g = document.createElement('script');
    var attrs = {
      src: 'https://giscus.app/client.js', 'data-repo': 'echo-cool-coding/cool-coding', 'data-repo-id': 'R_kgDOPlgCWQ',
      'data-category': 'General', 'data-category-id': 'DIC_kwDOPlgCWc4Cutzh', 'data-mapping': 'pathname', 'data-strict': '0',
      'data-reactions-enabled': '1', 'data-emit-metadata': '0', 'data-input-position': 'top', 'data-theme': giscusTheme(),
      'data-lang': 'zh-CN', 'data-loading': 'lazy', crossorigin: 'anonymous', async: ''
    };
    Object.keys(attrs).forEach(function (k) { g.setAttribute(k, attrs[k]); });
    giscus.appendChild(g);
  }

  /* learning.js (loaded on every page with window.CNR_PAGE) owns read marks, sidebar checks and "继续学习" and keeps
     guest and signed-in records apart; this original progress code only runs if learning.js is not on the page. */
  if (!window.CNR_PAGE) {
  /* ---------- Learning progress: pages read, per-tutorial counts, "继续学习" on the home page (this browser only).
     Same feature and storage format as compilenrun.com (cnr_progress). Paths are compared decoded. ---------- */
  var escHtml = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var PKEY = 'cnr_progress';
  var loadProgress = function () {
    var p = null;
    try { p = JSON.parse(store.get(PKEY) || 'null'); } catch (e) {}
    return p && p.v === 1 && p.done && p.tuts ? p : { v: 1, done: {}, tuts: {} };
  };
  var progress = loadProgress();
  var saveProgress = function () { store.set(PKEY, JSON.stringify(progress)); };
  var pageTitle = document.title.replace(/\s*\|\s*[^|]*$/, '');
  // Doc pages listed in a sidebar tree; generated category indexes (/docs/category/...) are not pages to read.
  var sidebarPages = function (scope) {
    var seen = {};
    scope.querySelectorAll('a.menu__link[href]').forEach(function (a) {
      var h = dec(a.getAttribute('href'));
      if (h.charAt(0) === '/' && h.indexOf('/docs/category/') !== 0) seen[h] = true;
    });
    return Object.keys(seen);
  };
  var sideNav = document.querySelector('[data-doc-sidebar][data-tut]');
  var tutBar = null;
  var markRead = function (a, on) {
    var check = a.querySelector(':scope > .cnr-check');
    if (on && !check) a.insertAdjacentHTML('beforeend', '<span class="cnr-check" title="已完成" aria-label="（已完成）">✓</span>');
    else if (!on && check) check.remove();
  };
  var paintProgress = function () {
    if (!sideNav) return;
    var pages = sidebarPages(sideNav.querySelector('.theme-doc-sidebar-menu'));
    var n = pages.filter(function (h) { return progress.done[h]; }).length;
    // Both the desktop sidebar and the copy in the mobile menu.
    document.querySelectorAll('.theme-doc-sidebar-menu').forEach(function (menu) {
      menu.querySelectorAll('.theme-doc-sidebar-item-link > a.menu__link[href]').forEach(function (a) { markRead(a, !!progress.done[dec(a.getAttribute('href'))]); });
      menu.querySelectorAll('.theme-doc-sidebar-item-category').forEach(function (li) {
        var own = li.querySelector(':scope > .menu__list-item-collapsible > .menu__link');
        var sub = li.querySelector(':scope > .menu__list');
        var all = sub ? sidebarPages(sub) : [];
        var href = dec(own.getAttribute('href') || '');
        if (href && href.charAt(0) === '/' && href.indexOf('/docs/category/') !== 0) all.push(href);
        markRead(own, all.length > 0 && all.every(function (h) { return progress.done[h]; }));
      });
    });
    if (!tutBar) {
      tutBar = document.createElement('div');
      tutBar.className = 'cnr-progress';
      sideNav.insertBefore(tutBar, sideNav.firstChild);
    }
    var pct = pages.length ? Math.round(100 * n / pages.length) : 0;
    tutBar.hidden = !n;
    tutBar.innerHTML = '<div class="cnr-progress__text"><span>已完成 ' + n + ' / ' + pages.length + ' 页</span><span>' + pct + '%</span></div>' +
      '<div class="cnr-progress__bar" role="progressbar" aria-label="教程进度" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>';
    var dir = sideNav.getAttribute('data-tut');
    var t = progress.tuts[dir] || (progress.tuts[dir] = {});
    t.label = sideNav.getAttribute('data-tut-label');
    t.url = sideNav.getAttribute('data-tut-url');
    t.total = pages.length;
    t.done = n;
  };
  // Generated category pages list pages and sections as cards; sections show how many of their pages are done.
  var paintCards = function () {
    var cats = {};
    if (sideNav) sideNav.querySelectorAll('.theme-doc-sidebar-item-category').forEach(function (li) {
      var own = li.querySelector(':scope > .menu__list-item-collapsible > .menu__link');
      var sub = li.querySelector(':scope > .menu__list');
      var href = dec(own.getAttribute('href') || '');
      if (!sub || !href || href.charAt(0) !== '/') return;
      var all = sidebarPages(sub);
      if (href.indexOf('/docs/category/') !== 0 && all.indexOf(href) < 0) all.push(href);
      cats[href] = all;
    });
    document.querySelectorAll('.generatedIndexPage_vN6x a.theme-doc-card-container[href]').forEach(function (a) {
      var href = dec(a.getAttribute('href')), all = cats[href];
      var n = all ? all.filter(function (h) { return progress.done[h]; }).length : 0;
      a.classList.toggle('cnr-card-read', all ? n === all.length : !!progress.done[href]);
      var desc = a.querySelector('.cardDescription_L2fP');
      if (all && n && desc) desc.textContent = '共 ' + all.length + ' 页 · 已完成 ' + n + ' 页';
    });
  };
  paintProgress();
  paintCards();

  // Only the old Docusaurus-style block had a mark-done button; the current .cnr-learn holds the votes (below).
  var learn = document.querySelector('[data-learn]');
  if (learn && learn.querySelector('[data-mark-done]')) {
    learn.hidden = false;
    if (sideNav) {
      var cur = progress.tuts[sideNav.getAttribute('data-tut')];
      cur.last = { path: here, title: pageTitle };
      cur.t = Date.now();
    }
    saveProgress();
    var doneBtn = learn.querySelector('[data-mark-done]');
    var paintDone = function () {
      var d = !!progress.done[here];
      doneBtn.setAttribute('aria-pressed', String(d));
      doneBtn.innerHTML = d ? '<span aria-hidden="true">✓</span> 已完成' : '标记为已完成';
      doneBtn.title = d ? '点击取消“已完成”' : '读到页面底部时也会自动标记为已完成';
    };
    var setDone = function (d) {
      progress = loadProgress(); // another tab may have saved since this page loaded
      if (d) progress.done[here] = Date.now(); else delete progress.done[here];
      paintProgress();
      saveProgress();
      paintDone();
    };
    var touched = false;
    doneBtn.onclick = function () { touched = true; setDone(!progress.done[here]); };
    paintDone();
    // Reaching the end of the page counts as reading it, once the reader has spent a little time here.
    var started = Date.now();
    if (!progress.done[here] && 'IntersectionObserver' in window) {
      var seenEnd = new IntersectionObserver(function (entries) {
        if (!entries.some(function (e) { return e.isIntersecting; })) return;
        seenEnd.disconnect();
        setTimeout(function () { if (!touched && !progress.done[here]) setDone(true); }, Math.max(0, 20000 - (Date.now() - started)));
      });
      seenEnd.observe(learn);
    }
  }

  // Home page: the tutorials this reader has been working through.
  var cont = document.querySelector('[data-continue]');
  if (cont) {
    var recent = Object.keys(progress.tuts).map(function (k) { return progress.tuts[k]; })
      .filter(function (t) { return t.last && /^\/docs\//.test(t.last.path); })
      .sort(function (a, b) { return (b.t || 0) - (a.t || 0); }).slice(0, 4);
    if (recent.length) {
      cont.innerHTML = '<div class="container"><div class="cnr-continue__head"><h2>继续学习</h2>' +
        '<button type="button" class="clean-btn cnr-continue__clear">清除学习进度</button></div><div class="row">' +
        recent.map(function (t) {
          var pct = t.total ? Math.round(100 * t.done / t.total) : 0;
          return '<div class="col col--3"><a class="card cnr-continue__card" href="' + escHtml(t.last.path) + '">' +
            '<strong>' + escHtml(t.label) + '</strong><span class="cnr-continue__last">继续：' + escHtml(t.last.title) + ' →</span>' +
            '<span class="cnr-progress__bar"><i style="width:' + pct + '%"></i></span>' +
            '<span class="cnr-continue__count">已完成 ' + (t.done || 0) + ' / ' + (t.total || 0) + ' 页</span></a></div>';
        }).join('') + '</div><p class="cnr-continue__note">学习进度只保存在当前浏览器中。</p></div>';
      cont.hidden = false;
      cont.querySelector('.cnr-continue__clear').onclick = function () {
        if (!confirm('确定要清除这个浏览器中的学习进度吗？')) return;
        try { localStorage.removeItem(PKEY); } catch (e) {}
        cont.hidden = true;
      };
    }
  }
  }

  /* ---------- "这个页面有帮助吗？" and "开始测验" under each tutorial page (same block as compilenrun.com; read marks,
     bookmarks and notes are in learning.js) ---------- */
  var learn = document.querySelector('[data-learn]');
  if (learn && learn.querySelector('[data-vote]')) {
    learn.hidden = false;
    // The Worker keys votes by the raw (percent-encoded) path, as compilenrun.com does; `here` above is decoded.
    var votePath = location.pathname;
    /* "Was this page helpful?" -> the echocool-worker Worker (/api/feedback), one vote per page and reader. */
    var feedbackEndpoint = {{ site.Params.feedback.endpoint | default "/api/feedback" | jsonify | safeJS }};
    var VKEY = 'cnr_votes';
    var votes = {};
    try { votes = JSON.parse(store.get(VKEY) || '{}') || {}; } catch (e) {}
    var voteBtns = learn.querySelectorAll('[data-vote]');
    var commentForm = learn.querySelector('[data-vote-comment]');
    var thanks = learn.querySelector('[data-vote-thanks]');
    var paintVote = function (v) { voteBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-vote')) === v)); }); };
    var say = function (msg) { thanks.textContent = msg; thanks.hidden = !msg; };
    var sendVote = function (body) {
      return fetch(feedbackEndpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { if (!r.ok) throw new Error(); });
    };
    paintVote(votes[votePath]);
    voteBtns.forEach(function (b) {
      b.onclick = function () {
        var v = Number(b.getAttribute('data-vote'));
        paintVote(v);
        commentForm.hidden = v !== -1;
        say(v === 1 ? '感谢你的反馈！很高兴这篇内容对你有帮助。' : '很抱歉没能帮到你。你觉得哪里需要改进？');
        if (v === -1) commentForm.querySelector('textarea').focus();
        sendVote({ path: votePath, vote: v }).then(function () {
          votes[votePath] = v;
          store.set(VKEY, JSON.stringify(votes));
        }).catch(function () { paintVote(votes[votePath]); commentForm.hidden = true; say('投票没有发送成功，请稍后再试。'); });
      };
    });
    commentForm.onsubmit = function (e) {
      e.preventDefault();
      var text = commentForm.querySelector('textarea').value.trim();
      if (!text) return;
      var send = commentForm.querySelector('button');
      send.disabled = true;
      sendVote({ path: votePath, vote: -1, comment: text }).then(function () {
        commentForm.hidden = true;
        say('感谢你的反馈！你的建议会帮助我们改进这个页面。');
      }).catch(function () { say('反馈没有发送成功，请稍后再试。'); })
        .then(function () { send.disabled = false; });
    };
  }

  /* ---------- Ask AI (Cloudflare Worker echocool-worker; it answers in Simplified Chinese) ---------- */
  var askEndpoint = {{ site.Params.askAI.endpoint | default "/api/ask" | jsonify | safeJS }};
  var askSitekey = {{ site.Params.askAI.turnstileSitekey | jsonify | safeJS }};
  if (document.querySelector('[data-pagefind-body]') && /^\/(docs|blog)\//.test(location.pathname)) {
    var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var inline = function (s) {
      return s.split(/(`[^`\n]+`)/).map(function (part, i) {
        if (i % 2) return '<code>' + esc(part.slice(1, -1)) + '</code>';
        return esc(part)
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>')
          .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener nofollow">$1</a>');
      }).join('');
    };
    // Fallback renderer for the moment before marked/DOMPurify have loaded: fenced code, headings, flat lists, paragraphs.
    var simpleMarkdown = function (src) {
      var out = [], para = [], list = null, code = null;
      var flushPara = function () { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
      var flushList = function () { if (list) { out.push('<' + list.tag + '>' + list.items.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</' + list.tag + '>'); list = null; } };
      src.split('\n').forEach(function (line) {
        var fence = line.match(/^\s*```\s*([\w+#.-]*)/);
        if (code) {
          if (fence && !fence[1]) { out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>'); code = null; } else code.push(line);
          return;
        }
        if (fence) { flushPara(); flushList(); code = []; return; }
        var m;
        if (!line.trim()) { flushPara(); flushList(); }
        else if ((m = line.match(/^#{1,6}\s+(.*)/))) { flushPara(); flushList(); out.push('<p><strong>' + inline(m[1]) + '</strong></p>'); }
        else if ((m = line.match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.*)/))) {
          flushPara();
          var tag = m[1] ? 'ul' : 'ol';
          if (!list || list.tag !== tag) { flushList(); list = { tag: tag, items: [] }; }
          list.items.push(m[3]);
        }
        else if (list && /^\s+\S/.test(line)) list.items[list.items.length - 1] += ' ' + line.trim();
        else { flushList(); para.push(line.trim()); }
      });
      if (code) out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
      flushPara(); flushList();
      return out.join('');
    };

    // Answers are rendered with marked (GFM) and sanitized with DOMPurify, loaded the first time the chat opens.
    var mdLibs = null, rendered = [];
    var loadScript = function (src) {
      return new Promise(function (ok, fail) { var sc = document.createElement('script'); sc.src = src; sc.async = true; sc.onload = ok; sc.onerror = fail; document.head.appendChild(sc); });
    };
    var loadMarkdown = function () {
      if (!mdLibs) {
        mdLibs = Promise.all([
          loadScript('https://cdn.jsdelivr.net/npm/marked@15.0.12/marked.min.js'),
          loadScript('https://cdn.jsdelivr.net/npm/dompurify@3.2.6/dist/purify.min.js')
        ]).then(function () {
          window.DOMPurify.addHook('afterSanitizeAttributes', function (node) {
            if (node.tagName === 'A') { node.setAttribute('target', '_blank'); node.setAttribute('rel', 'noopener nofollow'); }
          });
          rendered.forEach(function (r) { r.el.innerHTML = markdown(r.text); });
        }).catch(function () {});
      }
      return mdLibs;
    };
    var markdown = function (src) {
      if (window.marked && window.DOMPurify) {
        return window.DOMPurify.sanitize(window.marked.parse(src, { gfm: true, breaks: false }), { FORBID_TAGS: ['style', 'img', 'form', 'input'], FORBID_ATTR: ['style'] });
      }
      return simpleMarkdown(src);
    };

    var sparkle = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9zM5 15l.7 1.8 1.8.7-1.8.7L5 20l-.7-1.8-1.8-.7 1.8-.7z"/></svg>';
    var askBtn = document.createElement('button');
    askBtn.type = 'button';
    askBtn.className = 'cnr-ask-btn';
    askBtn.setAttribute('aria-haspopup', 'dialog');
    askBtn.setAttribute('aria-expanded', 'false');
    askBtn.innerHTML = sparkle + '<span>问一问 AI</span>';
    var panel = document.createElement('div');
    panel.className = 'cnr-ask';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'AI 助手：关于本页提问');
    panel.innerHTML =
      '<div class="cnr-ask__head">' + sparkle + '<div class="cnr-ask__title"><strong>AI 助手</strong><span>关于本页提问</span></div>' +
      '<button type="button" class="cnr-ask__icon" data-ask-reset title="新对话" aria-label="开始新对话"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg></button>' +
      '<button type="button" class="cnr-ask__icon" data-ask-close title="关闭" aria-label="关闭 AI 助手"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button></div>' +
      '<div class="cnr-ask__log" aria-live="polite"></div>' +
      '<div class="cnr-ask__ts"></div>' +
      '<form class="cnr-ask__form"><textarea rows="1" maxlength="1000" placeholder="关于本页提个问题…" aria-label="你的问题"></textarea>' +
      '<button type="submit" class="cnr-ask__send" aria-label="发送"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg></button></form>' +
      '<div class="cnr-ask__note">AI 的回答可能有误，请对照教程内容核实。</div>';
    document.body.appendChild(askBtn);
    document.body.appendChild(panel);

    var log = panel.querySelector('.cnr-ask__log');
    var form = panel.querySelector('form');
    var box = panel.querySelector('textarea');
    var send = panel.querySelector('.cnr-ask__send');
    var chat = [], busy = null;

    // Turnstile: rendered (interaction-only, so usually invisible) when the panel first opens. Each question
    // spends one token; the widget is then reset to fetch the next one.
    var ts = { id: null, token: null, error: null, waiting: [] };
    var tsGive = function (t) { ts.token = t; ts.error = null; if (t) { ts.waiting.splice(0).forEach(function (w) { w.ok(t); }); } };
    var tsFail = function (msg) { ts.error = msg; ts.waiting.splice(0).forEach(function (w) { w.fail(new Error(msg)); }); };
    var tsLoad = function () {
      if (ts.loading || !askSitekey) return;
      ts.loading = true;
      window.cnrAskTurnstile = function () {
        ts.id = window.turnstile.render(panel.querySelector('.cnr-ask__ts'), {
          sitekey: askSitekey,
          appearance: 'interaction-only',
          theme: root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
          action: 'ask-ai',
          callback: tsGive,
          'expired-callback': function () { ts.token = null; window.turnstile.reset(ts.id); },
          // Turnstile retries on its own after an error; tell anyone waiting now instead of after the timeout.
          'error-callback': function () { ts.token = null; tsFail('人机验证失败。请完成下方的验证，或刷新页面后再提问。'); }
        });
      };
      var sc = document.createElement('script');
      sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=cnrAskTurnstile';
      sc.async = true;
      sc.onerror = function () { tsFail('无法加载人机验证。请为本站关闭拦截插件后再试。'); };
      document.head.appendChild(sc);
    };
    var tsToken = function () {
      if (!askSitekey) return Promise.resolve('');
      tsLoad();
      if (ts.token) { var t = ts.token; ts.token = null; return Promise.resolve(t); }
      if (ts.error) return Promise.reject(new Error(ts.error));
      return new Promise(function (ok, fail) {
        var w = { ok: function (t) { clearTimeout(timer); ts.token = null; ok(t); }, fail: function (e) { clearTimeout(timer); fail(e); } };
        var timer = setTimeout(function () {
          ts.waiting = ts.waiting.filter(function (x) { return x !== w; });
          fail(new Error('人机验证尚未完成。请完成下方的验证后再提问。'));
        }, 45000);
        ts.waiting.push(w);
      });
    };
    var tsNext = function () { if (window.turnstile && ts.id !== null) window.turnstile.reset(ts.id); };
    var suggestions = ['用几个要点总结这个页面', '逐行解释第一个代码示例', '学完这篇教程后我该练习什么？'];

    var intro = function () {
      log.innerHTML = '<div class="cnr-ask__intro"><p>你好！关于<strong>' + esc(document.title.replace(/\s*\|\s*代码酷\s*$/, '')) + '</strong>，有什么问题都可以问我。</p>' +
        '<button type="button" class="cnr-ask__chip cnr-ask__chip--quiz" data-ask-quiz>🧠 测验一下本页内容</button>' +
        suggestions.map(function (s) { return '<button type="button" class="cnr-ask__chip">' + esc(s) + '</button>'; }).join('') + '</div>';
      log.querySelectorAll('.cnr-ask__chip').forEach(function (b) { b.onclick = function () { if (b.hasAttribute('data-ask-quiz')) quiz(); else ask(b.textContent); }; });
      var chip = log.querySelector('[data-ask-quiz]');
      if (chip) chip.addEventListener('mouseenter', prefetchQuiz);
    };
    var addMsg = function (role, html) {
      var intro = log.querySelector('.cnr-ask__intro');
      if (intro) intro.remove();
      var d = document.createElement('div');
      d.className = 'cnr-ask__msg cnr-ask__msg--' + role;
      d.innerHTML = html;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    };
    var grow = function () { box.style.height = 'auto'; box.style.height = Math.min(box.scrollHeight, 140) + 'px'; };
    var setBusy = function (b) { busy = b; send.disabled = !!b; box.disabled = !!b; };

    var ask = function (q) {
      q = q.trim();
      if (!q || busy) return;
      addMsg('user', esc(q).replace(/\n/g, '<br>'));
      box.value = '';
      grow();
      var out = addMsg('ai', '<span class="cnr-ask__typing"><i></i><i></i><i></i></span>');
      var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
      setBusy(ctrl || true);
      var text = '', frame = 0;
      var paint = function () { frame = 0; var stick = log.scrollHeight - log.scrollTop - log.clientHeight < 40; out.innerHTML = markdown(text); if (stick) log.scrollTop = log.scrollHeight; };
      tsToken().then(function (token) {
        tsNext();
        return fetch(askEndpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path: location.pathname, question: q, history: chat.slice(-6), turnstile: token }),
          signal: ctrl ? ctrl.signal : undefined
        });
      }).then(function (res) {
        if (!res.ok) return res.json().catch(function () { return {}; }).then(function (j) { throw new Error(j.error || '出了点问题，请重试。'); });
        var reader = res.body.getReader(), dec = new TextDecoder(), buf = '';
        var pump = function () {
          return reader.read().then(function (r) {
            if (r.done) return;
            buf += dec.decode(r.value, { stream: true });
            var lines = buf.split('\n');
            buf = lines.pop();
            lines.forEach(function (l) {
              l = l.trim();
              if (l.indexOf('data:') !== 0) return;
              var data = l.slice(5).trim();
              if (data === '[DONE]') return;
              try {
                var j = JSON.parse(data), c = j.choices && j.choices[0] && j.choices[0].delta;
                text += (c && c.content) || j.response || '';
              } catch (e) {}
            });
            if (text && !frame) frame = requestAnimationFrame(paint);
            return pump();
          });
        };
        return pump();
      }).then(function () {
        if (!text) throw new Error('没有收到回答，请重试。');
        paint();
        rendered.push({ el: out, text: text });
        chat.push({ role: 'user', content: q }, { role: 'assistant', content: text });
      }).catch(function (e) {
        if (e && e.name === 'AbortError') { if (text) paint(); else out.remove(); return; }
        out.classList.add('cnr-ask__msg--error');
        out.textContent = (e && e.message) || '出了点问题，请重试。';
      }).then(function () { setBusy(null); if (!panel.hidden) box.focus(); });
    };

    /* "Quiz me": the Worker returns a cached quiz as JSON, or streams a new one (one checked question per line,
       NDJSON), so the reader starts on question 1 while the rest are still being written. Answers are checked
       here; best scores are kept in this browser. */
    var quizEndpoint = askEndpoint.replace(/\/ask$/, '/quiz');
    var quizRound = 0, quizNext = null;
    var QKEY = 'cnr_quiz';
    // A "feed" of questions that fills in as they arrive: {qs, done, error, onChange}.
    var fetchQuiz = function (round) {
      var feed = { round: round, qs: [], done: false, error: null, onChange: null };
      var changed = function () { if (feed.onChange) feed.onChange(); };
      var fail = function (msg) { feed.error = msg || '测验加载失败，请重试。'; feed.done = true; changed(); };
      tsToken().then(function (token) {
        tsNext();
        return fetch(quizEndpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ path: location.pathname, round: round, turnstile: token, stream: true }) });
      }).then(function (res) {
        if (!/ndjson/.test(res.headers.get('content-type') || '')) {
          return res.json().catch(function () { return {}; }).then(function (j) {
            if (!res.ok || !j.questions || !j.questions.length) return fail(j.error);
            feed.qs = j.questions;
            feed.done = true;
            changed();
          });
        }
        var reader = res.body.getReader(), dec = new TextDecoder(), buf = '';
        var pump = function () {
          return reader.read().then(function (r) {
            if (r.done) { if (!feed.done) { if (feed.qs.length) { feed.done = true; changed(); } else fail(); } return; }
            buf += dec.decode(r.value, { stream: true });
            var lines = buf.split('\n');
            buf = lines.pop();
            lines.forEach(function (l) {
              if (!l.trim()) return;
              var m;
              try { m = JSON.parse(l); } catch (e) { return; }
              if (m.question) { feed.qs.push(m.question); changed(); }
              else if (m.done) { feed.done = true; changed(); }
              else if (m.error) { if (feed.qs.length) { feed.done = true; changed(); } else fail(m.error); }
            });
            return pump();
          });
        };
        return pump();
      }).catch(function (e) { fail(e && e.message); });
      return feed;
    };
    // Hovering or focusing "Quiz me" starts the request, so a new quiz is a few seconds further along on click.
    var prefetchQuiz = function () { if (!quizNext && askSitekey !== undefined) { tsLoad(); quizNext = fetchQuiz(quizRound); } };
    var quiz = function () {
      if (busy) return;
      addMsg('user', '🧠 测验一下本页内容');
      var out = addMsg('ai', '<span class="cnr-ask__typing"><i></i><i></i><i></i></span><div class="cnr-ask__wait">正在出题…</div>');
      var feed = quizNext && quizNext.round === quizRound ? quizNext : fetchQuiz(quizRound);
      quizNext = null;
      quizRound++;
      setBusy(true);
      var start = function () {
        if (feed.qs.length) { feed.onChange = null; setBusy(null); playQuiz(out, feed); }
        else if (feed.error) {
          feed.onChange = null;
          setBusy(null);
          out.classList.add('cnr-ask__msg--error');
          out.textContent = feed.error;
        }
      };
      feed.onChange = start;
      start();
    };
    var playQuiz = function (out, feed) {
      var qs = feed.qs, i = 0, score = 0, picks = [], waiting = false;
      out.classList.add('cnr-ask__msg--quiz');
      var count = function () { return '第 ' + (i + 1) + ' 题' + (feed.done ? '，共 ' + qs.length + ' 题' : ''); };
      feed.onChange = function () {
        var label = out.querySelector('.cnr-quiz__count');
        if (label) label.textContent = count();
        var next = out.querySelector('.cnr-quiz__next');
        if (next && !waiting && feed.done && i === qs.length - 1) next.textContent = '查看得分';
        if (waiting && (i < qs.length || feed.done)) { waiting = false; if (i < qs.length) show(); else finish(); }
      };
      var show = function () {
        var q = qs[i];
        out.innerHTML = '<div class="cnr-quiz"><div class="cnr-quiz__count">' + count() + '</div>' +
          '<p class="cnr-quiz__q">' + inline(q.question) + '</p>' +
          (q.code ? '<pre><code>' + esc(q.code) + '</code></pre>' : '') +
          '<div class="cnr-quiz__opts" role="group" aria-label="选项">' + q.options.map(function (o, k) {
            return '<button type="button" class="cnr-quiz__opt" data-k="' + k + '"><b>' + 'ABCD'[k] + '</b><span>' + (/\n/.test(o) ? '<code class="cnr-quiz__multi">' + esc(o) + '</code>' : inline(o)) + '</span></button>';
          }).join('') + '</div><div class="cnr-quiz__result" aria-live="polite"></div></div>';
        out.querySelectorAll('.cnr-quiz__opt').forEach(function (b) { b.onclick = function () { pick(Number(b.getAttribute('data-k'))); }; });
        var top = out.offsetTop - log.offsetTop - 8;
        if (log.scrollTop > top || log.scrollTop + log.clientHeight < top + 80) log.scrollTop = top;
      };
      var pick = function (k) {
        var q = qs[i], right = k === q.answer;
        if (right) score++;
        picks.push(k);
        out.querySelectorAll('.cnr-quiz__opt').forEach(function (b) {
          var n = Number(b.getAttribute('data-k'));
          b.disabled = true;
          if (n === q.answer) b.classList.add('cnr-quiz__opt--right');
          else if (n === k) b.classList.add('cnr-quiz__opt--wrong');
        });
        out.querySelector('.cnr-quiz__result').innerHTML = '<p><strong>' + (right ? '✅ 正确！' : '❌ 不正确。正确答案是 ' + 'ABCD'[q.answer] + '。') + '</strong> ' + inline(q.explanation) + '</p>' +
          '<button type="button" class="cnr-quiz__next">' + (feed.done && i === qs.length - 1 ? '查看得分' : '下一题 →') + '</button>';
        var next = out.querySelector('.cnr-quiz__next');
        next.onclick = function () {
          i++;
          if (i < qs.length) show();
          else if (feed.done) finish();
          else {
            // The next question is still being written or checked.
            waiting = true;
            next.disabled = true;
            next.innerHTML = '<span class="cnr-ask__typing"><i></i><i></i><i></i></span> 正在检查下一题…';
          }
        };
        next.focus();
        log.scrollTop = Math.max(log.scrollTop, out.offsetTop - log.offsetTop + out.offsetHeight - log.clientHeight + 8);
      };
      var finish = function () {
        feed.onChange = null;
        var pct = score / qs.length;
        var best = {};
        try { best = JSON.parse(store.get(QKEY) || '{}') || {}; } catch (e) {}
        var prev = best[location.pathname];
        if (!prev || score / prev.total > prev.score / prev.total) { best[location.pathname] = { score: score, total: qs.length, t: Date.now() }; store.set(QKEY, JSON.stringify(best)); }
        out.innerHTML = '<div class="cnr-quiz cnr-quiz--done"><div class="cnr-quiz__score">' + (pct === 1 ? '🏆' : pct >= 0.6 ? '🎉' : '📚') + ' ' + score + ' / ' + qs.length + '</div>' +
          '<p>' + (pct === 1 ? '满分！你已经很好地掌握了本页内容。' : pct >= 0.6 ? '做得不错。看看下面答错的题目吧。' : '建议再读一遍，答错的题目指出了需要复习的部分。') + '</p>' +
          '<ol class="cnr-quiz__review">' + qs.map(function (q, n) {
            return '<li class="' + (picks[n] === q.answer ? 'is-right' : 'is-wrong') + '">' + inline(q.question) + '<br><span>' + (picks[n] === q.answer ? '✅ ' : '❌ 你选了 ' + 'ABCD'[picks[n]] + '。') + '答案：' + 'ABCD'[q.answer] + ') ' + (/\n/.test(q.options[q.answer]) ? '' : inline(q.options[q.answer])) + '</span></li>';
          }).join('') + '</ol><button type="button" class="cnr-quiz__next" data-again>再来一组测验</button></div>';
        out.querySelector('[data-again]').onclick = quiz;
        out.querySelector('[data-again]').onmouseenter = prefetchQuiz;
        // Follow-up questions in the chat ("why is question 2 B?") can see the quiz.
        chat.push({ role: 'user', content: '请就本页内容给我出一组测验。' }, { role: 'assistant', content: '测验（得分 ' + score + '/' + qs.length + '）：\n' + qs.map(function (q, n) {
          return (n + 1) + '. ' + q.question + (q.code ? '\n' + q.code : '') + '\n' + q.options.map(function (o, k) { return 'ABCD'[k] + ') ' + o; }).join('\n') + '\n正确答案：' + 'ABCD'[q.answer] + '。读者选择：' + 'ABCD'[picks[n]] + '。';
        }).join('\n\n') });
        log.scrollTop = out.offsetTop - log.offsetTop - 8;
      };
      show();
    };

    var openAsk = function () {
      panel.hidden = false;
      askBtn.hidden = true;
      askBtn.setAttribute('aria-expanded', 'true');
      root.classList.add('cnr-ask-open');
      if (!log.children.length) intro();
      tsLoad();
      loadMarkdown();
      box.focus();
    };
    var closeAsk = function () {
      panel.hidden = true;
      askBtn.hidden = false;
      askBtn.setAttribute('aria-expanded', 'false');
      root.classList.remove('cnr-ask-open');
      askBtn.focus();
    };
    askBtn.onclick = openAsk;
    // "开始测验" under the tutorial opens the chat and starts a quiz.
    document.querySelectorAll('[data-quiz]').forEach(function (b) {
      b.hidden = false;
      b.onclick = function () { openAsk(); quiz(); };
      b.addEventListener('mouseenter', prefetchQuiz);
      b.addEventListener('focus', prefetchQuiz);
    });
    panel.querySelector('[data-ask-close]').onclick = closeAsk;
    panel.querySelector('[data-ask-reset]').onclick = function () {
      if (busy && busy.abort) busy.abort();
      chat = [];
      rendered = [];
      intro();
      box.focus();
    };
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAsk(); });
    box.addEventListener('input', grow);
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(box.value); }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(box.value); });
  }

  /* ---------- WeChat follow float + popup (port of src/components/WechatFollow) ---------- */
  var wfloat = document.querySelector('[data-wechat-float]'), wmodal = document.querySelector('[data-wechat-modal]');
  if (wfloat && wmodal) {
    var ua = navigator.userAgent || '';
    var hint = /MicroMessenger/i.test(ua) ? '长按二维码，识别并关注公众号'
      : /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ? '保存二维码，在微信中「扫一扫」关注' : '打开微信「扫一扫」，扫码关注公众号';
    document.querySelectorAll('[data-wechat-hint]').forEach(function (h) { h.textContent = hint; });
    var wkey = wmodal.getAttribute('data-key'), floatHidden = false, prevOverflow = '';
    var onEsc = function (e) { if (e.key === 'Escape') closeWechat(); };
    var openWechat = function () {
      if (!wmodal.hidden) return;
      wmodal.hidden = false; wfloat.hidden = true;
      prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onEsc);
    };
    var closeWechat = function () {
      if (wmodal.hidden) return;
      wmodal.hidden = true; wfloat.hidden = floatHidden;
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onEsc);
      store.set(wkey, String(Date.now()));
    };
    wfloat.querySelector('[data-wechat-open]').addEventListener('click', openWechat);
    wfloat.querySelector('[data-wechat-hide]').addEventListener('click', function () { floatHidden = true; wfloat.hidden = true; });
    wmodal.addEventListener('click', closeWechat);
    wmodal.querySelector('[role=dialog]').addEventListener('click', function (e) { e.stopPropagation(); });
    wmodal.querySelectorAll('[data-wechat-close]').forEach(function (b) { b.addEventListener('click', closeWechat); });
    if (wmodal.getAttribute('data-popup') === 'true') {
      var at = Number(store.get(wkey)) || 0, ttl = Number(wmodal.getAttribute('data-days')) * 864e5;
      if (!(at && Date.now() - at < ttl)) setTimeout(openWechat, Number(wmodal.getAttribute('data-delay')));
    }
  }
})();
