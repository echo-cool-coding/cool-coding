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

  var learn = document.querySelector('[data-learn]');
  if (learn) {
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
