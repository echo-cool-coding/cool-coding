/* Run buttons for Python, JavaScript, TypeScript, PHP, SQL and HTML examples. Everything runs in the reader's
   browser: Python (Pyodide), JavaScript, TypeScript and PHP (php-wasm) in Web Workers, so Stop can end an endless
   loop; SQL on SQLite (sql.js), or on PostgreSQL (PGlite) in the PostgreSQL tutorial; HTML and JavaScript that
   uses the page in a sandboxed preview frame. Loaded only on pages with such code blocks. */
(function () {
  var PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/';
  var SQLJS = 'https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/';
  var PGLITE = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.8/dist/index.js';
  var TYPESCRIPT = 'https://cdn.jsdelivr.net/npm/typescript@6.0.3/lib/';
  var PHPWASM = 'https://cdn.jsdelivr.net/npm/php-wasm@0.1.0/PhpWeb.mjs';
  var JS_TIMEOUT = 10000;
  var MAX_OUTPUT = 100000;
  var MAX_ROWS = 200;
  var path = location.pathname;

  /* ---------- Text (English, or Chinese on pages with <html lang="zh-…">; the same file serves both sites) ---------- */
  var STRINGS = {
    en: {
      run: 'Run', stop: 'Stop', preview: 'Preview', edit: 'Edit', doneEditing: 'Done editing', editTitle: 'Edit this example, then run it',
      undo: 'Undo edits', output: 'Output', clear: 'Clear', restartPython: 'Restart Python', resetDb: 'Reset database',
      runLabel: 'Run this example', stopLabel: 'Stop the example', stdin: 'Program input: one line per input() call', stdinLabel: 'Program input',
      inBrowser: 'runs in your browser', mysqlLike: 'SQLite (close to MySQL)', jsHtml: 'JavaScript + the HTML example above', jsPage: 'JavaScript + page preview',
      htmlPreview: 'HTML preview', previewTitle: 'Preview of the example', plotAlt: 'Plot produced by the example',
      loadPython: 'Loading Python… the first run downloads about 10 MB.', loadTs: 'Loading the TypeScript compiler… the first run downloads about 3 MB.',
      loadPhp: 'Loading PHP… the first run downloads about 3 MB.', loadPg: 'Starting PostgreSQL in your browser…', loadSqlite: 'Loading SQLite…',
      noOutput: '(no output)', done: 'Done.', rowsAffected: function (n) { return ' ' + n + (n === 1 ? ' row' : ' rows') + ' affected.'; },
      rows: function (n) { return n + (n === 1 ? ' row' : ' rows'); }, showingRows: function (a, b) { return 'Showing ' + a + ' of ' + b + ' rows'; },
      cutOff: '\n… output cut off here.\n', stopped: 'Stopped.', stoppedAfter: function (s) { return 'Stopped after ' + s + ' seconds.'; },
      stoppedPython: 'Stopped. Python was restarted, so earlier examples need to be run again.',
      download: function (f) { return 'Could not download ' + f + '. Check your connection or ad blocker.'; },
      startFail: function (what, why) { return 'Could not start ' + what + ' (' + why + '). Check your connection or ad blocker.'; },
      startFailShort: function (what, why) { return 'Could not start ' + what + ': ' + why; }, downloadFailed: 'download failed',
      tsLoadFail: function (why) { return 'Could not load the TypeScript compiler (' + why + ').'; },
      typeErrors: 'Type errors (the code still runs, as with tsc):',
      earlier: function (i, n) { return 'Running earlier example ' + i + ' of ' + n + '…'; },
      runDefiner: function (name) { return 'Run the example above that defines ' + name + ' first'; },
      runAbove: function (n) { return 'Run the ' + (n === 1 ? 'example' : n + ' examples') + ' above first, then this one'; },
      resetAgain: 'Reset the database and run this again',
      hintName: 'Hint: examples on this page share one Python session. Something this example uses may be defined in an earlier one.',
      hintInput: 'Hint: this program reads input. Type it in the "Program input" box, one line per input() call.',
      hintModule: 'Hint: this module is not available in the in-browser Python. Run the example on your computer instead.',
      hintTable: 'Hint: all SQL examples on this page share one database in your browser. The table may be created by an earlier example.',
      hintSqlite: function (db) { return 'Note: this runs on SQLite, so some ' + db + '-specific syntax is not supported.'; }
    },
    zh: {
      run: '运行', stop: '停止', preview: '预览', edit: '编辑', doneEditing: '完成编辑', editTitle: '修改这个示例，然后运行',
      undo: '撤销修改', output: '输出', clear: '清除', restartPython: '重启 Python', resetDb: '重置数据库',
      runLabel: '运行这个示例', stopLabel: '停止运行', stdin: '程序输入：每次调用 input() 读取一行', stdinLabel: '程序输入',
      inBrowser: '在浏览器中运行', mysqlLike: 'SQLite（接近 MySQL）', jsHtml: 'JavaScript + 上方的 HTML 示例', jsPage: 'JavaScript + 页面预览',
      htmlPreview: 'HTML 预览', previewTitle: '示例预览', plotAlt: '示例生成的图表',
      loadPython: '正在加载 Python…首次运行需要下载约 10 MB。', loadTs: '正在加载 TypeScript 编译器…首次运行需要下载约 3 MB。',
      loadPhp: '正在加载 PHP…首次运行需要下载约 3 MB。', loadPg: '正在浏览器中启动 PostgreSQL…', loadSqlite: '正在加载 SQLite…',
      noOutput: '（没有输出）', done: '执行完成。', rowsAffected: function (n) { return '影响了 ' + n + ' 行。'; },
      rows: function (n) { return '共 ' + n + ' 行'; }, showingRows: function (a, b) { return '显示 ' + b + ' 行中的前 ' + a + ' 行'; },
      cutOff: '\n…输出过长，已截断。\n', stopped: '已停止。', stoppedAfter: function (s) { return '运行超过 ' + s + ' 秒，已停止。'; },
      stoppedPython: '已停止。Python 已重启，前面的示例需要重新运行。',
      download: function (f) { return '无法下载 ' + f + '。请检查网络连接或广告拦截插件。'; },
      startFail: function (what, why) { return '无法启动 ' + what + '（' + why + '）。请检查网络连接或广告拦截插件。'; },
      startFailShort: function (what, why) { return '无法启动 ' + what + '：' + why; }, downloadFailed: '下载失败',
      tsLoadFail: function (why) { return '无法加载 TypeScript 编译器（' + why + '）。'; },
      typeErrors: '类型错误（和 tsc 一样，代码仍会运行）：',
      earlier: function (i, n) { return '正在运行前面的示例（' + i + ' / ' + n + '）…'; },
      runDefiner: function (name) { return '先运行上方定义 ' + name + ' 的示例'; },
      runAbove: function (n) { return '先运行上方的 ' + n + ' 个示例，再运行这个'; },
      resetAgain: '重置数据库并重新运行',
      hintName: '提示：本页的示例共用一个 Python 会话，这个示例用到的内容可能定义在前面的示例中。',
      hintInput: '提示：这个程序需要输入。请在“程序输入”框中输入，每次调用 input() 读取一行。',
      hintModule: '提示：浏览器中的 Python 没有这个模块，请在自己的电脑上运行这个示例。',
      hintTable: '提示：本页所有 SQL 示例共用浏览器中的同一个数据库，这张表可能由前面的示例创建。',
      hintSqlite: function (db) { return '注意：这里使用 SQLite 运行，部分 ' + db + ' 特有的语法不受支持。'; }
    }
  };
  var T = STRINGS[/^zh/i.test(document.documentElement.lang) ? 'zh' : 'en'];

  /* ---------- Which blocks get a Run button ---------- */
  var LANGS = { python: 'python', py: 'python', python3: 'python', javascript: 'js', js: 'js', sql: 'sql', typescript: 'ts', ts: 'ts', php: 'php', html: 'html' };
  // compilenrun.com has language/sql; echo.cool has database/sql.
  var SQL_PAGES = /^\/docs\/(language\/sql|database\/(sql|postgresql|mysql)|fundamental\/(database|interview))\//;
  var postgres = /^\/docs\/database\/postgresql\//.test(path);
  var mysql = /^\/docs\/database\/mysql\//.test(path);
  // Things the in-browser runtimes cannot do: servers, frameworks, GPUs, sockets, threads, other processes.
  var PY_NO = /^\s*(?:from|import)\s+(?:flask|django|fastapi|starlette|uvicorn|gunicorn|celery|airflow|torch|torchvision|tensorflow|keras|transformers|langchain\w*|openai|anthropic|boto3|botocore|socket|socketserver|multiprocessing|threading|concurrent|subprocess|tkinter|turtle|pygame|selenium|playwright|scrapy|requests|httpx|aiohttp|urllib3|psycopg2?|pymysql|mysql|pymongo|redis|kafka|confluent_kafka|pika|grpc|paramiko|docker|kubernetes|streamlit|gradio|dash|discord|telegram|smtplib|ftplib|http\.server|wsgiref|asyncpg|motor|sqlalchemy|alembic|pyspark|ray|dask)\b/m;
  var JS_NO = /\brequire\s*\(|^\s*(?:import|export)\s|\b(?:document|window|process|module|localStorage|sessionStorage|navigator)\.|\b(?:alert|prompt|confirm|fetch)\s*\(|\$\(|<\/?[A-Za-z][\w.-]*[\s/>]|\baddEventListener\b|\bXMLHttpRequest\b/m;
  // JavaScript that uses the page (document, alert, events) runs in the HTML preview instead, but not
  // Node, modules, React/JSX or jQuery.
  var JS_SERVER = /\brequire\s*\(|^\s*(?:import|export)\s|\b(?:process|module|exports)\.|\b__dirname\b|\$\(|\bjQuery\b|\bReact(?:DOM)?\b|\buse(?:State|Effect)\b|(?:return|=>)\s*\(?\s*<[A-Za-z]|^\s*<\/?[A-Za-z]/m;
  var JS_DOM = /\b(?:document|window|localStorage|sessionStorage|navigator)\.|\b(?:alert|prompt|confirm)\s*\(|\baddEventListener\b/;
  // TypeScript: like JavaScript (type arguments such as Array<string> are not HTML). Exported declarations are fine.
  var TS_NO = /\brequire\s*\(|^\s*import\s|^\s*export\s+(?:\{|\*|default\s+(?!(?:async\s+)?(?:function|class)\b)|=)|\b(?:document|window|process|module|localStorage|sessionStorage|navigator)\.|\b(?:alert|prompt|confirm|fetch)\s*\(|\$\(|<\/[a-z]+>|\baddEventListener\b|\bXMLHttpRequest\b|^\s*@(?:Component|Injectable|NgModule|Controller|Module|Entity)\b|\bdeclare\s+module\b/m;
  // PHP: no web servers, frameworks, databases, network, files outside the sandbox or other PHP files.
  var PHP_NO = /\b(?:Illuminate|Laravel|Symfony|Doctrine|Route::|Schema::|DB::|Auth::|artisan|composer|namespace\s|use\s+[A-Z]\w*\\|\$_(?:GET|POST|REQUEST|SERVER|SESSION|COOKIE|FILES|ENV)\b|\bheader\s*\(|session_start|setcookie|mysqli|\bPDO\b|curl_|file_get_contents\s*\(\s*['"]https?:|fsockopen|\bmail\s*\(|(?:require|include)(?:_once)?\b|\bwp_|add_action|add_filter|get_option|apply_filters|\$wpdb|\$this->(?:db|load|input)\b)/;
  var HTML_NO = /\{\{|\{%|<\?(?:php|=)|<%|@\{|@(?:if|foreach|section|extends|yield)\b|\bv-(?:if|for|bind|model|on)\b|\*ng(?:If|For)|\[\(ngModel\)\]|\bth:|\{#|<template\b|<slot\b|<x-|\{\$|<cfoutput|<asp:|<jsp:|<c:/i;
  var HTML_SHOWS = /<(?:body|div|p|h[1-6]|button|form|input|ul|ol|table|img|svg|canvas|section|main|header|nav|span|a|label|select|textarea|style|script|video|audio|details|article|footer|figure|dialog|progress|meter|fieldset)\b/i;
  var SQL_NO = /^\s*(?:mysql>|postgres=?[#>]|\w+=[#>]|psql\b|\\|\+-|\||DELIMITER\b|SOURCE\b)|\bCREATE\s+(?:OR\s+REPLACE\s+)?(?:DATABASE|SCHEMA|USER|ROLE)\b|\b(?:GRANT|REVOKE|FLUSH|SHOW|COPY)\s|^\s*USE\s+\w+|\bLOAD\s+DATA\b|\bpg_dump\b/im;

  // Blocks the runtime can execute at all; earlier ones may be run first to set up later ones.
  function candidate(kind, code) {
    if (/^\s*(?:>>>|\$ |PS>|C:\\)/m.test(code)) return false; // shell or REPL transcripts
    if (kind === 'python') return !PY_NO.test(code);
    if (kind === 'js') return !JS_NO.test(code);
    if (kind === 'dom') return !JS_SERVER.test(code) && JS_DOM.test(code);
    if (kind === 'ts') return !TS_NO.test(code);
    if (kind === 'php') return !PHP_NO.test(code) && !/^\s*\$\s/m.test(code);
    if (kind === 'html') return !HTML_NO.test(code) && HTML_SHOWS.test(code);
    if (kind === 'sql') {
      if (!SQL_PAGES.test(path) || SQL_NO.test(code)) return false;
      // Syntax templates such as "SELECT column1, ... FROM table_name WHERE condition;"
      if (/\.\.\.|…|\b(?:column_?\d|column_name|table_name|condition)\b|<\w+>|\[\s*(?:WHERE|AND|OR|ORDER|LIMIT|AS|NOT|ASC|DESC|,)/i.test(code)) return false;
      // ...or with Chinese placeholders (表1, 列名) outside strings and comments, as on echo.cool.
      if (/[\u3400-\u9fff]/.test(code.replace(/'[^']*'|"[^"]*"|--.*$|\/\*[\s\S]*?\*\//gm, ''))) return false;
      if (!postgres && /\$\$|\bLANGUAGE\s+plpgsql\b|\bCREATE\s+(?:OR\s+REPLACE\s+)?(?:PROCEDURE|FUNCTION)\b/i.test(code)) return false;
      return /\b(?:SELECT|INSERT|UPDATE|DELETE|CREATE|WITH|ALTER|DROP)\b/i.test(code);
    }
    return false;
  }
  // Blocks worth a Run button: they show something.
  function runnable(kind, code) {
    if (!candidate(kind, code)) return false;
    // Output calls inside comments do not count.
    code = kind === 'js' || kind === 'ts' || kind === 'php' ? code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
      : kind === 'python' ? code.replace(/^\s*#.*$/gm, '') : code;
    if (kind === 'php') return /\b(?:echo|print|printf|print_r|var_dump|var_export|vprintf)\b/.test(code);
    if (kind === 'js' || kind === 'ts') return /\bconsole\.(?:log|info|table|error|warn)\s*\(/.test(code);
    if (kind === 'python') {
      if (/\bprint\s*\(|\bplt\.(?:show|plot|savefig)\s*\(/.test(code)) return true;
      // A bare expression on the last line (df.head(), result), shown like in a notebook.
      var lines = code.replace(/\s+$/, '').split('\n').filter(function (l) { return l.trim() && !/^\s*#/.test(l); });
      var last = lines[lines.length - 1] || '';
      return /^[A-Za-z_][\w.]*(?:\(.*\)|\[.*\])*\s*$/.test(last) && !/^(?:pass|break|continue|return|raise|del|global|nonlocal|else|try|finally)\b/.test(last);
    }
    return true;
  }

  /* ---------- Small DOM helpers ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = ok;
      s.onerror = function () { fail(new Error(T.download(src.replace(/^https:\/\/[^/]+/, '')))); };
      document.head.appendChild(s);
    });
  }
  function blobWorker(src, module) { return new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })), module ? { type: 'module' } : undefined); }

  /* ---------- Python (one Pyodide worker per page, so examples share variables like a notebook) ---------- */
  var PY_WORKER_SRC = '(' + function (base) {
    importScripts(base + 'pyodide.js');
    var dec = new TextDecoder(), input = [];
    var write = function (type) { return function (buf) { postMessage({ type: type, text: dec.decode(buf, { stream: true }) }); return buf.length; }; };
    var ready = loadPyodide({ indexURL: base }).then(function (py) {
      py.setStdout({ write: write('out') });
      py.setStderr({ write: write('err') });
      py.setStdin({ stdin: function () { return input.length ? input.shift() : undefined; } });
      // Plots are drawn off-screen and sent back as PNGs after each run.
      py.runPython('import os, warnings\nos.environ["MPLBACKEND"] = "AGG"\nwarnings.filterwarnings("ignore", message=".*non-interactive.*")');
      return py;
    });
    var FIGURES = 'import sys\nimgs = []\nplt = sys.modules.get("matplotlib.pyplot")\nif plt:\n    import io, base64\n' +
      '    for n in plt.get_fignums():\n        buf = io.BytesIO()\n        plt.figure(n).savefig(buf, format="png", bbox_inches="tight", dpi=96)\n' +
      '        imgs.append(base64.b64encode(buf.getvalue()).decode())\n    plt.close("all")\nimgs';
    // Like a notebook cell: the value of a trailing expression is printed (but not the objects plotting calls return).
    // Output is flushed at the end, also after an error: print(..., end=' ') would otherwise stay buffered
    // and show up at the start of the next run.
    var RUN = 'from pyodide.code import eval_code_async as _cnr_eval\nimport sys as _cnr_sys\ntry:\n' +
      '    _cnr_r = await _cnr_eval(_cnr_src, globals(), filename="<example>")\n' +
      '    if _cnr_r is not None and not type(_cnr_r[0] if isinstance(_cnr_r, list) and _cnr_r else _cnr_r).__module__.startswith("matplotlib"):\n' +
      '        print(repr(_cnr_r))\n    del _cnr_r\nfinally:\n    _cnr_sys.stdout.flush()\n    _cnr_sys.stderr.flush()';
    onmessage = function (e) {
      var py;
      ready.then(function (p) {
        py = p;
        postMessage({ type: 'ready' });
        input = e.data.stdin ? e.data.stdin.split('\n') : [];
        return py.loadPackagesFromImports(e.data.code, { messageCallback: function (m) { if (/^Loading/.test(m)) postMessage({ type: 'status', text: m }); }, errorCallback: function () {} });
      }).then(function () {
        postMessage({ type: 'status', text: '' });
        py.globals.set('_cnr_src', e.data.code);
        return py.runPythonAsync(RUN);
      }).then(function () {
        var figs = py.runPython(FIGURES, { globals: py.toPy({}) });
        var imgs = figs.toJs();
        figs.destroy();
        postMessage({ type: 'done', images: imgs });
      }).catch(function (err) {
        postMessage({ type: 'error', text: String((err && err.message) || err) });
      });
    };
  } + ')(' + JSON.stringify(PYODIDE) + ')';

  var pyWorker = null, pyLoaded = false;
  function pythonRun(code, ui) {
    if (!pyWorker) { pyWorker = blobWorker(PY_WORKER_SRC); pyLoaded = false; }
    var w = pyWorker;
    if (!pyLoaded) ui.status(T.loadPython);
    return new Promise(function (ok) {
      w.onmessage = function (e) {
        var d = e.data;
        if (d.type === 'ready') { pyLoaded = true; ui.status(''); }
        else if (d.type === 'status') ui.status(d.text);
        else if (d.type === 'out' || d.type === 'err') ui.write(d.text, d.type === 'err');
        else if (d.type === 'done') { (d.images || []).forEach(ui.image); ok(); }
        else if (d.type === 'error') {
          if (ui.newline) ui.newline();
          ui.write(pyLoaded ? pythonError(d.text) : T.startFailShort('Python', d.text), true);
          if (!pyLoaded) pythonStop();
          ok({ missing: /\nNameError: /.test(d.text) });
        }
      };
      w.onerror = function (e) { e.preventDefault(); ui.write(pyLoaded ? String(e.message) : T.startFail('Python', e.message || T.downloadFailed), true); pythonStop(); ok(); };
      ui.onStop = function () { pythonStop(); ui.write('\n' + T.stoppedPython, true); ok(); };
      w.postMessage({ code: code, stdin: ui.stdin() });
    });
  }
  function pythonStop() { if (pyWorker) { pyWorker.terminate(); pyWorker = null; } }
  // Drop Pyodide's own frames from tracebacks and add a hint for the usual surprises.
  function pythonError(text) {
    var lines = text.replace(/\s+$/, '').split('\n');
    var i = 0;
    while (i < lines.length && lines[i].indexOf('File "<example>"') < 0) i++;
    var tb = i < lines.length ? ['Traceback (most recent call last):'].concat(lines.slice(i)) : lines;
    var last = tb[tb.length - 1];
    if (/^NameError/.test(last)) tb.push('', T.hintName);
    else if (/^EOFError/.test(last)) tb.push('', T.hintInput);
    else if (/^ModuleNotFoundError/.test(last)) tb.push('', T.hintModule);
    return tb.join('\n');
  }

  /* ---------- JavaScript (a fresh worker per run; it ends when no timers are left) ---------- */
  var JS_WORKER_SRC = '(' + function () {
    var quiet = false;
    var send = function (type, text) { if (!quiet) postMessage({ type: type, text: text }); };
    var fmt = function (v, depth, seen) {
      if (typeof v === 'string') return depth ? "'" + v + "'" : v;
      if (typeof v === 'function') return v.toString().indexOf('class') === 0 ? '[class ' + (v.name || '(anonymous)') + ']' : '[Function: ' + (v.name || '(anonymous)') + ']';
      if (typeof v === 'bigint') return v + 'n';
      if (typeof v === 'symbol') return v.toString();
      if (v === null || typeof v !== 'object') return Object.is(v, -0) ? '-0' : String(v);
      if (v instanceof Error) return (v.name || 'Error') + ': ' + v.message;
      if (v instanceof Date) return isNaN(v) ? 'Invalid Date' : v.toISOString();
      if (v instanceof RegExp) return String(v);
      if (v instanceof Promise) return 'Promise { … }';
      if (seen.indexOf(v) >= 0) return '[Circular]';
      seen = seen.concat([v]);
      var inner = function (x) { return fmt(x, depth + 1, seen); };
      var wrap = function (open, parts, close) {
        if (!parts.length) return open + close;
        var one = open + ' ' + parts.join(', ') + ' ' + close;
        return one.length <= 72 ? one : open + '\n' + parts.map(function (p) { return '  ' + p.replace(/\n/g, '\n  '); }).join(',\n') + '\n' + close;
      };
      if (depth > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
      if (Array.isArray(v)) return wrap('[', v.map(inner), ']');
      if (v instanceof Map) { var mp = []; v.forEach(function (val, k) { mp.push(inner(k) + ' => ' + inner(val)); }); return 'Map(' + v.size + ') ' + wrap('{', mp, '}'); }
      if (v instanceof Set) { var sp = []; v.forEach(function (val) { sp.push(inner(val)); }); return 'Set(' + v.size + ') ' + wrap('{', sp, '}'); }
      var name = v.constructor && v.constructor.name && v.constructor.name !== 'Object' ? v.constructor.name + ' ' : '';
      return name + wrap('{', Object.keys(v).map(function (k) { return (/^[A-Za-z_$][\w$]*$/.test(k) ? k : "'" + k + "'") + ': ' + inner(v[k]); }), '}');
    };
    var line = function (args) {
      args = Array.prototype.slice.call(args);
      var first = args[0];
      // printf-style %s %d %i %f %o %O %j, as in Node and browsers.
      if (typeof first === 'string' && /%[sdifoOjc%]/.test(first)) {
        args.shift();
        first = first.replace(/%([sdifoOjc%])/g, function (m, f) {
          if (f === '%') return '%';
          if (!args.length) return m;
          var a = args.shift();
          if (f === 's') return typeof a === 'string' ? a : fmt(a, 1, []);
          if (f === 'd' || f === 'i') return String(f === 'i' ? parseInt(a, 10) : Number(a));
          if (f === 'f') return String(parseFloat(a));
          if (f === 'c') return '';
          return fmt(a, 1, []);
        });
        args.unshift(first);
      }
      return args.map(function (a) { return typeof a === 'string' ? a : fmt(a, 0, []); }).join(' ') + '\n';
    };
    var table = function (data) {
      if (data === null || typeof data !== 'object') return line([data]);
      var rows = Object.keys(data), cols = [];
      rows.forEach(function (r) { var o = data[r]; if (o && typeof o === 'object') Object.keys(o).forEach(function (c) { if (cols.indexOf(c) < 0) cols.push(c); }); else if (cols.indexOf('Values') < 0) cols.push('Values'); });
      var head = ['(index)'].concat(cols);
      var body = rows.map(function (r) {
        var o = data[r];
        return [r].concat(cols.map(function (c) { return c === 'Values' && (o === null || typeof o !== 'object') ? fmt(o, 1, []) : o && typeof o === 'object' && c in o ? fmt(o[c], 1, []) : ''; }));
      });
      var width = head.map(function (h, i) { return Math.max(h.length, Math.max.apply(null, body.map(function (b) { return b[i].length; }).concat(0))); });
      var fmtRow = function (cells) { return '│' + cells.map(function (c, i) { return ' ' + c + new Array(width[i] - c.length + 1).join(' ') + ' '; }).join('│') + '│'; };
      var rule = function (l, m, r) { return l + width.map(function (w) { return new Array(w + 3).join('─'); }).join(m) + r; };
      return [rule('┌', '┬', '┐'), fmtRow(head), rule('├', '┼', '┤')].concat(body.map(fmtRow), [rule('└', '┴', '┘')]).join('\n') + '\n';
    };
    var counts = {};
    console.log = console.info = console.debug = function () { send('out', line(arguments)); };
    console.error = console.warn = console.trace = function () { send('err', line(arguments)); };
    console.table = function (d) { send('out', table(d)); };
    console.count = function (l) { l = l === undefined ? 'default' : l; counts[l] = (counts[l] || 0) + 1; send('out', l + ': ' + counts[l] + '\n'); };
    console.group = console.groupCollapsed = function () { if (arguments.length) send('out', line(arguments)); };
    console.groupEnd = console.time = console.timeEnd = function () {};
    console.dir = console.log;
    console.assert = function (ok) { if (!ok) send('err', 'Assertion failed' + (arguments.length > 1 ? ': ' + line(Array.prototype.slice.call(arguments, 1)) : '\n')); };
    var report = function (err) { send('err', (err && err.name ? err.name + ': ' + err.message : 'Uncaught ' + fmt(err, 1, [])) + '\n'); };
    // Track timers so the run can end as soon as nothing is left to do.
    var pending = 0, finished = false, timers = {};
    var rawSet = setTimeout, rawClear = clearTimeout, rawEvery = setInterval, rawStop = clearInterval;
    var check = function () { rawSet(function () { if (!finished && pending === 0) { finished = true; send('done'); } }, 0); };
    self.setTimeout = function (fn, ms) {
      var args = Array.prototype.slice.call(arguments, 2), id;
      pending++;
      id = rawSet(function () { delete timers[id]; pending--; try { fn.apply(null, args); } catch (e) { report(e); } check(); }, ms);
      timers[id] = 1;
      return id;
    };
    self.clearTimeout = function (id) { if (timers[id]) { delete timers[id]; pending--; check(); } rawClear(id); };
    self.setInterval = function (fn, ms) {
      var args = Array.prototype.slice.call(arguments, 2);
      pending++;
      var id = rawEvery(function () { try { fn.apply(null, args); } catch (e) { report(e); } }, ms);
      timers['i' + id] = 1;
      return id;
    };
    self.clearInterval = function (id) { if (timers['i' + id]) { delete timers['i' + id]; pending--; check(); } rawStop(id); };
    self.addEventListener('unhandledrejection', function (e) { e.preventDefault(); report(e.reason); });
    onmessage = function (e) {
      // Earlier examples this one builds on run first, quietly, as classic scripts so their top-level
      // declarations become globals the example can see.
      var missing = [];
      quiet = true;
      (e.data.prelude || []).forEach(function (src) {
        try { importScripts(URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))); } catch (err) {
          var m = err && err.name === 'ReferenceError' && /^(\w+) is not defined/.exec(err.message);
          if (m) missing.push(m[1]);
        }
      });
      quiet = false;
      if (missing.length) postMessage({ type: 'missing', names: missing });
      var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor, fn;
      try { fn = new AsyncFunction(e.data.code); } catch (err) { report(err); check(); return; }
      fn().catch(report).then(check);
    };
  } + ')()';

  // Resolves with the names of undefined variables it ran into, so earlier examples that define them can be run first.
  function jsRun(code, ui, prelude) {
    var w = blobWorker(JS_WORKER_SRC), timer, names = [];
    return new Promise(function (ok) {
      var end = function (note) { clearTimeout(timer); w.terminate(); if (note) ui.write(note, true); ok({ names: names }); };
      w.onmessage = function (e) {
        var d = e.data, m;
        if (d.type === 'out' || d.type === 'err') {
          ui.write(d.text, d.type === 'err');
          if (d.type === 'err' && (m = /^ReferenceError: (\w+) is not defined/.exec(d.text)) && names.indexOf(m[1]) < 0) names.push(m[1]);
        }
        else if (d.type === 'missing') d.names.forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });
        else if (d.type === 'done') end();
      };
      w.onerror = function (e) { e.preventDefault(); end(String(e.message)); };
      ui.onStop = function () { end('\n' + T.stopped); };
      timer = setTimeout(function () { end('\n' + T.stoppedAfter(JS_TIMEOUT / 1000)); }, JS_TIMEOUT);
      w.postMessage({ code: code, prelude: prelude || [] });
    });
  }
  /* ---------- TypeScript: type-checked and compiled in a worker, then run like JavaScript ---------- */
  var TS_WORKER_SRC = '(' + function (base) {
    importScripts(base + 'typescript.js');
    // The examples run in a worker with the console and timers set up by the JavaScript runner.
    var GLOBALS = 'declare var console: { log(...a: any[]): void; info(...a: any[]): void; debug(...a: any[]): void; warn(...a: any[]): void; ' +
      'error(...a: any[]): void; trace(...a: any[]): void; dir(o: any): void; table(d: any): void; count(l?: string): void; group(...a: any[]): void; ' +
      'groupCollapsed(...a: any[]): void; groupEnd(): void; time(l?: string): void; timeEnd(l?: string): void; assert(ok?: boolean, ...a: any[]): void };\n' +
      'declare function setTimeout(h: (...a: any[]) => void, ms?: number, ...a: any[]): number;\ndeclare function clearTimeout(id?: number): void;\n' +
      'declare function setInterval(h: (...a: any[]) => void, ms?: number, ...a: any[]): number;\ndeclare function clearInterval(id?: number): void;\n' +
      'declare function queueMicrotask(cb: () => void): void;\ndeclare function structuredClone<T>(v: T): T;\n';
    var libs = {};
    var fetchText = function (url) { var x = new XMLHttpRequest(); x.open('GET', url, false); x.send(); return x.status === 200 ? x.responseText : null; };
    var opts = { target: ts.ScriptTarget.ES2022, lib: ['lib.es2022.d.ts'], strict: true, skipLibCheck: true, types: [], noEmitOnError: false, removeComments: false };
    // Declarations an earlier example also makes are fine: at run time this example has its own scope.
    var PRELUDE_OK = [2300, 2393, 2451, 2440, 2567, 2813, 2814];
    onmessage = function (e) {
      var files = { '/globals.d.ts': GLOBALS }, roots = ['/globals.d.ts'], out = {};
      (e.data.prelude || []).forEach(function (src, i) { files['/prelude' + i + '.ts'] = src; roots.push('/prelude' + i + '.ts'); });
      files['/main.ts'] = e.data.code;
      roots.push('/main.ts');
      var host = {
        getSourceFile: function (name, lang) {
          if (files[name] != null) return ts.createSourceFile(name, files[name], lang, true);
          if (name.indexOf('/lib/') !== 0) return undefined;
          if (!(name in libs)) { var t = fetchText(base + name.slice(5)); libs[name] = t == null ? undefined : ts.createSourceFile(name, t, lang, true); }
          return libs[name];
        },
        getDefaultLibFileName: function () { return '/lib/lib.es2022.d.ts'; },
        getDefaultLibLocation: function () { return '/lib/'; },
        writeFile: function (name, text) { out[name] = text; },
        getCurrentDirectory: function () { return '/'; },
        getDirectories: function () { return []; },
        fileExists: function (name) { return files[name] != null || name.indexOf('/lib/') === 0; },
        readFile: function (name) { return files[name]; },
        getCanonicalFileName: function (name) { return name; },
        useCaseSensitiveFileNames: function () { return true; },
        getNewLine: function () { return '\n'; }
      };
      try {
        var program = ts.createProgram(roots, opts, host);
        var main = program.getSourceFile('/main.ts');
        var diags = ts.getPreEmitDiagnostics(program, main).filter(function (d) {
          return d.category === ts.DiagnosticCategory.Error && !(e.data.prelude && e.data.prelude.length && PRELUDE_OK.indexOf(d.code) >= 0);
        }).map(function (d) {
          var where = d.file && d.start != null ? 'Line ' + (d.file.getLineAndCharacterOfPosition(d.start).line + 1) + ': ' : '';
          return where + ts.flattenDiagnosticMessageText(d.messageText, '\n') + ' (TS' + d.code + ')';
        });
        program.emit();
        postMessage({ js: out['/main.js'] || '', prelude: (e.data.prelude || []).map(function (s, i) { return out['/prelude' + i + '.js'] || ''; }), errors: diags });
      } catch (err) {
        postMessage({ js: '', prelude: [], errors: ['Could not compile: ' + ((err && err.message) || err)] });
      }
    };
  } + ')(' + JSON.stringify(TYPESCRIPT) + ')';

  var tsWorker = null, tsLoaded = false;
  // "export" in front of a declaration only matters across files; drop it so the example runs as a script.
  function tsSource(code) { return code.replace(/^(\s*)export\s+(?:default\s+)?(?=(?:declare\s+|abstract\s+|async\s+)?(?:function|class|const|let|var|interface|type|enum|namespace)\b)/gm, '$1'); }
  function tsRun(code, ui, prelude) {
    if (!tsWorker) { tsWorker = blobWorker(TS_WORKER_SRC); tsLoaded = false; }
    var w = tsWorker, stopped = false;
    if (!tsLoaded) ui.status(T.loadTs);
    ui.onStop = function () { stopped = true; w.terminate(); tsWorker = null; };
    return new Promise(function (ok) {
      w.onmessage = function (e) { tsLoaded = true; ok(e.data); };
      w.onerror = function (e) { e.preventDefault(); w.terminate(); tsWorker = null; ok({ js: '', prelude: [], errors: [T.tsLoadFail(e.message || T.downloadFailed)] }); };
      w.postMessage({ code: tsSource(code), prelude: (prelude || []).map(tsSource) });
    }).then(function (r) {
      ui.status('');
      if (stopped) { ui.write(T.stopped + '\n', true); return { names: [] }; }
      if (r.errors.length) ui.write(T.typeErrors + '\n' + r.errors.join('\n') + '\n\n', true);
      if (!r.js) return { names: [] };
      return jsRun(r.js, ui, r.prelude);
    });
  }

  /* ---------- PHP (php-wasm; a fresh PHP instance per run, as with php on the command line) ---------- */
  // php-wasm expects a browser page; these stand-ins are enough for it to start inside a worker.
  var PHP_WORKER_SRC = 'self.window = self; self.document = { currentScript: null, baseURI: location.href, querySelector: function () { return null; }, ' +
    'getElementById: function () { return null; }, addEventListener: function () {}, removeEventListener: function () {}, body: { style: {} } };\n(' + function (url) {
    var lib = import(url);
    onmessage = function (e) {
      lib.then(function (m) {
        var php = new m.PhpWeb();
        php.addEventListener('output', function (ev) { postMessage({ type: 'out', text: ev.detail.join('') }); });
        php.addEventListener('error', function (ev) { postMessage({ type: 'out', text: ev.detail.join('') }); });
        return php.binary.then(function () { postMessage({ type: 'ready' }); return php.run(e.data); });
      }).then(function () { postMessage({ type: 'done' }); }, function (err) { postMessage({ type: 'fatal', text: String((err && err.message) || err) }); });
    };
  } + ')(' + JSON.stringify(PHPWASM) + ')';

  var phpWorker = null, phpLoaded = false;
  function phpBody(src) { return src.replace(/^\s*<\?php\b/, '').replace(/\?>\s*$/, ''); }
  // Runs the example; earlier examples it builds on run first with their output thrown away.
  function phpRun(code, ui, prelude) {
    if (!phpWorker) { phpWorker = blobWorker(PHP_WORKER_SRC, true); phpLoaded = false; }
    var w = phpWorker, text = '';
    if (!/<\?(?:php|=)/.test(code)) code = '<?php\n' + code;
    if (prelude && prelude.length) code = '<?php ob_start();\n' + prelude.map(phpBody).join('\n') + '\nob_end_clean(); ?>' + code;
    if (!phpLoaded) ui.status(T.loadPhp);
    return new Promise(function (ok) {
      var end = function (note) {
        // PHP prints errors into the output; show them in red, with "your code" for php-wasm's script name.
        text.replace(/php-wasm run script/g, 'your code').split(/(\n)/).forEach(function (part) {
          ui.write(part, /^\s*(?:PHP )?(?:Fatal error|Parse error|Warning|Notice|Deprecated)\b|^Stack trace:|^#\d+ |^\s+thrown in /.test(part));
        });
        if (note) ui.write(note, true);
        var names = [], m, re = /Call to undefined function (\w+)\(|Class "(\w+)" not found|Undefined variable \$(\w+)|Undefined constant "(\w+)"/g;
        while ((m = re.exec(text))) { var n = m[1] || m[2] || (m[3] && '$' + m[3]) || m[4]; if (names.indexOf(n) < 0) names.push(n); }
        ok({ names: names });
      };
      w.onmessage = function (e) {
        var d = e.data;
        if (d.type === 'ready') { phpLoaded = true; ui.status(''); }
        else if (d.type === 'out') text += d.text;
        else if (d.type === 'done') end();
        else if (d.type === 'fatal') end('\n' + d.text);
      };
      w.onerror = function (e) { e.preventDefault(); w.terminate(); phpWorker = null; end(T.startFail('PHP', e.message || T.downloadFailed)); };
      ui.onStop = function () { w.terminate(); phpWorker = null; end('\n' + T.stopped); };
      w.postMessage(code);
    });
  }

  /* ---------- HTML preview, and JavaScript that works with the page, in a sandboxed frame ---------- */
  // Injected first into the preview: forwards console output, errors and the page height to the parent.
  var PREVIEW_SHIM = '<script>(function () {' +
    'var send = function (t, x) { parent.postMessage({ cnrRun: 1, type: t, text: x }, "*"); };' +
    'var fmt = function (v) { if (typeof v === "string") return v; if (v instanceof Error) return v.name + ": " + v.message;' +
    ' if (typeof Element !== "undefined" && v instanceof Element) return v.outerHTML.length > 200 ? v.outerHTML.slice(0, 200) + "…" : v.outerHTML;' +
    ' if (typeof v === "function") return "[Function: " + (v.name || "(anonymous)") + "]";' +
    ' try { var j = JSON.stringify(v); return j === undefined ? String(v) : j; } catch (e) { return String(v); } };' +
    'var line = function (a) { return Array.prototype.map.call(a, fmt).join(" ") + "\\n"; };' +
    '["log", "info", "debug", "table", "dir"].forEach(function (k) { console[k] = function () { send("out", line(arguments)); }; });' +
    '["warn", "error"].forEach(function (k) { console[k] = function () { send("err", line(arguments)); }; });' +
    'addEventListener("error", function (e) { send("err", (e.error && e.error.name ? e.error.name + ": " + e.error.message : e.message) + "\\n"); });' +
    'addEventListener("unhandledrejection", function (e) { send("err", "Uncaught (in promise) " + fmt(e.reason) + "\\n"); });' +
    'var h = function () { send("height", String(Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0))); };' +
    'addEventListener("load", function () { h(); if (window.ResizeObserver) new ResizeObserver(h).observe(document.documentElement); });' +
    'document.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest("a[href]"); if (a && a.getAttribute("href").charAt(0) !== "#") e.preventDefault(); }, true);' +
    '})();<\/script>';
  function previewDoc(html, css, js) {
    var doc = html || '<!DOCTYPE html>\n<html><body></body></html>';
    var add = function (re, text, after) {
      var m = re.exec(doc);
      if (!m) return false;
      var at = after ? m.index + m[0].length : m.index;
      doc = doc.slice(0, at) + text + doc.slice(at);
      return true;
    };
    var head = PREVIEW_SHIM + (css ? '<style>\n' + css + '\n</style>' : '');
    add(/<head\b[^>]*>/i, head, true) || add(/<html\b[^>]*>/i, head, true) || add(/<!DOCTYPE[^>]*>/i, head, true) || (doc = head + doc);
    if (js) {
      var script = '<script>\n' + js.replace(/<\/script/gi, '<\\/script') + '\n<\/script>';
      add(/<\/body>/i, script, false) || (doc += script);
    }
    return doc;
  }
  function previewRun(doc, ui) {
    return new Promise(function (ok) {
      var frame = el('iframe', 'cnr-run__frame');
      frame.setAttribute('sandbox', 'allow-scripts allow-modals allow-forms');
      frame.setAttribute('title', T.previewTitle);
      var listen = function (e) {
        if (!frame.isConnected) { window.removeEventListener('message', listen); return; }
        if (e.source !== frame.contentWindow || !e.data || !e.data.cnrRun) return;
        if (e.data.type === 'height') frame.style.height = Math.min(Math.max(Number(e.data.text) || 0, 60), 600) + 'px';
        else ui.write(e.data.text, e.data.type === 'err');
      };
      window.addEventListener('message', listen);
      var done = false, finish = function () { if (!done) { done = true; ok(); } };
      frame.addEventListener('load', finish);
      setTimeout(finish, 3000);
      ui.onStop = function () { frame.remove(); finish(); };
      ui.frame(frame);
      frame.srcdoc = doc;
    });
  }

  function declares(kind, src, name) {
    if (kind === 'php') {
      if (name.charAt(0) === '$') return new RegExp('\\' + name + '\\s*=[^=]').test(src);
      return new RegExp('\\b(?:function\\s+' + name + '\\s*\\(|(?:class|interface|trait|enum)\\s+' + name + '\\b|define\\s*\\(\\s*[\'"]' + name + '[\'"]|const\\s+' + name + '\\b)', 'i').test(src);
    }
    return new RegExp('(?:\\b(?:const|let|var|class|enum|namespace)|\\bfunction\\*?)\\s+' + name + '\\b').test(src);
  }

  /* ---------- SQL (one database per page, shared by its examples) ---------- */
  var sqlDb = null;
  function sqlOpen(ui) {
    if (!sqlDb) {
      ui.status(postgres ? T.loadPg : T.loadSqlite);
      sqlDb = postgres
        ? import(PGLITE).then(function (m) { var db = new m.PGlite(); return db.waitReady.then(function () { return db; }); })
        : loadScript(SQLJS + 'sql-wasm.js').then(function () { return window.initSqlJs({ locateFile: function (f) { return SQLJS + f; } }); })
          .then(function (SQL) { return new SQL.Database(); });
      sqlDb.catch(function () { sqlDb = null; });
    }
    return sqlDb;
  }
  // The SQL and MySQL tutorials mostly use MySQL syntax; translate the table definitions SQLite would reject.
  function toSqlite(sql) {
    return sql
      .replace(/\b(?:TINY|SMALL|MEDIUM|BIG)?INT(?:EGER)?(?:\s*\(\d+\))?(?:\s+UNSIGNED)?((?:\s+NOT\s+NULL)?)\s+AUTO_INCREMENT\b/gi, 'INTEGER$1')
      .replace(/\bAUTO_INCREMENT\s*=\s*\d+/gi, '')
      .replace(/\bAUTO_INCREMENT\b/gi, '')
      .replace(/\b(?:BIG)?SERIAL\b/gi, 'INTEGER')
      .replace(/\bUNSIGNED\b/gi, '')
      .replace(/\bENUM\s*\([^)]*\)/gi, 'TEXT')
      .replace(/\bON\s+UPDATE\s+CURRENT_TIMESTAMP(?:\(\))?/gi, '')
      .replace(/\)\s*(?:(?:ENGINE|(?:DEFAULT\s+)?CHARSET|(?:DEFAULT\s+)?CHARACTER\s+SET|COLLATE)\s*=?\s*\w+\s*)+;/gi, ');')
      .replace(/\bNOW\(\)/gi, 'CURRENT_TIMESTAMP')
      .replace(/\bLAST_INSERT_ID\(\)/gi, 'last_insert_rowid()')
      .replace(/\bCURDATE\(\)/gi, "DATE('now')")
      .replace(/\bCURRENT_DATE\(\)/gi, 'CURRENT_DATE');
  }
  function sqlRun(code, ui) {
    var stopped = false;
    ui.onStop = function () { stopped = true; };
    return sqlOpen(ui).then(function (db) {
      ui.status('');
      if (stopped) return;
      if (postgres) {
        return db.exec(code, { rowMode: 'array' }).then(function (results) {
          var shown = 0, changed = 0;
          results.forEach(function (r) {
            if (r.fields && r.fields.length) { ui.table(r.fields.map(function (f) { return f.name; }), r.rows); shown++; }
            else changed += r.affectedRows || 0;
          });
          if (!shown) ui.write(T.done + (changed ? T.rowsAffected(changed) : '') + '\n');
        }, function (err) { ui.write(sqlError(err), true); return { missing: missingTable(err), exists: /already exists/i.test(err.message) }; });
      }
      var shown = 0, changed = 0;
      try {
        for (var it = db.iterateStatements(toSqlite(code)), r = it.next(); !r.done; r = it.next()) {
          var st = r.value, cols = st.getColumnNames(), rows = [];
          while (st.step()) rows.push(st.get());
          st.free();
          if (cols.length) { ui.table(cols, rows); shown++; } else changed += db.getRowsModified();
        }
        if (!shown) ui.write(T.done + (changed ? T.rowsAffected(changed) : '') + '\n');
      } catch (err) {
        ui.write(sqlError(err), true);
        return { missing: missingTable(err), exists: /already exists/i.test(err.message) };
      }
    }, function (err) { ui.write(String(err.message || err), true); });
  }
  function missingTable(err) { return /no such table|relation .* does not exist/i.test(String((err && err.message) || err)); }
  function sqlError(err) {
    var msg = 'Error: ' + String((err && err.message) || err);
    if (missingTable(err)) msg += '\n\n' + T.hintTable;
    else if (!postgres && /syntax error|no such function/i.test(msg)) msg += '\n\n' + T.hintSqlite(mysql ? 'MySQL' : 'database');
    return msg;
  }
  function sqlReset() {
    if (!sqlDb) return;
    var old = sqlDb;
    sqlDb = null;
    old.then(function (db) { db.close(); }, function () {});
  }

  /* ---------- UI ---------- */
  var ENGINES = {
    python: 'Python 3.13 · ' + T.inBrowser,
    js: 'JavaScript · ' + T.inBrowser,
    ts: 'TypeScript 6 · ' + T.inBrowser,
    php: 'PHP 8.4 · ' + T.inBrowser,
    html: T.htmlPreview + ' · ' + T.inBrowser,
    dom: T.jsPage + ' · ' + T.inBrowser,
    sql: (postgres ? 'PostgreSQL' : mysql ? T.mysqlLike : 'SQLite') + ' · ' + T.inBrowser
  };
  var RUNNERS = { python: pythonRun, js: jsRun, sql: sqlRun, ts: tsRun, php: phpRun };
  // Examples whose missing names can be looked up in the examples above (the others share one session instead).
  var NAMED = { js: 1, ts: 1, php: 1 };
  var RESTART = { python: [T.restartPython, pythonStop], sql: [T.resetDb, sqlReset] };
  var icons = {
    run: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M6 6h12v12H6z"/></svg>'
  };
  var busy = null; // one run at a time per page; Python and SQL share state across blocks

  var noop = function () {};
  function codeText(code) { return code.innerText.replace(/\u00a0/g, ' ').replace(/\n$/, ''); }

  // earlier: the code elements of the runnable-in-principle blocks above this one (Python and SQL share state).
  // page: for previews, the HTML and CSS examples above this one that a DOM example runs against.
  function setup(block, kind, earlier, page) {
    var code = block.querySelector('pre > code');
    var original = code.innerHTML;
    var bar = el('div', 'cnr-run');
    bar.setAttribute('data-pagefind-ignore', '');
    var tools = el('div', 'cnr-run__bar');
    var go = el('button', 'cnr-run__go');
    go.type = 'button';
    var edit = el('button', 'cnr-run__btn', T.edit);
    edit.type = 'button';
    edit.title = T.editTitle;
    var reset = el('button', 'cnr-run__btn', T.undo);
    reset.type = 'button';
    reset.hidden = true;
    var engine = el('span', 'cnr-run__engine', ENGINES[kind]);
    if (kind === 'dom' && page && page.html) engine.textContent = T.jsHtml + ' · ' + T.inBrowser;
    tools.append(go, edit, reset, engine);
    bar.appendChild(tools);
    var stdinBox = null;
    if (kind === 'python' && /\binput\s*\(/.test(code.textContent)) {
      stdinBox = el('textarea', 'cnr-run__stdin');
      stdinBox.rows = 2;
      stdinBox.placeholder = T.stdin;
      stdinBox.setAttribute('aria-label', T.stdinLabel);
      bar.appendChild(stdinBox);
    }
    var out = el('div', 'cnr-run__out');
    out.hidden = true;
    out.setAttribute('aria-live', 'polite');
    var head = el('div', 'cnr-run__head');
    head.appendChild(el('span', null, T.output));
    if (RESTART[kind]) {
      var restart = el('button', 'cnr-run__link', RESTART[kind][0]);
      restart.type = 'button';
      restart.onclick = function () { if (!busy) { RESTART[kind][1](); clearOut(); } };
      head.appendChild(restart);
    }
    var close = el('button', 'cnr-run__link', T.clear);
    close.type = 'button';
    close.onclick = function () { if (busy !== ui) clearOut(); };
    head.appendChild(close);
    var status = el('div', 'cnr-run__status');
    status.hidden = true;
    var pre = el('pre', 'cnr-run__text');
    var extra = el('div', 'cnr-run__extra');
    out.append(head, status, pre, extra);
    bar.appendChild(out);
    block.classList.add('cnr-runnable');
    block.after(bar);

    var size = 0, lastText = null;
    function clearOut() { out.hidden = true; pre.textContent = ''; extra.textContent = ''; size = 0; lastText = null; }
    var ui = {
      onStop: null,
      stdin: function () { return stdinBox ? stdinBox.value : ''; },
      status: function (t) { status.textContent = t; status.hidden = !t; },
      write: function (text, isErr) {
        if (!text || size > MAX_OUTPUT) return;
        size += text.length;
        if (size > MAX_OUTPUT) text = text.slice(0, Math.max(0, text.length - (size - MAX_OUTPUT))) + T.cutOff;
        // Consecutive writes of the same kind share one node.
        if (!lastText || lastText.err !== !!isErr || lastText.node.parentNode !== pre) {
          var node = isErr ? el('span', 'cnr-run__err') : document.createTextNode('');
          pre.appendChild(node);
          lastText = { node: node, err: !!isErr };
        }
        lastText.node.textContent += text;
        pre.hidden = false;
      },
      // Start a new line if the output so far ends mid-line (before a traceback).
      newline: function () { if (pre.textContent && !/\n$/.test(pre.textContent)) ui.write('\n'); },
      table: function (cols, rows) {
        var wrap = el('div', 'cnr-run__table');
        var t = el('table');
        var tr = el('tr');
        cols.forEach(function (c) { tr.appendChild(el('th', null, c)); });
        t.appendChild(el('thead')).appendChild(tr);
        var tb = t.appendChild(el('tbody'));
        rows.slice(0, MAX_ROWS).forEach(function (r) {
          var row = el('tr');
          r.forEach(function (v) {
            var td = el('td', v === null ? 'cnr-run__null' : null, v === null ? 'NULL' : v instanceof Date ? v.toISOString() : v instanceof Uint8Array ? '<' + v.length + ' bytes>' : typeof v === 'object' ? JSON.stringify(v) : String(v));
            row.appendChild(td);
          });
          tb.appendChild(row);
        });
        wrap.appendChild(t);
        extra.appendChild(wrap);
        extra.appendChild(el('div', 'cnr-run__rows', rows.length > MAX_ROWS ? T.showingRows(MAX_ROWS, rows.length) : T.rows(rows.length)));
      },
      image: function (b64) {
        var img = el('img');
        img.alt = T.plotAlt;
        img.src = 'data:image/png;base64,' + b64;
        extra.appendChild(img);
      },
      frame: function (f) { extra.appendChild(f); },
      action: function (label, fn) {
        var b = el('button', 'button button--sm button--outline button--primary cnr-run__action', label);
        b.type = 'button';
        b.onclick = fn;
        extra.appendChild(b);
      }
    };

    function paintGo() {
      var running = busy === ui;
      go.innerHTML = (running ? icons.stop + '<span>' + T.stop + '</span>' : icons.run + '<span>' + (kind === 'html' ? T.preview : T.run) + '</span>');
      go.classList.toggle('cnr-run__go--stop', running);
      go.setAttribute('aria-label', running ? T.stopLabel : T.runLabel);
    }
    // withEarlier: first run the examples above this one quietly (their output is not shown).
    function run(withEarlier) {
      if (busy === ui) { if (ui.onStop) ui.onStop(); return; }
      if (busy) return;
      busy = ui;
      document.dispatchEvent(new Event('cnr-run-busy'));
      clearOut();
      out.hidden = false;
      pre.hidden = true;
      ui.onStop = null;
      var stopped = false;
      var steps = Promise.resolve();
      if (kind === 'html' || kind === 'dom') {
        var doc = kind === 'html' ? previewDoc(codeText(code))
          : previewDoc(page.html && codeText(page.html), page.css.map(codeText).join('\n'), codeText(code));
        return finish(previewRun(doc, ui));
      }
      if (NAMED[kind]) {
        // Rerun with the examples above that define what was missing, until nothing more is found.
        var prelude = [];
        var attempt = function (n) {
          extra.textContent = '';
          pre.textContent = '';
          size = 0;
          lastText = null;
          return RUNNERS[kind](codeText(code), ui, prelude.map(codeText)).then(function (res) {
            var adds = withEarlier === true && n < 6 ? res.names.map(definer).filter(function (c, i, a) { return c && prelude.indexOf(c) < 0 && a.indexOf(c) === i; }) : [];
            if (!adds.length || stopped) return res;
            prelude = adds.concat(prelude);
            return attempt(n + 1);
          });
        };
        ui.onStop = null;
        return finish(attempt(0));
      }
      if (withEarlier === true) earlier.forEach(function (c, i) {
        steps = steps.then(function () {
          if (stopped) return;
          var quiet = { onStop: null, stdin: function () { return ''; }, status: noop, write: noop, table: noop, image: noop };
          ui.status(T.earlier(i + 1, earlier.length));
          var p = RUNNERS[kind](codeText(c), quiet);
          ui.onStop = function () { stopped = true; if (quiet.onStop) quiet.onStop(); };
          return p;
        });
      });
      finish(steps.then(function () {
        if (stopped) { ui.write(T.stopped + '\n', true); return; }
        ui.status('');
        ui.onStop = null;
        return RUNNERS[kind](codeText(code), ui);
      }));
      function finish(p) {
        p.catch(function (e) { ui.write(String((e && e.message) || e), true); }).then(function (res) {
          ui.status('');
          if (!pre.textContent && !extra.firstChild) ui.write((kind === 'sql' ? T.done : T.noOutput) + '\n');
          var again = function () { run(true); };
          if (withEarlier !== true && res) {
            var n = earlier.length;
            var found = NAMED[kind] && res.names ? res.names.filter(definer) : [];
            if (found.length) ui.action(T.runDefiner(found[0]), again);
            else if (res.missing && n && !NAMED[kind]) ui.action(T.runAbove(n), again);
          }
          if (res && res.exists) ui.action(T.resetAgain, function () { sqlReset(); run(withEarlier); });
          busy = null;
          document.dispatchEvent(new Event('cnr-run-busy'));
        });
      }
    }
    // The nearest example above that declares a name (JavaScript, TypeScript, PHP).
    function definer(name) {
      for (var i = earlier.length - 1; i >= 0; i--) if (declares(kind, codeText(earlier[i]), name)) return earlier[i];
      return null;
    }
    document.addEventListener('cnr-run-busy', function () { paintGo(); go.disabled = !!busy && busy !== ui; });
    paintGo();
    go.onclick = function () { run(false); };

    // Editing: the highlighted code itself becomes editable; "Undo edits" brings back the original.
    edit.onclick = function () {
      var on = code.getAttribute('contenteditable') === null;
      if (on) {
        code.setAttribute('contenteditable', 'plaintext-only');
        if (code.contentEditable !== 'plaintext-only') code.setAttribute('contenteditable', 'true');
        code.setAttribute('spellcheck', 'false');
        code.focus();
      } else code.removeAttribute('contenteditable');
      block.classList.toggle('cnr-editing', on);
      edit.textContent = on ? T.doneEditing : T.edit;
    };
    code.addEventListener('input', function () { reset.hidden = false; });
    code.addEventListener('keydown', function (e) {
      if (code.getAttribute('contenteditable') === null) return;
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(false); }
      else if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); document.execCommand('insertText', false, kind === 'python' || kind === 'php' ? '    ' : '  '); }
      else if (e.key === 'Escape') edit.click();
    });
    // Pasting into the editable code keeps plain text only.
    code.addEventListener('paste', function (e) {
      if (code.getAttribute('contenteditable') === null || !e.clipboardData) return;
      e.preventDefault();
      document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
    });
    reset.onclick = function () {
      code.innerHTML = original;
      reset.hidden = true;
      if (code.getAttribute('contenteditable') !== null) edit.click();
    };
  }

  // A DOM snippet that works with an element variable defined elsewhere (button.addEventListener(...) with no
  // "const button = ..." in the snippet) cannot run on its own.
  function usesUndeclared(src) {
    var re = /(^|[^\w$.])([A-Za-z_$][\w$]*)\.(?:addEventListener|removeEventListener|appendChild|append|prepend|removeChild|insertBefore|replaceChildren|style|classList|textContent|innerHTML|innerText|setAttribute|getAttribute|dataset|value|checked|getContext|children|parentNode|firstChild|click|focus)\b/g, m;
    var known = /^(?:document|window|this|event|e|evt|globalThis|self|console|navigator|location|history|screen)$/;
    while ((m = re.exec(src))) {
      var name = m[2];
      if (known.test(name)) continue;
      if (!new RegExp('(?:\\b(?:const|let|var|function|class)\\s+|[(,]\\s*|\\b(?:for\\s*\\(\\s*(?:const|let|var)\\s+))' + name.replace(/\$/g, '\\$') + '\\b|\\b' + name.replace(/\$/g, '\\$') + '\\s*=>|\\{[^}]*\\b' + name.replace(/\$/g, '\\$') + '\\b[^}]*\\}\\s*=').test(src)) return true;
    }
    return false;
  }

  // Other scripts (the interview workspace) run code through the same engines.
  window.CNRRunner = { python: pythonRun, js: jsRun, stopPython: pythonStop };

  var cells = { python: [], sql: [], js: [], ts: [], php: [] };
  var page = { html: null, css: [] }; // the latest HTML example and the CSS examples after it
  document.querySelectorAll('.theme-code-block').forEach(function (block) {
    if (block.closest('[data-cnr-norun]')) return; // regions that handle their own code (the interview editor)
    var m = block.className.match(/\blanguage-([\w+#-]+)/);
    var lang = m && m[1].toLowerCase();
    var kind = lang && LANGS[lang];
    var code = block.querySelector('pre > code');
    if (!code) return;
    if (lang === 'css') { page.css.push(code); return; }
    if (kind === 'js' && !candidate('js', code.textContent) && candidate('dom', code.textContent)) {
      // Snippets that look up elements need the HTML they were written for: an HTML example above them.
      if (!page.html && /\bgetElementsBy|\bgetElementById|\bquerySelector/.test(code.textContent)) return;
      if (usesUndeclared(code.textContent)) return;
      kind = 'dom';
    }
    if (!kind || !candidate(kind, code.textContent)) return;
    if (runnable(kind, code.textContent)) setup(block, kind, cells[kind] ? cells[kind].slice() : [], { html: page.html, css: page.css.slice() });
    if (cells[kind]) cells[kind].push(code);
    if (kind === 'html') { page.html = code; page.css = []; }
  });
})();
