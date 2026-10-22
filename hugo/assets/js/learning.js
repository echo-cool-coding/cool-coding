/* Guest learning state. cnr_progress.v1 remains the reading-only roadmap contract.
 * No HTML, JavaScript, URLs, or settings from a backup are executed. */
(function () {
  'use strict';
  // UI strings keyed by their English source text; English pages use the key itself (shared with 代码酷, lang="zh-Hans").
  var ZH = {
    'A backup merge is in progress. Please reload after it finishes.': '正在合并备份，请在完成后重新加载页面。',
    'A different backup has been previewed. Preview this backup again before merging it.': '已预览了另一个备份。请先重新预览此备份，再进行合并。',
    'A pending backup merge needs recovery.': '有一个未完成的备份合并需要恢复。',
    'A read mark has an invalid lesson path.': '某个已读标记的课时路径无效。',
    'All pages marked read. Revisit an exercise to practice.': '所有页面均已标记为已读。可以回顾练习题巩固一下。',
    'An interrupted backup merge was rolled back. Your earlier data has been restored.': '中断的备份合并已回滚，之前的数据已恢复。',
    'Another backup merge is in progress.': '另一个备份合并正在进行中。',
    'Another tab changed saved learning data. Your unsaved changes are still in this tab; export them before reloading.': '另一个标签页修改了已保存的学习数据。未保存的更改仍在此标签页中，请在重新加载前导出。',
    'Backup': '备份',
    'Backup download started. Keep the file somewhere you can find it; it contains your notes and code.': '备份已开始下载。请妥善保存该文件，其中包含你的笔记和代码。',
    'Backup merged. Your existing read marks, notes, and drafts were preserved.': '备份已合并。原有的已读标记、笔记和草稿均已保留。',
    'Backup not imported: {error}': '备份未导入：{error}',
    'Backup validated. Review the preview, then choose Merge backup. Nothing has changed yet.': '备份校验通过。请查看预览，然后选择“合并备份”。目前尚未做任何更改。',
    'Bookmark': '书签',
    'Bookmark a lesson to keep it here.': '为课时加入书签后，它会显示在这里。',
    '✓ Bookmarked': '✓ 已加入书签',
    'Browser storage is not ready for a backup merge.': '浏览器存储尚未就绪，无法合并备份。',
    'Browser storage is unavailable or full. These changes are only in this tab. Download a backup before leaving; changes are not saved across visits.': '浏览器存储不可用或已满。这些更改只存在于此标签页中，离开前请下载备份；下次访问时不会保留这些更改。',
    'check not passed': '检查未通过',
    'Check passed': '检查已通过',
    'check passed': '检查已通过',
    'Checking backup…': '正在检查备份…',
    'Choose a JSON backup no larger than 6 MB.': '请选择不超过 6 MB 的 JSON 备份文件。',
    'Conflicting note': '冲突的笔记',
    'Continue learning': '继续学习',
    'Continue: {title}': '继续：{title}',
    'Course': '课程',
    'Course list is unavailable.': '课程列表暂不可用。',
    'Course order is unavailable right now. Your saved lessons and notes still work; reload to retry suggestions.': '课程顺序暂时无法加载。已保存的课时和笔记仍可正常使用；刷新页面可重新获取推荐。',
    'Course title': '课程标题',
    'Courses': '课程列表',
    'Draft': '草稿',
    'Draft CSS': '草稿 CSS',
    'Draft HTML': '草稿 HTML',
    'Draft JavaScript': '草稿 JavaScript',
    'Draft title': '草稿标题',
    'Earlier text saved. Your newer edits are still in the editor.': '较早的文本已保存，你的最新修改仍在编辑器中。',
    'Easy': '简单',
    'Exercise ID': '练习 ID',
    'Exercise record': '练习记录',
    'Exercise records': '练习记录列表',
    'Existing data needs recovery before a complete backup can be exported.': '现有数据需要先恢复，才能导出完整备份。',
    'Hard': '困难',
    'Import cancelled. No saved data changed.': '已取消导入，已保存的数据没有变化。',
    'Import recovery': '导入恢复记录',
    'Imported note': '导入的笔记',
    'Inconsistent exercise evidence.': '练习记录前后不一致。',
    'Interview problems solved': '已解决的面试题',
    'Invalid bookmark value.': '书签值无效。',
    'Invalid catalog lesson.': '课程目录中的课时无效。',
    'Invalid course identifier.': '课程标识无效。',
    'Invalid course URL.': '课程 URL 无效。',
    'Invalid draft identifier.': '草稿标识无效。',
    'Invalid draft lesson or course.': '草稿所属的课时或课程无效。',
    'Invalid draft timestamp.': '草稿时间戳无效。',
    'Invalid exercise identifier.': '练习标识无效。',
    'Invalid exercise result.': '练习结果无效。',
    'Invalid last-lesson URL.': '上次学习的课时 URL 无效。',
    'Invalid lesson course.': '课时所属的课程无效。',
    'Invalid lesson path.': '课时路径无效。',
    'Invalid note conflicts.': '笔记冲突版本无效。',
    'Invalid reading count.': '阅读计数无效。',
    'Invalid recovery data.': '恢复数据无效。',
    'Last lesson': '上次学习的课时',
    'Last visit': '上次访问',
    'Last visited {date}': '上次访问：{date}',
    'latest check not passed': '最近一次检查未通过',
    'Learning data': '学习数据',
    'Learning is waiting for your account connection. Your existing data has not been changed.': '学习记录正在等待账户连接，现有数据未被更改。',
    'Lesson': '课时',
    'Lesson title': '课时标题',
    'Lesson update': '课时更新时间',
    'Lessons': '课时列表',
    'Lessons practiced': '已练习的课时',
    'Lessons with a passed check': '检查已通过的课时',
    'Loaded the saved note.': '已载入保存的笔记。',
    'Loading course order…': '正在加载课程顺序…',
    'Loading plans…': '正在加载学习计划…',
    'Mark a problem as solved from its page or from any problem list, and it will be counted here.': '在题目页面或任意题目列表中将题目标记为已解决，就会统计在这里。',
    'Mark as read': '标记为已读',
    'Mark this page as unread': '将此页面标记为未读',
    'Medium': '中等',
    'Merge keeps existing read marks. The newest bookmark choice wins. Different notes are kept together; conflicting code drafts are added as separate copies.': '合并会保留现有的已读标记，书签以最新的选择为准。不同的笔记会合并保留；有冲突的代码草稿会另存为副本。',
    'Merged note': '合并后的笔记',
    'Next unread lesson: {title}': '下一篇未读：{title}',
    'No practice recorded for this lesson yet.': '此课时还没有练习记录。',
    'None of your solved problems is in a study plan yet.': '你解决的题目还不在任何学习计划中。',
    'Note': '笔记',
    'Note saved in this browser.': '笔记已保存在此浏览器中。',
    'Open lesson': '打开课时',
    'Open playground': '打开练习场',
    'Open your dashboard': '打开我的学习',
    'Other saved version · {date}': '其他已保存版本 · {date}',
    'Other saved versions': '其他已保存版本',
    'Pages read': '已读页面',
    'Passed check': '通过的检查',
    'Pick a study plan and the problems you solve will be counted here.': '选择一个学习计划，你解决的题目会统计在这里。',
    'Playground data': '练习场数据',
    'Playground drafts': '练习场草稿',
    'Practice': '练习',
    'Practice could not be saved: {error}': '练习记录无法保存：{error}',
    'practice recorded': '已记录练习',
    'Practice records appear when you record practice or use a lesson playground. Running code does not automatically pass a check.': '记录练习或使用课时中的练习场后，练习记录会显示在这里。运行代码不会自动算作通过检查。',
    'Practiced': '已练习',
    'practiced; no check result': '已练习；暂无检查结果',
    'Preview a backup before merging it.': '请先预览备份再合并。',
    'Read': '已读',
    '✓ Read': '✓ 已读',
    'Read mark': '已读标记',
    'Read marks': '已读标记列表',
    'Reading progress': '阅读进度',
    'Reading progress is saved in this browser. Practice and check results are tracked separately.': '阅读进度保存在此浏览器中，练习和检查结果会单独记录。',
    'Record another practice session': '再记录一次练习',
    'Record practice': '记录练习',
    'Record that you have read this page': '记录你已读过此页面',
    'Recovered note from this tab': '从此标签页恢复的笔记',
    'Recovery data': '恢复数据',
    'Remove bookmark': '移除书签',
    'Save a note on any lesson. Notes stay private to this browser unless you export them.': '可以在任意课时保存笔记。除非你导出，笔记只保存在此浏览器中。',
    'Saved data changed in another tab. Choose the file again to preview an updated merge.': '已保存的数据在另一个标签页中被修改。请重新选择文件，预览更新后的合并结果。',
    'Saved learning data could not be read safely. It has not been replaced. Keep this tab open and recover your existing backup before making changes.': '无法安全读取已保存的学习数据，数据未被替换。请保持此标签页打开，并在修改前恢复现有备份。',
    'Saved learning data needs recovery before it can be moved safely.': '已保存的学习数据需要先恢复，才能安全迁移。',
    'Saved {name} data exceeds the supported size.': '已保存的{name}超出支持的大小。',
    'Self-reported practice': '自行记录的练习',
    'Showing the 60 most recent of {n} solved problems.': '显示已解决的 {n} 道题中最近的 60 道。',
    'solved {date}': '{date} 解决',
    'Suggested next: {title}': '建议下一篇：{title}',
    'The backup could not be merged safely. Existing account copies are preserved.': '无法安全合并备份，账户中的现有副本已保留。',
    'The backup date is invalid.': '备份日期无效。',
    'The backup merge was interrupted. Your original data is retained in a recovery record. Free browser space and reload to restore it.': '备份合并被中断。原始数据保存在恢复记录中，请释放浏览器存储空间后刷新页面以恢复。',
    'The backup was not merged. Existing data was preserved in the recovery record.': '备份未合并，现有数据已保存在恢复记录中。',
    'The backup was not merged. Existing data was preserved. Browser storage may be full or unavailable.': '备份未合并，现有数据已保留。浏览器存储可能已满或不可用。',
    'The course list contains an invalid entry.': '课程列表中包含无效条目。',
    'The course list format is unsupported.': '不支持该课程列表格式。',
    ' The current note has unsaved edits that are not in this backup; save or copy that text separately.': '当前笔记有未保存的修改，未包含在此备份中；请另行保存或复制这段文字。',
    'The saved note changed in another tab or backup merge. Your unsaved text is still here. Save it to replace the saved note, or reload the saved version.': '已保存的笔记在另一个标签页或备份合并中被修改。未保存的文字仍在这里：保存即可替换已保存的笔记，也可以重新载入已保存的版本。',
    'This backup exceeds the 6 MB export limit.': '此备份超出 6 MB 的导出上限。',
    'This change could not be saved: {error} Existing saved data is unchanged. Keep any unsaved note in the editor until you can save it.': '此更改无法保存：{error} 已保存的数据没有变化。请把未保存的笔记留在编辑器中，直到可以保存为止。',
    'This file contains an unsafe object key.': '此文件包含不安全的对象键。',
    'This is not a supported Compile N Run learning backup.': '这不是本站可识别的学习备份。',
    'Too many conflicting note versions.': '冲突的笔记版本过多。',
    'Unmark': '取消标记',
    'Unsafe object key.': '不安全的对象键。',
    'Unsaved changes could not be combined with the latest browser data: {error} Export this tab before reloading. Nothing was overwritten.': '未保存的更改无法与浏览器中的最新数据合并：{error} 请在重新加载前导出此标签页的数据。没有任何数据被覆盖。',
    'Unsaved note. Choose Save note to keep it.': '笔记尚未保存。选择“保存笔记”即可保存。',
    'Unsupported learning-data version.': '不支持的学习数据版本。',
    'Unsupported playground-data version.': '不支持的练习场数据版本。',
    'Unsupported reading-progress version.': '不支持的阅读进度版本。',
    'Untitled draft': '未命名草稿',
    'Visit': '访问时间',
    'Wait for your account connection before importing learning.': '请等待账户连接完成后再导入学习记录。',
    'Wait for your learning workspace to finish opening before previewing a backup.': '请等待学习空间加载完成后再预览备份。',
    'Your browser has unsaved or unreadable data. Export it before importing, then retry in a tab with working storage.': '浏览器中有未保存或无法读取的数据。请先导出，再在存储正常的标签页中重试导入。',
    'Your edits are still here; see the storage message above.': '你的修改仍在这里；请查看上方的存储提示。',
    'Your learning dashboard': '我的学习',
    'Your note could not be saved. Your text is still here; see the storage message above before leaving.': '笔记无法保存，文字仍在这里；离开前请查看上方的存储提示。',
    'Your recent courses will appear here after you open a lesson.': '打开课时后，最近学习的课程会显示在这里。',
    'Your saved data changed since the preview. Choose the backup again to preview the updated merge.': '预览后已保存的数据发生了变化。请重新选择备份，预览更新后的合并结果。',
    '{course} pages read': '{course}已读页面',
    '{label} contains an unsupported field.': '{label}包含不支持的字段。',
    '{label} contains too many entries.': '{label}的条目过多。',
    '{label} exceeds the 2 MB storage limit.': '{label}超出 2 MB 的存储上限。',
    '{label} has an invalid timestamp.': '{label}的时间戳无效。',
    '{label} is invalid or too long.': '{label}无效或过长。',
    '{label} must be an object.': '{label}必须是对象。',
    '{label}: {result} · {date}': '{label}：{result} · {date}',
    '{noteConflicts} different notes will be appended; {draftCopies} draft copies will be added.': '将追加 {noteConflicts} 条不同的笔记；将新增 {draftCopies} 个草稿副本。',
    '{n} of {total} LeetCode problems solved · Easy {easy} · Medium {medium} · Hard {hard} · {explained} with an explanation here.': '已解决 {n} / {total} 道 LeetCode 题目 · 简单 {easy} · 中等 {medium} · 困难 {hard} · 其中 {explained} 道有本站题解。',
    '{n} of {total} LeetCode problems solved · Easy {easy} · Medium {medium} · Hard {hard}.': '已解决 {n} / {total} 道 LeetCode 题目 · 简单 {easy} · 中等 {medium} · 困难 {hard}。',
    '{n} of {total} pages read': '已读 {n} / {total} 页',
    '{n} of {total} solved': '已解决 {n} / {total}',
    '{n} of {total} solved · complete': '已解决 {n} / {total} · 已完成',
    '{n} of {total} solved · Day {day} next: ': '已解决 {n} / {total} · 第 {day} 天的下一题：',
    '{n} playground draft saved in this browser.': '此浏览器中保存了 {n} 个练习场草稿。',
    '{n} playground drafts saved in this browser.': '此浏览器中保存了 {n} 个练习场草稿。',
    '{n} problem solved.': '已解决 {n} 道题。',
    '{n} problems solved.': '已解决 {n} 道题。',
    '{read} read marks · {bookmarks} bookmarks · {notes} notes · {practice} exercise records · {drafts} drafts': '{read} 个已读标记 · {bookmarks} 个书签 · {notes} 条笔记 · {practice} 条练习记录 · {drafts} 个草稿',
    '{total} pages · {count} read': '{total} 页 · 已读 {count}',
    ' · an earlier check passed': ' · 之前的检查曾通过',
    ' · previously passed on {date}': ' · 曾于 {date} 通过'
  };
  var isZh = /^zh/i.test(document.documentElement.lang);
  function t(text, vars) { var out = isZh && ZH[text] !== undefined ? ZH[text] : text; return vars ? out.replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m; }) : out; }
  var KEYS = { progress: 'cnr_progress', learning: 'cnr_learning_v1', playground: 'cnr_playground_v1' };
  var JOURNAL = 'cnr_learning_import_journal_v1';
  var MAX_STORE = 2 * 1024 * 1024, MAX_BACKUP = 6 * 1024 * 1024, MAX_NOTE = 20000;
  var state, catalog = null, pending = null, volatile = false, blocked = false, notice = '';
  var volatileKeys = Object.create(null);
  var mutationBase = null;
  function beginMutation(data) { mutationBase = clone(data); return data; }
  var importSequence = 0, writeGuard = null, displayGuard = null;
  function canView() { try { return displayGuard ? displayGuard() === true : canWrite(); } catch (_) { return false; } }
  function canWrite() { try { return writeGuard ? writeGuard() === true : !window.CNR_SYNC_ENABLED; } catch (_) { return false; } }
  var catalogPromise = null, noteDirty = false, noteBaseline = '', noteEditAt = 0, initialised = false;
  var own = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  var map = function () { return Object.create(null); };
  var fail = function (message) { throw new Error(message); };
  var record = function (value) { return value && typeof value === 'object' && !Array.isArray(value); };
  var bytes = function (text) { return new Blob([text]).size; };
  var clone = function (value) { return parse(JSON.stringify(value)); };
  function parse(text) {
    return JSON.parse(text, function (key, value) {
      if (key === '__proto__' || key === 'prototype' || key === 'constructor') fail(t('This file contains an unsafe object key.'));
      return value;
    });
  }
  function object(value, label) { if (!record(value)) fail(t('{label} must be an object.', { label: label })); return value; }
  function text(value, max, label, fallback) {
    if (value === undefined && fallback !== undefined) return fallback;
    if (typeof value !== 'string' || value.length > max || /\u0000/.test(value)) fail(t('{label} is invalid or too long.', { label: label }));
    return value;
  }
  function time(value, label, optional) {
    if (value === undefined && optional) return 0;
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > Date.now() + 86400000) fail(t('{label} has an invalid timestamp.', { label: label }));
    return value;
  }
  // Lesson paths are tutorial pages (/docs/...) or interview problem pages (/interview/problems/<slug>/).
  function isProblem(p) { return typeof p === 'string' && p.indexOf('/interview/problems/') === 0; }
  function docURL(value, allowCategory) {
    if (typeof value !== 'string' || value.length > 600 || value.indexOf('//') >= 0) return null;
    // 代码酷 URLs contain Chinese (raw or percent-encoded, in either hex case): compare them in decoded form.
    if (value.indexOf('%') >= 0) { try { value = decodeURI(value); } catch (_) { return null; } if (value.length > 600 || value.indexOf('//') >= 0) return null; }
    if (!/^\/docs\/[\p{L}\p{N}\p{M}_+./-]+\/?$/u.test(value) && !/^\/interview\/problems\/[a-z0-9]+(-[a-z0-9]+)*\/?$/.test(value)) return null;
    if (value.split('/').some(function (part) { return part === '.' || part === '..'; }) || (!allowCategory && value.indexOf('/docs/category/') === 0)) return null;
    var normal = value.replace(/\/+$/, '') + '/';
    return normal.length <= 600 ? normal : null;
  }
  function path(value) { return docURL(value, false); }
  function courseID(value) {
    return typeof value === 'string' && value.length <= 160 && /^[a-z0-9][a-z0-9_-]*(\/[a-z0-9][a-z0-9_-]*)+$/.test(value) ? value : null;
  }
  function keys(value, maximum, label) {
    object(value, label); var names = Object.keys(value);
    if (names.length > maximum) fail(t('{label} contains too many entries.', { label: label }));
    names.forEach(function (k) { if (k === '__proto__' || k === 'constructor' || k === 'prototype') fail(t('Unsafe object key.')); });
    return names;
  }
  function empty() { return { progress: { v: 1, done: map(), tuts: map() }, learning: { v: 1, lessons: map() }, playground: { version: 1, drafts: map() } }; }
  function checkProgress(value) {
    object(value, t('Reading progress')); if (value.v !== 1) fail(t('Unsupported reading-progress version.'));
    var out = empty().progress;
    keys(value.done, 20000, t('Read marks')).forEach(function (key) {
      var p = path(key); if (!p) fail(t('A read mark has an invalid lesson path.'));
      var tut = value.done[key] === true ? 1 : time(value.done[key], t('Read mark'));
      if (tut) out.done[p] = Math.max(out.done[p] || 0, tut);
    });
    keys(value.tuts, 1000, t('Courses')).forEach(function (key) {
      if (!courseID(key)) fail(t('Invalid course identifier.'));
      var item = object(value.tuts[key], t('Course')), clean = {};
      clean.label = text(item.label, 240, t('Course title'), key);
      clean.url = item.url === undefined ? '/docs/' + key + '/' : docURL(item.url, true);
      if (!clean.url) fail(t('Invalid course URL.'));
      ['total', 'done'].forEach(function (name) {
        var n = item[name] === undefined ? 0 : item[name];
        if (!Number.isSafeInteger(n) || n < 0 || n > 20000) fail(t('Invalid reading count.'));
        clean[name] = n;
      });
      clean.t = time(item.t, t('Last visit'), true);
      if (item.last !== undefined) {
        object(item.last, t('Last lesson')); var p = path(item.last.path);
        if (!p) fail(t('Invalid last-lesson URL.'));
        clean.last = { path: p, title: text(item.last.title, 300, t('Lesson title'), p) };
      }
      out.tuts[key] = clean;
    });
    return out;
  }
  function checkLearning(value) {
    object(value, t('Learning data')); if (value.v !== 1) fail(t('Unsupported learning-data version.'));
    var out = empty().learning;
    keys(value.lessons, 5000, t('Lessons')).forEach(function (key) {
      var p = path(key); if (!p) fail(t('Invalid lesson path.'));
      var item = object(value.lessons[key], t('Lesson')), c = item.course || '';
      if (c && !courseID(c)) fail(t('Invalid lesson course.'));
      var clean = { title: text(item.title, 300, t('Lesson title'), p), course: c,
        visitedAt: time(item.visitedAt, t('Visit'), true), updatedAt: time(item.updatedAt, t('Lesson update'), true), practice: map() };
      if (item.bookmark !== undefined) {
        object(item.bookmark, t('Bookmark')); if (typeof item.bookmark.value !== 'boolean') fail(t('Invalid bookmark value.'));
        clean.bookmark = { value: item.bookmark.value, updatedAt: time(item.bookmark.updatedAt, t('Bookmark')) };
      }
      if (item.noteConflicts !== undefined) {
        if (!Array.isArray(item.noteConflicts) || item.noteConflicts.length > 10) fail(t('Too many conflicting note versions.'));
        clean.noteConflicts = item.noteConflicts.map(function (n) { object(n, t('Conflicting note')); return { text: text(n.text, MAX_NOTE, t('Conflicting note')), updatedAt: time(n.updatedAt, t('Conflicting note')) }; });
      }
      if (item.note !== undefined) {
        object(item.note, t('Note')); clean.note = { text: text(item.note.text, MAX_NOTE, t('Note')), updatedAt: time(item.note.updatedAt, t('Note')) };
      }
      keys(item.practice || {}, 100, t('Exercise records')).forEach(function (id) {
        if (!/^[A-Za-z0-9][A-Za-z0-9_.:/-]{0,159}$/.test(id)) fail(t('Invalid exercise identifier.'));
        var evidence = object(item.practice[id], t('Exercise record'));
        if (['practiced', 'passed', 'not-passed'].indexOf(evidence.lastResult) < 0) fail(t('Invalid exercise result.'));
        var attempted = time(evidence.attemptedAt, t('Practice')), passed = time(evidence.passedAt, t('Passed check'), true);
        if (passed > attempted || (evidence.lastResult === 'passed' && !passed)) fail(t('Inconsistent exercise evidence.'));
        clean.practice[id] = { attemptedAt: attempted, passedAt: passed, lastResult: evidence.lastResult };
      });
      out.lessons[p] = clean;
    });
    return out;
  }
  function checkPlayground(value) {
    object(value, t('Playground data')); if (value.version !== 1) fail(t('Unsupported playground-data version.'));
    var out = empty().playground;
    keys(value.drafts, 100, t('Playground drafts')).forEach(function (key) {
      if (!/^[A-Za-z0-9][A-Za-z0-9:/._-]{0,599}$/.test(key)) fail(t('Invalid draft identifier.'));
      var d = object(value.drafts[key], t('Draft')), p = d.path === '' ? '' : path(d.path), c = d.course || '';
      if (p === null || (c && !courseID(c))) fail(t('Invalid draft lesson or course.'));
      var stamp = Date.parse(d.updatedAt);
      if (typeof d.updatedAt !== 'string' || !Number.isFinite(stamp) || stamp < 0 || stamp > Date.now() + 86400000) fail(t('Invalid draft timestamp.'));
      out.drafts[key] = { html: text(d.html, 100000, t('Draft HTML')), css: text(d.css, 100000, t('Draft CSS')), js: text(d.js, 100000, t('Draft JavaScript')),
        title: text(d.title, 300, t('Draft title'), t('Untitled draft')), path: p, course: c,
        exerciseId: text(d.exerciseId, 160, t('Exercise ID'), ''), updatedAt: new Date(stamp).toISOString() };
    });
    return out;
  }
  var validators = { progress: checkProgress, learning: checkLearning, playground: checkPlayground };
  function checkSize(value, label) { if (bytes(JSON.stringify(value)) > MAX_STORE) fail(t('{label} exceeds the 2 MB storage limit.', { label: storeName(label) })); return value; }
  // Store names ('progress', 'learning', 'playground') double as English labels; Chinese gets readable names.
  function storeName(name) { var names = { progress: t('Reading progress'), learning: t('Learning data'), playground: t('Playground data') }; return isZh && own(names, name) ? names[name] : name; }
  function recoverJournal() {
    var raw = localStorage.getItem(JOURNAL); if (!raw) return;
    var j = parse(raw); object(j, t('Import recovery')); if (j.v !== 1) fail(t('A pending backup merge needs recovery.'));
    var originals = object(j.originals, t('Import recovery'));
    Object.keys(KEYS).forEach(function (name) {
      var saved = originals[name]; if (saved !== null && typeof saved !== 'string') fail(t('Invalid recovery data.'));
      if (saved !== null) checkSize(validators[name](parse(saved)), t('Recovery data'));
    });
    // Free only the three known data keys before restoring their validated originals.
    Object.keys(KEYS).forEach(function (name) { localStorage.removeItem(KEYS[name]); });
    Object.keys(KEYS).forEach(function (name) { if (originals[name] !== null) localStorage.setItem(KEYS[name], originals[name]); });
    localStorage.removeItem(JOURNAL);
    notice = t('An interrupted backup merge was rolled back. Your earlier data has been restored.');
  }
  function readAll() {
    var out = empty();
    Object.keys(KEYS).forEach(function (name) {
      var raw = localStorage.getItem(KEYS[name]);
      if (raw !== null) { if (bytes(raw) > MAX_STORE) fail(t('Saved {name} data exceeds the supported size.', { name: storeName(name) })); out[name] = validators[name](parse(raw)); }
    });
    return out;
  }
  function serialise(value) { return JSON.stringify(value); }
  function storageError(error, corrupt) {
    volatile = true;
    if (corrupt) blocked = true;
    notice = corrupt ? t('Saved learning data could not be read safely. It has not been replaced. Keep this tab open and recover your existing backup before making changes.') :
      t('Browser storage is unavailable or full. These changes are only in this tab. Download a backup before leaving; changes are not saved across visits.');
    renderNotices();
  }
  function fresh() {
    if (volatile && !blocked) {
      try { var pendingState = empty(); Object.keys(volatileKeys).forEach(function (name) { pendingState[name] = state[name]; }); return beginMutation(merge(readAll(), pendingState, t('Recovered note from this tab')).state); }
      catch (error) { notice = t('Unsaved changes could not be combined with the latest browser data: {error} Export this tab before reloading. Nothing was overwritten.', { error: error.message }); renderNotices(); return null; }
    }
    if (blocked) return beginMutation(clone(state));
    try { return beginMutation(readAll()); } catch (e) { storageError(e, !(e && e.name === 'SecurityError')); return beginMutation(clone(state)); }
  }
  function persist(next, names) {
    var beforeMutation = mutationBase; mutationBase = null;
    if (!canWrite()) { notice = t('Learning is waiting for your account connection. Your existing data has not been changed.'); renderNotices(); return false; }
    names = Array.from(new Set(names.concat(Object.keys(volatileKeys))));
    try {
      names.forEach(function (name) { next[name] = checkSize(validators[name](next[name]), name); });
    } catch (error) {
      notice = t('This change could not be saved: {error} Existing saved data is unchanged. Keep any unsaved note in the editor until you can save it.', { error: error.message });
      changed(); return false;
    }
    if (blocked) { state = next; storageError(null, true); return false; }
    if (window.CNR_SYNC_ENABLED && window.CNRLearningSync && beforeMutation) return window.CNRLearningSync.commitMutation(beforeMutation, next);
    var old = {}, written = [];
    try {
      if (localStorage.getItem(JOURNAL)) fail(t('A backup merge is in progress. Please reload after it finishes.'));
      names.forEach(function (name) { old[name] = localStorage.getItem(KEYS[name]); });
      names.forEach(function (name) { localStorage.setItem(KEYS[name], serialise(next[name])); written.push(name); });
      state = next; volatile = false; volatileKeys = map(); notice = ''; changed(beforeMutation); return true;
    } catch (e) {
      try {
        written.forEach(function (name) { localStorage.removeItem(KEYS[name]); });
        written.forEach(function (name) { if (old[name] !== null) localStorage.setItem(KEYS[name], old[name]); });
      } catch (ignored) { blocked = true; }
      names.forEach(function (name) { volatileKeys[name] = true; });
      state = next; storageError(e, blocked); changed(beforeMutation); return false;
    }
  }
  function metadata(p) {
    var current = window.CNR_PAGE || {};
    if (path(current.path) === p) return { title: typeof current.title === 'string' ? current.title.slice(0, 300) : p, course: courseID(current.course) || '' };
    if (catalog && catalog.byPath[p]) return catalog.byPath[p];
    var stored = state.learning.lessons[p]; return stored ? { title: stored.title, course: stored.course } : { title: p, course: '' };
  }
  function ensureLesson(target, p, meta) {
    if (!target.learning.lessons[p]) target.learning.lessons[p] = { title: meta.title, course: meta.course, visitedAt: 0, updatedAt: 0, practice: map() };
    return target.learning.lessons[p];
  }
  function updateCounts(target) {
    Object.keys(target.progress.tuts).forEach(function (id) {
      var tut = target.progress.tuts[id], course = catalog && catalog.byID[id];
      if (course) { tut.total = course.lessons.length; tut.done = course.lessons.filter(function (lesson) { return target.progress.done[lesson.path]; }).length; }
      else tut.done = Math.min(tut.total, Object.keys(target.progress.done).filter(function (p) { return p.indexOf('/docs/' + id + '/') === 0; }).length);
    });
  }
  function setRead(p, on) {
    p = path(p); if (!p) return false;
    var next = fresh(); if (!next) return false; if (on) next.progress.done[p] = Date.now(); else delete next.progress.done[p];
    updateCounts(next); return persist(next, ['progress']);
  }
  function bookmark(p, on) {
    p = path(p); if (!p) return false;
    var next = fresh(); if (!next) return false; var item = ensureLesson(next, p, metadata(p));
    item.bookmark = { value: !!on, updatedAt: Date.now() }; item.updatedAt = Date.now();
    return persist(next, ['learning']);
  }
  function saveNote(p, value) {
    p = path(p); if (!p) return false; text(value, MAX_NOTE, t('Note'));
    var next = fresh(); if (!next) return false; var item = ensureLesson(next, p, metadata(p));
    item.note = { text: value, updatedAt: Date.now() }; item.updatedAt = Date.now();
    return persist(next, ['learning']);
  }
  function practice(detail) {
    if (!record(detail)) return;
    var p = path(detail.path); if (!p) return;
    var id = detail.exerciseId || 'playground';
    if (typeof id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.:/-]{0,159}$/.test(id) || ['constructor', 'prototype', '__proto__'].indexOf(id) >= 0) return;
    var meta = metadata(p); if (meta.title === p && typeof detail.title === 'string') meta.title = detail.title.slice(0, 300);
    if (!meta.course) meta.course = courseID(detail.course) || '';
    var next = fresh(); if (!next) return false; var item = ensureLesson(next, p, meta), old = item.practice[id], now = Date.now();
    item.practice[id] = { attemptedAt: now, passedAt: detail.passed === true ? now : (old && old.passedAt || 0),
      lastResult: detail.passed === true ? 'passed' : (detail.passed === false ? 'not-passed' : 'practiced') };
    item.updatedAt = now; persist(next, ['learning']);
  }
  // Interview problems: "solved" is a passed practice record with the id "solved" on the problem's page path.
  // Marking works from the problem page or any problem table, including problems without a write-up yet.
  function setSolved(p, on, title) {
    p = path(p); if (!p || !isProblem(p)) return false;
    var meta = metadata(p); if (typeof title === 'string' && title.trim() && (meta.title === p || on)) meta.title = title.trim().slice(0, 300);
    var next = fresh(); if (!next) return false; var item = ensureLesson(next, p, meta), now = Date.now();
    if (on) { item.practice.solved = { attemptedAt: now, passedAt: now, lastResult: 'passed' }; item.title = meta.title; }
    else delete item.practice.solved;
    item.updatedAt = now; return persist(next, ['learning']);
  }
  function solvedAt(p) { var item = state.learning.lessons[p], r = item && item.practice.solved; return r && r.passedAt ? r.passedAt : 0; }
  function solvedProblems() {
    return Object.keys(state.learning.lessons).filter(function (p) { return isProblem(p) && solvedAt(p); })
      .map(function (p) { return { path: p, slug: p.slice('/interview/problems/'.length).replace(/\/$/, ''), title: state.learning.lessons[p].title, solvedAt: solvedAt(p) }; })
      .sort(function (a, b) { return b.solvedAt - a.solvedAt; });
  }
  function merge(base, incoming, noteLabel) {
    var out = clone(base), summary = { read: Object.keys(incoming.progress.done).length, bookmarks: 0, notes: 0, noteConflicts: 0, drafts: Object.keys(incoming.playground.drafts).length, draftCopies: 0, practice: 0 };
    Object.keys(incoming.progress.done).forEach(function (p) { out.progress.done[p] = Math.max(out.progress.done[p] || 0, incoming.progress.done[p]); });
    Object.keys(incoming.progress.tuts).forEach(function (id) {
      var a = out.progress.tuts[id], b = incoming.progress.tuts[id]; if (!a || b.t > a.t) out.progress.tuts[id] = clone(b);
    });
    Object.keys(incoming.learning.lessons).forEach(function (p) {
      var b = incoming.learning.lessons[p], a = ensureLesson(out, p, b);
      if (b.updatedAt > a.updatedAt) { a.title = b.title; a.course = b.course; }
      a.visitedAt = Math.max(a.visitedAt, b.visitedAt); a.updatedAt = Math.max(a.updatedAt, b.updatedAt);
      if (b.bookmark) { if (b.bookmark.value) summary.bookmarks++; if (!a.bookmark || b.bookmark.updatedAt > a.bookmark.updatedAt) a.bookmark = clone(b.bookmark); }
      if (b.note && b.note.text) {
        summary.notes++;
        if (!a.note || !a.note.text) a.note = clone(b.note);
        else if (a.note.text !== b.note.text && a.note.text.indexOf(b.note.text) < 0) {
          summary.noteConflicts++;
          a.note = { text: a.note.text + '\n\n--- ' + (noteLabel || t('Imported note')) + ' (' + new Date(b.note.updatedAt).toISOString().slice(0, 10) + ') ---\n' + b.note.text, updatedAt: Date.now() };
          text(a.note.text, MAX_NOTE, t('Merged note'));
        }
      }
      Object.keys(b.practice).forEach(function (id) {
        summary.practice++; var previous = a.practice[id], added = b.practice[id];
        if (!previous) a.practice[id] = clone(added);
        else a.practice[id] = { attemptedAt: Math.max(previous.attemptedAt, added.attemptedAt), passedAt: Math.max(previous.passedAt, added.passedAt), lastResult: added.attemptedAt > previous.attemptedAt ? added.lastResult : previous.lastResult };
      });
    });
    Object.keys(incoming.playground.drafts).forEach(function (key) {
      var b = incoming.playground.drafts[key], a = out.playground.drafts[key];
      if (!a) out.playground.drafts[key] = clone(b);
      else if (a.html !== b.html || a.css !== b.css || a.js !== b.js) {
        // Preserve both source versions. Re-importing identical source adds no further copy.
        var duplicate = Object.keys(out.playground.drafts).some(function (k) { var d = out.playground.drafts[k]; return d.html === b.html && d.css === b.css && d.js === b.js && d.path === b.path; });
        if (!duplicate) {
          var count = 1, copyKey = 'workspace:import-' + Date.parse(b.updatedAt) + '-' + count;
          while (own(out.playground.drafts, copyKey)) copyKey = 'workspace:import-' + Date.parse(b.updatedAt) + '-' + (++count);
          out.playground.drafts[copyKey] = clone(b); summary.draftCopies++;
        }
      }
    });
    updateCounts(out);
    Object.keys(KEYS).forEach(function (name) { out[name] = checkSize(validators[name](out[name]), name); });
    return { state: out, summary: summary };
  }
  // Account snapshots must not silently drop fields from an unsupported schema.
  function checkBackupFields(backup) {
    function only(value, names, label) {
      object(value, label); Object.keys(value).forEach(function (key) { if (names.indexOf(key) < 0) fail(t('{label} contains an unsupported field.', { label: label })); });
    }
    only(backup, ['format', 'version', 'exportedAt', 'progress', 'learning', 'playground'], t('Backup'));
    only(backup.progress, ['v', 'done', 'tuts'], t('Reading progress'));
    keys(backup.progress.tuts, 1000, t('Courses')).forEach(function (id) {
      var item = backup.progress.tuts[id]; only(item, ['label', 'url', 'total', 'done', 'last', 't'], t('Course'));
      if (item.last !== undefined) only(item.last, ['path', 'title'], t('Last lesson'));
    });
    only(backup.learning, ['v', 'lessons'], t('Learning data'));
    keys(backup.learning.lessons, 5000, t('Lessons')).forEach(function (p) {
      var item = backup.learning.lessons[p]; only(item, ['title', 'course', 'visitedAt', 'updatedAt', 'bookmark', 'note', 'noteConflicts', 'practice'], t('Lesson'));
      if (item.bookmark !== undefined) only(item.bookmark, ['value', 'updatedAt'], t('Bookmark'));
      if (item.note !== undefined) only(item.note, ['text', 'updatedAt'], t('Note'));
      if (item.noteConflicts !== undefined) { if (!Array.isArray(item.noteConflicts)) fail(t('Invalid note conflicts.')); item.noteConflicts.forEach(function (n) { only(n, ['text', 'updatedAt'], t('Conflicting note')); }); }
      keys(item.practice || {}, 100, t('Exercise records')).forEach(function (id) { only(item.practice[id], ['attemptedAt', 'passedAt', 'lastResult'], t('Exercise record')); });
    });
    only(backup.playground, ['version', 'drafts'], t('Playground data'));
    keys(backup.playground.drafts, 100, t('Playground drafts')).forEach(function (key) { only(backup.playground.drafts[key], ['html', 'css', 'js', 'title', 'path', 'course', 'exerciseId', 'updatedAt'], t('Draft')); });
  }
  function validateBackup(raw, strict) {
    if (typeof raw !== 'string' || bytes(raw) > MAX_BACKUP) fail(t('Choose a JSON backup no larger than 6 MB.'));
    var backup = parse(raw); object(backup, t('Backup'));
    if (strict) checkBackupFields(backup);
    if (backup.format !== 'cnr-learning-backup' || backup.version !== 1) fail(t('This is not a supported Compile N Run learning backup.'));
    if (!Number.isFinite(Date.parse(backup.exportedAt))) fail(t('The backup date is invalid.'));
    var clean = empty(); Object.keys(KEYS).forEach(function (name) { clean[name] = checkSize(validators[name](backup[name]), name); });
    return clean;
  }
  function prepareImport(raw) {
    if (!canWrite()) fail(t('Wait for your learning workspace to finish opening before previewing a backup.'));
    pending = null;
    if (volatile || blocked) fail(t('Your browser has unsaved or unreadable data. Export it before importing, then retry in a tab with working storage.'));
    var incoming = validateBackup(raw), current = readAll(), merged = merge(current, incoming);
    pending = { incoming: incoming, base: serialise(current), summary: merged.summary, token: String(++importSequence) };
    var summary = clone(merged.summary); summary.previewToken = pending.token; return summary;
  }
  function applyImport(expectedToken) {
    if (!canWrite()) fail(t('Wait for your account connection before importing learning.'));
    if (!pending) fail(t('Preview a backup before merging it.'));
    if (expectedToken !== undefined && expectedToken !== pending.token) fail(t('A different backup has been previewed. Preview this backup again before merging it.'));
    if (volatile || blocked) fail(t('Browser storage is not ready for a backup merge.'));
    var before = readAll();
    if (serialise(before) !== pending.base) { pending = null; fail(t('Your saved data changed since the preview. Choose the backup again to preview the updated merge.')); }
    var merged = merge(before, pending.incoming).state, originals = {}, journalWritten = false;
    if (window.CNR_SYNC_ENABLED && window.CNRLearningSync) {
      return window.CNRLearningSync.commitMutation(before, merged).then(function (ok) {
        if (!ok) fail(t('The backup could not be merged safely. Existing account copies are preserved.'));
        pending = null; window.dispatchEvent(new CustomEvent('cnr:learning-imported')); return true;
      });
    }
    Object.keys(KEYS).forEach(function (name) { originals[name] = localStorage.getItem(KEYS[name]); });
    try {
      if (localStorage.getItem(JOURNAL)) fail(t('Another backup merge is in progress.'));
      localStorage.setItem(JOURNAL, serialise({ v: 1, originals: originals })); journalWritten = true;
      Object.keys(KEYS).forEach(function (name) { localStorage.setItem(KEYS[name], serialise(merged[name])); });
      localStorage.removeItem(JOURNAL);
    } catch (error) {
      // The journal is written before any user data changes. Restore on any partial failure.
      try { if (journalWritten) recoverJournal(); } catch (recoveryError) { blocked = true; notice = t('The backup merge was interrupted. Your original data is retained in a recovery record. Free browser space and reload to restore it.'); }
      state = before; pending = null; renderNotices();
      fail(blocked ? t('The backup was not merged. Existing data was preserved in the recovery record.') : t('The backup was not merged. Existing data was preserved. Browser storage may be full or unavailable.'));
    }
    state = merged; pending = null; notice = ''; changed(before);
    window.dispatchEvent(new CustomEvent('cnr:learning-imported'));
    return true;
  }
  function exportBackup() {
    if (blocked) fail(t('Existing data needs recovery before a complete backup can be exported.'));
    if (!volatile) state = readAll();
    else { var combined = fresh(); if (combined) state = combined; }
    var result = serialise({ format: 'cnr-learning-backup', version: 1, exportedAt: new Date().toISOString(), progress: state.progress, learning: state.learning, playground: state.playground });
    if (bytes(result) > MAX_BACKUP) fail(t('This backup exceeds the 6 MB export limit.'));
    return result;
  }
  /* Rendering uses DOM nodes and textContent exclusively, including imported notes. */
  function el(tag, value, className) {
    var node = document.createElement(tag); if (value !== undefined && value !== null) node.textContent = value; if (className) node.className = className; return node;
  }
  function link(label, href, className) {
    var safe = docURL(href, true) || (['/learn/', '/roadmap/', '/playground/'].indexOf(href) >= 0 ? href : null) ||
      (typeof href === 'string' && /^\/interview\/plans\/[a-z0-9]+(-[a-z0-9]+)*\/(#day-\d{1,3})?$/.test(href) ? href : null);
    if (!safe) return el('span', label, className);
    var a = el('a', label, className); a.href = safe; return a;
  }
  function button(label, handler, className) {
    var b = el('button', label, className || 'cnr-learning__button'); b.type = 'button'; b.addEventListener('click', handler); return b;
  }
  function date(value) { return value ? new Date(value).toLocaleDateString(isZh ? 'zh-CN' : undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''; }
  function difficulty(level) { var names = { Easy: t('Easy'), Medium: t('Medium'), Hard: t('Hard') }; return own(names, level) ? names[level] : level; }
  function lessonStatus(p) {
    var item = state.learning.lessons[p], records = item ? Object.values(item.practice) : [];
    return { read: !!state.progress.done[p], practiced: records.some(function (r) { return !!r.attemptedAt; }), passed: records.some(function (r) { return !!r.passedAt; }) };
  }
  function badges(p) {
    var status = lessonStatus(p), box = el('div', null, 'cnr-learning__badges');
    [[t('Read'), status.read], [t('Practiced'), status.practiced], [t('Check passed'), status.passed]].forEach(function (pair) {
      box.appendChild(el('span', (pair[1] ? '✓ ' : '○ ') + pair[0], 'cnr-learning__badge' + (pair[1] ? ' is-recorded' : '')));
    });
    return box;
  }
  var sidebar = document.querySelector('[data-doc-sidebar][data-tut]');
  var currentPage = (function () {
    var raw = window.CNR_PAGE || {}, p = path(raw.path || location.pathname);
    if (!p) return null;
    return { path: p, title: typeof raw.title === 'string' ? raw.title.slice(0, 300) : document.title.replace(/\s*\|\s*[^|]*$/, '').slice(0, 300),
      course: courseID(raw.course) || (sidebar && courseID(sidebar.getAttribute('data-tut'))) || '',
      courseLabel: typeof raw.courseLabel === 'string' ? raw.courseLabel.slice(0, 240) : (sidebar && sidebar.getAttribute('data-tut-label')) || '',
      courseUrl: docURL(raw.courseUrl, true) || (sidebar && docURL(sidebar.getAttribute('data-tut-url'), true)) || '' };
  })();
  function sidebarLessons(scope) {
    var seen = map(), out = [];
    if (scope) scope.querySelectorAll('a.menu__link[href]').forEach(function (a) {
      var p = path(a.getAttribute('href')); if (p && !seen[p]) { seen[p] = true; out.push({ path: p, title: a.textContent.replace(/✓/g, '').trim().slice(0, 300) }); }
    });
    return out;
  }
  function courseLessons(id) {
    if (catalog && catalog.byID[id]) return catalog.byID[id].lessons;
    return sidebar && sidebar.getAttribute('data-tut') === id ? sidebarLessons(sidebar.querySelector('.theme-doc-sidebar-menu')) : [];
  }
  function visit() {
    if (!canWrite()) return;
    if (!currentPage || !document.querySelector('[data-learning-tools], [data-mark-done]')) return;
    var next = fresh(); if (!next) return; var item = ensureLesson(next, currentPage.path, currentPage), now = Date.now();
    item.title = currentPage.title; item.course = currentPage.course; item.visitedAt = now;
    if (currentPage.course) {
      var lessons = courseLessons(currentPage.course), tut = next.progress.tuts[currentPage.course] || {};
      tut.label = currentPage.courseLabel || tut.label || currentPage.course;
      tut.url = currentPage.courseUrl || tut.url || '/docs/' + currentPage.course + '/';
      tut.total = lessons.length || tut.total || 0; tut.done = lessons.length ? lessons.filter(function (l) { return next.progress.done[l.path]; }).length : tut.done || 0;
      tut.last = { path: currentPage.path, title: currentPage.title }; tut.t = now;
      next.progress.tuts[currentPage.course] = tut;
    }
    persist(next, ['progress', 'learning']);
  }
  function markLink(a, read) {
    if (!a) return; var existing = a.querySelector(':scope > .cnr-check');
    if (read && !existing) { existing = el('span', '✓', 'cnr-check'); existing.setAttribute('aria-label', t('Read')); existing.title = t('Read'); a.appendChild(existing); }
    if (!read && existing) existing.remove();
  }
  function renderSidebar() {
    if (!canView()) { document.querySelectorAll('.cnr-check').forEach(function (n) { n.remove(); }); var waiting = sidebar && sidebar.querySelector('[data-learning-sidebar]'); if (waiting) waiting.hidden = true; return; }
    document.querySelectorAll('.theme-doc-sidebar-menu').forEach(function (menu) {
      menu.querySelectorAll('.theme-doc-sidebar-item-link > a.menu__link[href]').forEach(function (a) { markLink(a, !!state.progress.done[path(a.getAttribute('href'))]); });
      menu.querySelectorAll('.theme-doc-sidebar-item-category').forEach(function (li) {
        var a = li.querySelector(':scope > .menu__list-item-collapsible > .menu__link'), sub = li.querySelector(':scope > .menu__list'), lessons = sidebarLessons(sub);
        var p = a && path(a.getAttribute('href')); if (p && !lessons.some(function (l) { return l.path === p; })) lessons.push({ path: p });
        markLink(a, lessons.length > 0 && lessons.every(function (l) { return state.progress.done[l.path]; }));
      });
    });
    if (sidebar) {
      var lessons = sidebarLessons(sidebar.querySelector('.theme-doc-sidebar-menu'));
      var n = lessons.filter(function (l) { return state.progress.done[l.path]; }).length;
      var box = sidebar.querySelector('[data-learning-sidebar]');
      if (!box) { box = el('div', null, 'cnr-progress'); box.setAttribute('data-learning-sidebar', ''); sidebar.insertBefore(box, sidebar.firstChild); }
      box.hidden = false; box.replaceChildren(el('p', t('{n} of {total} pages read', { n: n, total: lessons.length })));
      var bar = el('progress'); bar.max = lessons.length || 1; bar.value = n; bar.setAttribute('aria-label', t('Pages read')); box.appendChild(bar); box.appendChild(link(t('Your learning dashboard'), '/learn/'));
      var categories = map();
      sidebar.querySelectorAll('.theme-doc-sidebar-item-category').forEach(function (li) {
        var a = li.querySelector(':scope > .menu__list-item-collapsible > .menu__link'); if (!a) return;
        var url = docURL(a.getAttribute('href'), true), list = sidebarLessons(li.querySelector(':scope > .menu__list')), p = path(a.getAttribute('href'));
        if (p && !list.some(function (l) { return l.path === p; })) list.push({ path: p }); if (url) categories[url] = list;
      });
      document.querySelectorAll('.generatedIndexPage_vN6x a.theme-doc-card-container[href]').forEach(function (a) {
        var url = docURL(a.getAttribute('href'), true), list = categories[url], count = list ? list.filter(function (l) { return state.progress.done[l.path]; }).length : 0;
        a.classList.toggle('cnr-card-read', list ? list.length > 0 && count === list.length : !!state.progress.done[path(url)]);
        var description = a.querySelector('.cardDescription_L2fP'); if (list && description) description.textContent = t('{total} pages · {count} read', { total: list.length, count: count });
      });
    }
  }
  function renderNotices() {
    document.querySelectorAll('[data-learning-notice]').forEach(function (node) { node.textContent = notice; node.hidden = !notice; });
  }
  function renderTools() {
    if (!currentPage) return;
    var p = currentPage.path, item = state.learning.lessons[p], status = lessonStatus(p);
    document.querySelectorAll('[data-mark-done]').forEach(function (b) { b.disabled = !canWrite(); b.textContent = status.read ? t('✓ Read') : t('Mark as read'); b.setAttribute('aria-pressed', String(status.read)); b.title = status.read ? t('Mark this page as unread') : t('Record that you have read this page'); });
    document.querySelectorAll('[data-learning-tools]').forEach(function (root) {
      root.hidden = !canView();
      var b = root.querySelector('[data-learning-bookmark]'); if (b) { var on = !!(item && item.bookmark && item.bookmark.value); b.textContent = on ? t('✓ Bookmarked') : t('Bookmark'); b.setAttribute('aria-pressed', String(on)); }
      var practiced = root.querySelector('[data-learning-practiced]'); if (practiced) practiced.textContent = status.practiced ? t('Record another practice session') : t('Record practice');
      var states = root.querySelector('[data-learning-states]'); if (states) states.replaceChildren(badges(p));
      var field = root.querySelector('[data-learning-note]'), saved = item && item.note ? item.note.text : '';
      if (field && !noteDirty) { field.value = saved; noteBaseline = saved; }
      var conflict = root.querySelector('[data-learning-note-conflict]'); if (conflict) { conflict.hidden = !(noteDirty && saved !== noteBaseline); conflict.textContent = t('The saved note changed in another tab or backup merge. Your unsaved text is still here. Save it to replace the saved note, or reload the saved version.'); }
      var conflicts = root.querySelector('[data-learning-note-versions]');
      if (!conflicts) { conflicts = el('details'); conflicts.setAttribute('data-learning-note-versions', ''); var editor = root.querySelector('.cnr-learning__editor'); if (editor) editor.appendChild(conflicts); }
      conflicts.replaceChildren(el('summary', t('Other saved versions'))); conflicts.hidden = !(item && item.noteConflicts && item.noteConflicts.length);
      if (item && item.noteConflicts) item.noteConflicts.forEach(function (n) { conflicts.appendChild(el('p', date(n.updatedAt), 'cnr-learning__muted')); conflicts.appendChild(el('p', n.text, 'cnr-learning__note-text')); });
      var evidence = root.querySelector('[data-learning-evidence]');
      if (evidence) {
        evidence.replaceChildren();
        if (item) Object.keys(item.practice).sort(function (a, b) { return item.practice[b].attemptedAt - item.practice[a].attemptedAt; }).forEach(function (id) {
          var r = item.practice[id], label = id === 'manual' ? t('Self-reported practice') : id;
          var result = r.lastResult === 'passed' ? t('check passed') : r.lastResult === 'not-passed' ? t('check not passed') : t('practiced; no check result');
          evidence.appendChild(el('li', t('{label}: {result} · {date}', { label: label, result: result, date: date(r.attemptedAt) }) + (r.passedAt && r.lastResult !== 'passed' ? t(' · previously passed on {date}', { date: date(r.passedAt) }) : '')));
        });
        if (!evidence.children.length) evidence.appendChild(el('li', t('No practice recorded for this lesson yet.')));
      }
      var nextNode = root.querySelector('[data-learning-next]'), lessons = courseLessons(currentPage.course), index = lessons.findIndex(function (l) { return l.path === p; });
      var next = lessons.slice(index + 1).find(function (l) { return !state.progress.done[l.path]; });
      if (!next) next = lessons.find(function (l) { return l.path !== p && !state.progress.done[l.path]; });
      if (nextNode) { nextNode.replaceChildren(); if (next) nextNode.appendChild(link(t('Next unread lesson: {title}', { title: next.title }), next.path)); }
    });
  }
  function recentCourses() {
    return Object.keys(state.progress.tuts).map(function (id) { return { id: id, saved: state.progress.tuts[id], course: catalog && catalog.byID[id] }; })
      .filter(function (entry) { return entry.saved.last && path(entry.saved.last.path); })
      .sort(function (a, b) { return b.saved.t - a.saved.t; });
  }
  function courseCard(entry) {
    var tut = entry.saved, c = entry.course, lessons = c ? c.lessons : [], count = lessons.length ? lessons.filter(function (l) { return state.progress.done[l.path]; }).length : tut.done;
    var total = lessons.length || tut.total, card = el('article', null, 'cnr-learning__card');
    card.appendChild(el('h3', c ? c.label : tut.label));
    card.appendChild(link(t('Continue: {title}', { title: tut.last.title }), tut.last.path, 'cnr-learning__primary-link'));
    card.appendChild(el('p', t('{n} of {total} pages read', { n: count, total: total }), 'cnr-learning__muted'));
    var bar = el('progress'); bar.max = total || 1; bar.value = count; bar.setAttribute('aria-label', t('{course} pages read', { course: c ? c.label : tut.label })); card.appendChild(bar);
    var next = lessons.find(function (l) { return !state.progress.done[l.path]; });
    if (next) card.appendChild(link(t('Suggested next: {title}', { title: next.title }), next.path));
    else if (lessons.length) card.appendChild(el('p', t('All pages marked read. Revisit an exercise to practice.')));
    card.appendChild(el('p', t('Last visited {date}', { date: date(tut.t) }), 'cnr-learning__muted'));
    return card;
  }
  function renderHome() {
    var root = document.querySelector('[data-continue]'); if (!root) return; if (!canView()) { root.hidden = true; return; }
    var recent = recentCourses().slice(0, 4); root.replaceChildren(); if (!recent.length) { root.hidden = true; return; }
    root.hidden = false; var container = el('div', null, 'container cnr-learning-home');
    var head = el('div', null, 'cnr-learning__section-head'); head.appendChild(el('h2', t('Continue learning'))); head.appendChild(link(t('Open your dashboard'), '/learn/')); container.appendChild(head);
    var grid = el('div', null, 'cnr-learning__grid'); recent.forEach(function (entry) { grid.appendChild(courseCard(entry)); }); container.appendChild(grid);
    container.appendChild(el('p', t('Reading progress is saved in this browser. Practice and check results are tracked separately.'), 'cnr-learning__muted'));
    var n = el('p', notice, 'cnr-learning__notice'); n.setAttribute('data-learning-notice', ''); n.hidden = !notice; container.appendChild(n); root.appendChild(container);
  }
  function lessonCard(p, item) {
    var card = el('article', null, 'cnr-learning__card'); var heading = el('h3'); heading.appendChild(link(item.title || p, p)); card.appendChild(heading); card.appendChild(badges(p)); return card;
  }
  var problemIndex = null, problemIndexPromise = null;
  function loadProblemIndex() {
    if (!problemIndexPromise) problemIndexPromise = fetch('/interview-index.json', { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error('unavailable'); return r.json(); })
      .then(function (value) { problemIndex = value && value.v === 1 && value.problems ? value : null; renderDashboard(); }).catch(function () { problemIndex = null; });
    return problemIndexPromise;
  }
  // Study plans (interview/plans): progress is derived from solved marks, so a plan "starts" with its first solve.
  var plansIndex = null, plansPromise = null;
  function loadPlans() {
    if (!plansPromise) plansPromise = fetch('/interview-plans.json', { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error('unavailable'); return r.json(); })
      .then(function (value) { plansIndex = value && value.v === 1 && Array.isArray(value.plans) ? value : null; renderDashboard(); }).catch(function () { plansIndex = null; });
    return plansPromise;
  }
  function renderPlans(root, solved) {
    var box = root.querySelector('[data-learning-plans]'); if (!box) return;
    box.replaceChildren();
    if (!solved.length) { box.appendChild(el('p', t('Pick a study plan and the problems you solve will be counted here.'))); return; }
    if (!plansIndex) { loadPlans(); box.appendChild(el('p', t('Loading plans…'), 'cnr-learning__muted')); return; }
    var solvedSet = {}; solved.forEach(function (item) { solvedSet[item.slug] = true; });
    var started = plansIndex.plans.map(function (plan) {
      var done = plan.problems.filter(function (p) { return solvedSet[p[0]]; }).length, next = null;
      for (var i = 0; i < plan.problems.length && !next; i++) if (!solvedSet[plan.problems[i][0]]) next = plan.problems[i];
      return { plan: plan, done: done, next: next, day: next ? Math.floor(plan.problems.indexOf(next) / plan.perDay) + 1 : plan.problems.length / plan.perDay };
    }).filter(function (item) { return item.done > 0; }).sort(function (a, b) { return b.done / b.plan.problems.length - a.done / a.plan.problems.length; });
    if (!started.length) { box.appendChild(el('p', t('None of your solved problems is in a study plan yet.'))); return; }
    var list = el('ul', null, 'cnr-learning__plans');
    started.slice(0, 5).forEach(function (item) {
      var li = el('li'), total = item.plan.problems.length;
      li.appendChild(link(item.plan.title, '/interview/plans/' + item.plan.slug + '/'));
      var bar = document.createElement('progress'); bar.max = total; bar.value = item.done; bar.className = 'cnr-learning__plan-bar'; bar.setAttribute('aria-label', t('{n} of {total} solved', { n: item.done, total: total })); li.appendChild(bar);
      li.appendChild(el('span', item.next ? t('{n} of {total} solved · Day {day} next: ', { n: item.done, total: total, day: item.day }) : t('{n} of {total} solved · complete', { n: item.done, total: total }), 'cnr-learning__muted'));
      if (item.next) li.appendChild(link(item.next[1] + '. ' + item.next[2], '/interview/plans/' + item.plan.slug + '/#day-' + item.day));
      list.appendChild(li);
    });
    box.appendChild(list);
  }
  function noteText(p) { p = path(p); var item = p && state.learning.lessons[p]; return item && item.note && typeof item.note.text === 'string' ? item.note.text : ''; }
  function renderSolved(root, solved) {
    var box = root.querySelector('[data-learning-solved]'), summary = root.querySelector('[data-learning-solved-summary]');
    if (!box) return;
    if (solved.length && !problemIndex) loadProblemIndex();
    box.replaceChildren();
    if (summary) {
      summary.replaceChildren();
      if (!solved.length) summary.textContent = t('Mark a problem as solved from its page or from any problem list, and it will be counted here.');
      else if (problemIndex) {
        var by = { Easy: 0, Medium: 0, Hard: 0 }, explained = 0;
        solved.forEach(function (item) { var meta = problemIndex.problems[item.slug]; if (meta) { by[meta[1]] = (by[meta[1]] || 0) + 1; if (meta[2]) explained++; } });
        var counts = { n: solved.length, total: problemIndex.counts.total, easy: by.Easy, medium: by.Medium, hard: by.Hard, explained: explained };
        summary.textContent = explained ? t('{n} of {total} LeetCode problems solved · Easy {easy} · Medium {medium} · Hard {hard} · {explained} with an explanation here.', counts) : t('{n} of {total} LeetCode problems solved · Easy {easy} · Medium {medium} · Hard {hard}.', counts);
      } else summary.textContent = solved.length === 1 ? t('{n} problem solved.', { n: 1 }) : t('{n} problems solved.', { n: solved.length });
    }
    if (!solved.length) return;
    var list = el('ul', null, 'cnr-learning__solved');
    solved.slice(0, 60).forEach(function (item) {
      var li = el('li'), meta = problemIndex && problemIndex.problems[item.slug];
      li.appendChild(link(item.title, meta && meta[2] ? item.path : 'https://leetcode.com/problems/' + item.slug + '/'));
      if (meta) { var d = el('span', difficulty(meta[1]), 'cnr-learning__badge is-recorded cnr-learning__badge--' + meta[1].toLowerCase()); li.appendChild(d); }
      li.appendChild(el('span', t('solved {date}', { date: date(item.solvedAt) }), 'cnr-learning__muted'));
      li.appendChild(button(t('Unmark'), function () { setSolved(item.path, false); }));
      list.appendChild(li);
    });
    box.appendChild(list);
    if (solved.length > 60) box.appendChild(el('p', t('Showing the 60 most recent of {n} solved problems.', { n: solved.length }), 'cnr-learning__muted'));
  }
  function renderDashboard() {
    var root = document.querySelector('[data-learning-dashboard]'); if (!root) return;
    root.querySelectorAll('[data-learning-personal]').forEach(function (node) { node.hidden = !canView(); });
    if (!canView()) return;
    var records = Object.keys(state.learning.lessons).filter(function (p) { return !isProblem(p); }), stats = root.querySelector('[data-learning-summary]'), solved = solvedProblems();
    if (stats) {
      stats.replaceChildren();
      // The interview tile only on dashboards that have an interview section (代码酷 has none).
      [[t('Pages read'), Object.keys(state.progress.done).length], [t('Lessons practiced'), records.filter(function (p) { return lessonStatus(p).practiced; }).length], [t('Lessons with a passed check'), records.filter(function (p) { return lessonStatus(p).passed; }).length]]
        .concat(root.querySelector('[data-learning-solved]') ? [[t('Interview problems solved'), solved.length]] : []).forEach(function (pair) {
        var card = el('div', null, 'cnr-learning__stat'); card.appendChild(el('strong', String(pair[1]))); card.appendChild(el('span', pair[0])); stats.appendChild(card);
      });
    }
    renderSolved(root, solved);
    renderPlans(root, solved);
    var recent = root.querySelector('[data-learning-courses]');
    if (recent) { recent.replaceChildren(); recentCourses().slice(0, 12).forEach(function (entry) { recent.appendChild(courseCard(entry)); }); if (!recent.children.length) { recent.appendChild(el('p', t('Your recent courses will appear here after you open a lesson.'))); } }
    var saved = root.querySelector('[data-learning-bookmarks]');
    if (saved) {
      saved.replaceChildren(); records.filter(function (p) { var b = state.learning.lessons[p].bookmark; return b && b.value; }).sort(function (a, b) { return state.learning.lessons[b].bookmark.updatedAt - state.learning.lessons[a].bookmark.updatedAt; }).forEach(function (p) {
        var item = state.learning.lessons[p], card = lessonCard(p, item); card.appendChild(button(t('Remove bookmark'), function () { bookmark(p, false); })); saved.appendChild(card);
      });
      if (!saved.children.length) saved.appendChild(el('p', t('Bookmark a lesson to keep it here.')));
    }
    var notes = root.querySelector('[data-learning-notes]');
    if (notes) {
      notes.replaceChildren(); Object.keys(state.learning.lessons).filter(function (p) { var item = state.learning.lessons[p]; return item.note && item.note.text || item.noteConflicts && item.noteConflicts.length; }).sort(function (a, b) { return (state.learning.lessons[b].note || {}).updatedAt - (state.learning.lessons[a].note || {}).updatedAt; }).forEach(function (p) {
        var item = state.learning.lessons[p], d = el('details', null, 'cnr-learning__note-card'); d.appendChild(el('summary', item.title)); d.appendChild(el('p', item.note ? item.note.text : '', 'cnr-learning__note-text')); if (item.noteConflicts) item.noteConflicts.forEach(function (n) { d.appendChild(el('p', t('Other saved version · {date}', { date: date(n.updatedAt) }), 'cnr-learning__muted')); d.appendChild(el('p', n.text, 'cnr-learning__note-text')); }); d.appendChild(link(t('Open lesson'), p)); notes.appendChild(d);
      });
      if (!notes.children.length) notes.appendChild(el('p', t('Save a note on any lesson. Notes stay private to this browser unless you export them.')));
    }
    var evidence = root.querySelector('[data-learning-practice]');
    if (evidence) {
      evidence.replaceChildren(); records.filter(function (p) { return lessonStatus(p).practiced; }).sort(function (a, b) { return state.learning.lessons[b].updatedAt - state.learning.lessons[a].updatedAt; }).slice(0, 20).forEach(function (p) {
        var item = state.learning.lessons[p], card = lessonCard(p, item), list = el('ul');
        Object.keys(item.practice).forEach(function (id) { var r = item.practice[id]; list.appendChild(el('li', t('{label}: {result} · {date}', { label: id === 'manual' ? t('Self-reported practice') : id, result: r.lastResult === 'passed' ? t('check passed') : r.lastResult === 'not-passed' ? t('latest check not passed') : t('practice recorded'), date: date(r.attemptedAt) }) + (r.passedAt && r.lastResult !== 'passed' ? t(' · an earlier check passed') : ''))); });
        card.appendChild(list); evidence.appendChild(card);
      });
      if (!evidence.children.length) evidence.appendChild(el('p', t('Practice records appear when you record practice or use a lesson playground. Running code does not automatically pass a check.')));
    }
    var drafts = root.querySelector('[data-learning-drafts]');
    if (drafts) { var count = Object.keys(state.playground.drafts).length; drafts.replaceChildren(el('p', count === 1 ? t('{n} playground draft saved in this browser.', { n: 1 }) : t('{n} playground drafts saved in this browser.', { n: count }))); drafts.appendChild(link(t('Open playground'), '/playground/')); }
    renderNotices();
  }
  function changed(before) {
    if (!initialised) return;
    renderTools(); renderSidebar(); renderHome(); renderDashboard(); renderNotices();
    window.dispatchEvent(new CustomEvent('cnr:learning-updated', { detail: { persistent: !volatile && !blocked, before: before || null } }));
  }
  function loadCatalog() {
    if (catalogPromise) return catalogPromise;
    var status = document.querySelector('[data-learning-catalog-status]'); if (status) status.textContent = t('Loading course order…');
    catalogPromise = fetch('/learning-catalog.json', { credentials: 'same-origin' }).then(function (response) { if (!response.ok) fail(t('Course list is unavailable.')); return response.json(); }).then(function (value) {
      if (!record(value) || value.v !== 1 || !Array.isArray(value.courses) || value.courses.length > 1000) fail(t('The course list format is unsupported.'));
      var clean = { byID: map(), byPath: map() };
      value.courses.forEach(function (c) {
        if (!record(c) || !courseID(c.id) || !docURL(c.url, true) || !Array.isArray(c.lessons) || c.lessons.length > 20000) fail(t('The course list contains an invalid entry.'));
        var entry = { id: c.id, label: text(c.label, 240, t('Course title')), url: docURL(c.url, true), lessons: [] }, seen = map();
        c.lessons.forEach(function (l) { var p = l && path(l.path); if (!p) fail(t('Invalid catalog lesson.')); if (!seen[p]) { seen[p] = true; var lesson = { path: p, title: text(l.title, 300, t('Lesson title')), course: c.id }; entry.lessons.push(lesson); clean.byPath[p] = lesson; } }); clean.byID[c.id] = entry;
      });
      catalog = clean; if (status) status.textContent = ''; renderDashboard(); renderTools(); return clean;
    }).catch(function () { if (status) status.textContent = t('Course order is unavailable right now. Your saved lessons and notes still work; reload to retry suggestions.'); return null; });
    return catalogPromise;
  }
  function bindTools() {
    if (!currentPage) return;
    document.querySelectorAll('[data-mark-done]').forEach(function (b) { b.addEventListener('click', function () { setRead(currentPage.path, !state.progress.done[currentPage.path]); }); });
    document.querySelectorAll('[data-learning-tools]').forEach(function (root) {
      var b = root.querySelector('[data-learning-bookmark]'); if (b) b.addEventListener('click', function () { var item = state.learning.lessons[currentPage.path]; bookmark(currentPage.path, !(item && item.bookmark && item.bookmark.value)); });
      var practiceButton = root.querySelector('[data-learning-practiced]'); if (practiceButton) practiceButton.addEventListener('click', function () { practice({ path: currentPage.path, exerciseId: 'manual' }); });
      var field = root.querySelector('[data-learning-note]'), status = root.querySelector('[data-learning-note-status]');
      if (field) field.addEventListener('input', function () { noteDirty = field.value !== noteBaseline; noteEditAt = Date.now(); if (status) status.textContent = noteDirty ? t('Unsaved note. Choose Save note to keep it.') : ''; });
      var save = root.querySelector('[data-learning-save-note]'); if (save) save.addEventListener('click', async function () {
        var savingOwner = window.CNRLearningSync && window.CNRLearningSync.getOwner(), submittedText = field.value;
        try { var ok = await saveNote(currentPage.path, submittedText); if (window.CNRLearningSync && window.CNRLearningSync.getOwner() !== savingOwner) return; if (field.value !== submittedText) { noteDirty = true; if (ok) noteBaseline = submittedText; renderTools(); if (status) status.textContent = ok ? t('Earlier text saved. Your newer edits are still in the editor.') : t('Your edits are still here; see the storage message above.'); return; } if (ok) { noteDirty = false; noteBaseline = field.value; } else { noteDirty = true; var held = state.learning.lessons[currentPage.path]; if (held && held.note && held.note.text === field.value) noteBaseline = field.value; } renderTools(); if (status) status.textContent = ok ? t('Note saved in this browser.') : t('Your note could not be saved. Your text is still here; see the storage message above before leaving.'); }
        catch (error) { if (status) status.textContent = error.message; }
      });
      var reload = root.querySelector('[data-learning-reload-note]'); if (reload) reload.addEventListener('click', function () { noteDirty = false; renderTools(); if (status) status.textContent = t('Loaded the saved note.'); });
    });
  }
  function bindBackup() {
    document.querySelectorAll('[data-learning-export]').forEach(function (exporting) {
      exporting.addEventListener('click', function () {
        var scope = exporting.closest('[data-learning-tools], [data-learning-dashboard]'), status = scope.querySelector('[data-learning-backup-status]');
        try {
          var data = exportBackup(), blob = new Blob([data], { type: 'application/json' }), url = URL.createObjectURL(blob), a = el('a');
          a.href = url; a.download = 'cnr-learning-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
          var field = scope.querySelector('[data-learning-note]'), item = currentPage && state.learning.lessons[currentPage.path];
          var omittedEdit = field && field.value !== (item && item.note ? item.note.text : '');
          status.textContent = t('Backup download started. Keep the file somewhere you can find it; it contains your notes and code.') + (omittedEdit ? t(' The current note has unsaved edits that are not in this backup; save or copy that text separately.') : '');
        } catch (error) { status.textContent = error.message; }
      });
    });
    var root = document.querySelector('[data-learning-dashboard]'); if (!root) return;
    var status = root.querySelector('[data-learning-backup-status]'), input = root.querySelector('[data-learning-import-file]'), preview = root.querySelector('[data-learning-import-preview]');
    var mergeButton = root.querySelector('[data-learning-import-apply]'), cancel = root.querySelector('[data-learning-import-cancel]'), fileTicket = 0, previewToken = null;
    function clearPreview() { fileTicket++; pending = null; preview.hidden = true; mergeButton.disabled = true; input.value = ''; }
    input.addEventListener('change', function () {
      var ticket = ++fileTicket; pending = null; preview.hidden = true; mergeButton.disabled = true; var file = input.files && input.files[0]; if (!file) return;
      if (file.size > MAX_BACKUP) { status.textContent = t('Choose a JSON backup no larger than 6 MB.'); return; }
      status.textContent = t('Checking backup…');
      file.text().then(function (raw) {
        if (ticket !== fileTicket) return;
        var summary = prepareImport(raw); previewToken = summary.previewToken; var counts = root.querySelector('[data-learning-import-counts]'); counts.replaceChildren();
        counts.appendChild(el('p', t('{read} read marks · {bookmarks} bookmarks · {notes} notes · {practice} exercise records · {drafts} drafts', summary)));
        counts.appendChild(el('p', t('Merge keeps existing read marks. The newest bookmark choice wins. Different notes are kept together; conflicting code drafts are added as separate copies.')));
        counts.appendChild(el('p', t('{noteConflicts} different notes will be appended; {draftCopies} draft copies will be added.', summary)));
        preview.hidden = false; mergeButton.disabled = false; status.textContent = t('Backup validated. Review the preview, then choose Merge backup. Nothing has changed yet.');
      }).catch(function (error) { if (ticket === fileTicket) status.textContent = t('Backup not imported: {error}', { error: error.message }); });
    });
    mergeButton.addEventListener('click', async function () { try { await applyImport(previewToken); clearPreview(); status.textContent = t('Backup merged. Your existing read marks, notes, and drafts were preserved.'); } catch (error) { clearPreview(); status.textContent = error.message; } });
    cancel.addEventListener('click', function () { clearPreview(); status.textContent = t('Import cancelled. No saved data changed.'); });
  }
  function init() {
    state = empty();
    try { recoverJournal(); state = readAll(); }
    catch (error) { storageError(error, !(error && error.name === 'SecurityError')); }
    bindTools(); bindBackup(); visit(); initialised = true; changed();
    if (document.querySelector('[data-learning-dashboard]')) loadCatalog();
  }
  window.addEventListener('cnr:practice', function (event) { try { practice(event.detail); } catch (error) { notice = t('Practice could not be saved: {error}', { error: error.message }); renderNotices(); } });
  window.addEventListener('storage', function (event) {
    if (event.key !== null && Object.values(KEYS).indexOf(event.key) < 0 && event.key !== JOURNAL) return;
    if (!canWrite()) return;
    if (volatile || blocked) { notice = t('Another tab changed saved learning data. Your unsaved changes are still in this tab; export them before reloading.'); renderNotices(); return; }
    try {
      if (localStorage.getItem(JOURNAL)) return; // Wait for the import's commit/rollback event.
      state = readAll();
      if (pending) { pending = null; var b = document.querySelector('[data-learning-import-apply]'); if (b) b.disabled = true; var status = document.querySelector('[data-learning-backup-status]'); if (status) status.textContent = t('Saved data changed in another tab. Choose the file again to preview an updated merge.'); }
      changed();
    } catch (error) { storageError(error, true); }
  });
  window.addEventListener('beforeunload', function (event) { if (noteDirty || volatile) { event.preventDefault(); event.returnValue = ''; } });
  function captureSnapshot(includeEditor) {
    if (blocked) fail(t('Saved learning data needs recovery before it can be moved safely.'));
    var current = clone(state);
    if (includeEditor && noteDirty && currentPage) {
      var field = document.querySelector('[data-learning-note]');
      if (field) { var item = ensureLesson(current, currentPage.path, currentPage); if (item.note && item.note.text && item.note.text !== noteBaseline && item.note.text !== field.value) { item.noteConflicts = item.noteConflicts || []; if (!item.noteConflicts.some(function (n) { return n.text === item.note.text; })) item.noteConflicts.push(clone(item.note)); } item.note = { text: field.value, updatedAt: noteEditAt || Date.now() }; item.updatedAt = item.note.updatedAt; }
    }
    if (includeEditor && window.CNRPlayground && window.CNRPlayground.captureDrafts) current.playground = window.CNRPlayground.captureDrafts(current.playground);
    Object.keys(KEYS).forEach(function (name) { current[name] = checkSize(validators[name](current[name]), name); });
    return { format: 'cnr-learning-backup', version: 1, exportedAt: new Date().toISOString(), progress: current.progress, learning: current.learning, playground: current.playground };
  }
  // Called by the sync coordinator only after its IndexedDB recovery record is durable.
  function replaceSnapshot(backup, options) {
    var clean = validateBackup(typeof backup === 'string' ? backup : JSON.stringify(backup), true), old = {}, written = [];
    try {
      Object.keys(KEYS).forEach(function (name) { old[name] = localStorage.getItem(KEYS[name]); });
      Object.keys(KEYS).forEach(function (name) { localStorage.setItem(KEYS[name], JSON.stringify(clean[name])); written.push(name); });
    } catch (error) {
      try { written.forEach(function (name) { localStorage.removeItem(KEYS[name]); }); written.forEach(function (name) { if (old[name] !== null) localStorage.setItem(KEYS[name], old[name]); }); } catch (_) {}
      throw error;
    }
    state = clean; volatile = false; blocked = false; volatileKeys = map(); pending = null; notice = '';
    if (options && options.ownerChange) { noteDirty = false; noteBaseline = ''; noteEditAt = 0; }
    else if (noteDirty && currentPage) { var field = document.querySelector('[data-learning-note]'), saved = state.learning.lessons[currentPage.path]; if (field && saved && saved.note && saved.note.text === field.value) { noteDirty = false; noteBaseline = field.value; noteEditAt = 0; } }
    updateCounts(state); changed(); return true;
  }
  window.CNRLearning = Object.freeze({
    getSnapshot: function () { return clone(state); }, canWrite: canWrite, canView: canView, setWriteGuard: function (guard, display) { writeGuard = guard; displayGuard = display || guard; changed(); }, captureSnapshot: captureSnapshot, replaceSnapshot: replaceSnapshot, recordVisit: visit, readDiskSnapshot: function () { var data = readAll(); return { format: 'cnr-learning-backup', version: 1, exportedAt: new Date().toISOString(), progress: data.progress, learning: data.learning, playground: data.playground }; }, refreshState: function () { if (canWrite()) { state = readAll(); changed(); } }, setRead: setRead, setBookmark: bookmark, saveNote: saveNote, recordPractice: practice, setSolved: setSolved, solvedAt: solvedAt, solvedProblems: solvedProblems,
    saveNote: saveNote, noteText: noteText,
    exportBackup: exportBackup, validateBackup: function (raw) { return clone(validateBackup(raw, true)); }, prepareImport: prepareImport, applyImport: applyImport, loadCatalog: loadCatalog,
    limits: Object.freeze({ backupBytes: MAX_BACKUP, storeBytes: MAX_STORE, noteCharacters: MAX_NOTE })
  });
  init();
})();
