/* Smoke test for Ask AI, "开始测验" and the "这个页面有帮助吗？" votes on 代码酷, with the Worker and Turnstile mocked.
 * Build first (hugo/scripts/build.sh), then:
 *   node --test tests/askai.spec.mjs
 * Playwright comes from CNR_PLAYWRIGHT_MODULE, or the Compile-N-Run checkout next to this repo. Every other
 * third-party URL is blocked, so the marked/DOMPurify CDN load fails and the built-in fallback renderer is used. */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'hugo/public');
const playwrightModule = process.env.CNR_PLAYWRIGHT_MODULE ||
  path.resolve(root, '../Compile-N-Run/tests/content-quality/node_modules/playwright/index.mjs');
const { chromium } = await import(playwrightModule);

const LESSON = '/docs/language/python/python-functional-programming/python-functional-programming-overview/';
const ZH_LESSON = '/docs/framework/wechatminiprogram/applet-login-and-authorization/实名认证/';

let server, browser, origin;
const freePort = () => new Promise((resolve, reject) => {
  const s = net.createServer(); s.unref(); s.on('error', reject);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); });
});
before(async () => {
  assert.ok(existsSync(path.join(publicDir, LESSON, 'index.html')), 'build the site first: hugo/scripts/build.sh');
  const port = await freePort();
  server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', publicDir], { stdio: 'ignore' });
  origin = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(origin + LESSON)).ok) break; } catch (_) {}
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({ headless: true });
});
after(async () => { await browser?.close(); server?.kill(); });

const QUESTION = {
  question: '下面的代码输出什么？',
  code: 'print(list(map(lambda x: x * 2, [1, 2])))',
  options: ['[1, 2]', '[2, 4]', '[1, 4]', '报错'],
  answer: 1,
  explanation: '`map` 把函数应用到每个元素上。'
};

async function open(t, url) {
  const context = await browser.newContext({ locale: 'zh-CN' });
  t.after(() => context.close());
  const calls = { feedback: [], ask: [], quiz: [], blocked: [] };
  // Routes registered later win: block everything third-party first, then add the fakes.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => { calls.blocked.push(route.request().url()); route.abort(); });
  await context.route('https://challenges.cloudflare.com/**', route => {
    const onload = new URL(route.request().url()).searchParams.get('onload');
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.turnstile = { render(el, opts) { setTimeout(() => opts.callback('test-token'), 10); return 'w1'; }, reset() {}, remove() {} };
             ${onload ? `window[${JSON.stringify(onload)}]();` : ''}`
    });
  });
  await context.route('**/api/**', route => route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"authentication_required"}' }));
  await context.route('**/api/auth/session', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ configured: true, providers: { google: true, github: true, email: false }, user: null }) }));
  await context.route('**/api/feedback', route => { calls.feedback.push(route.request().postDataJSON()); route.fulfill({ contentType: 'application/json', body: '{"ok":true}' }); });
  await context.route('**/api/ask', route => {
    calls.ask.push(route.request().postDataJSON());
    const chunk = s => `data: ${JSON.stringify({ choices: [{ delta: { content: s } }] })}\n\n`;
    route.fulfill({ contentType: 'text/event-stream', body: chunk('函数式编程把**函数**当作一等公民。\n\n') + chunk('- 使用 `map`\n- 使用 `filter`\n') + 'data: [DONE]\n\n' });
  });
  await context.route('**/api/quiz', route => {
    calls.quiz.push(route.request().postDataJSON());
    route.fulfill({ contentType: 'application/x-ndjson', body: JSON.stringify({ question: QUESTION }) + '\n' + JSON.stringify({ done: true, count: 1 }) + '\n' });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(origin + encodeURI(url), { waitUntil: 'domcontentloaded' });
  return { page, errors, calls };
}

test('the vote buttons send {path, vote}, thank the reader in Chinese, and 👎 opens the comment form', async t => {
  const { page, errors, calls } = await open(t, LESSON);
  const learn = page.locator('.cnr-learn[data-learn]');
  await learn.waitFor({ state: 'visible' });
  assert.match(await learn.locator('.cnr-learn__vote > span').textContent(), /这个页面有帮助吗？/);
  assert.equal(await learn.locator('[data-mark-done]').count(), 0, 'the read mark belongs to learning-tools');
  await learn.locator('[data-vote="1"]').click();
  await page.waitForFunction(() => /感谢你的反馈/.test(document.querySelector('[data-vote-thanks]').textContent));
  assert.deepEqual(calls.feedback[0], { path: LESSON, vote: 1 });
  assert.equal(await learn.locator('[data-vote="1"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await learn.locator('[data-vote-comment]').isVisible(), false);

  await learn.locator('[data-vote="-1"]').click();
  const form = learn.locator('[data-vote-comment]');
  await form.waitFor({ state: 'visible' });
  assert.match(await form.locator('label').textContent(), /选填/);
  await form.locator('textarea').fill('第二个例子缺少输出。');
  await form.locator('button[type=submit]').click();
  await form.waitFor({ state: 'hidden' });
  assert.deepEqual(calls.feedback.slice(1), [{ path: LESSON, vote: -1 }, { path: LESSON, vote: -1, comment: '第二个例子缺少输出。' }]);
  assert.match(await learn.locator('[data-vote-thanks]').textContent(), /感谢你的反馈/);
  assert.deepEqual(errors, []);
});

test('a Chinese lesson URL is sent percent-encoded, as the Worker expects', async t => {
  const { page, errors, calls } = await open(t, ZH_LESSON);
  await page.locator('[data-learn] [data-vote="1"]').click();
  await page.waitForFunction(() => !document.querySelector('[data-vote-thanks]').hidden);
  assert.deepEqual(calls.feedback, [{ path: encodeURI(ZH_LESSON), vote: 1 }]);
  assert.deepEqual(errors, []);
});

test('问一问 AI opens the panel, posts {path, question, history, turnstile} and renders the streamed answer', async t => {
  const { page, errors, calls } = await open(t, LESSON);
  const btn = page.locator('.cnr-ask-btn');
  await btn.waitFor({ state: 'visible' });
  assert.equal((await btn.textContent()).trim(), '问一问 AI');
  await btn.click();
  const panel = page.locator('.cnr-ask[role=dialog]');
  await panel.waitFor({ state: 'visible' });
  assert.match(await panel.locator('.cnr-ask__title').textContent(), /AI 助手.*关于本页提问/);
  assert.match(await panel.locator('.cnr-ask__intro').textContent(), /你好！关于Python 函数式编程概述/);
  await panel.locator('textarea').fill('什么是函数式编程？');
  await panel.locator('.cnr-ask__send').click();
  const answer = panel.locator('.cnr-ask__msg--ai');
  await answer.locator('li').nth(1).waitFor();
  assert.deepEqual(calls.ask, [{ path: LESSON, question: '什么是函数式编程？', history: [], turnstile: 'test-token' }]);
  assert.equal(await answer.locator('strong').textContent(), '函数');
  assert.equal(await answer.locator('li code').first().textContent(), 'map');
  // The CDN copies of marked/DOMPurify were blocked, so this is the fallback renderer.
  assert.ok(calls.blocked.some(u => u.includes('cdn.jsdelivr.net/npm/marked')), 'marked was requested and blocked');
  assert.equal(await page.evaluate(() => typeof window.marked), 'undefined');
  assert.deepEqual(errors, []);
});

test('开始测验 shows a question and picking the right option shows 正确', async t => {
  const { page, errors, calls } = await open(t, LESSON);
  const start = page.locator('.cnr-learn [data-quiz]');
  await start.waitFor({ state: 'visible' });
  assert.match(await start.textContent(), /开始测验/);
  await start.click();
  const q = page.locator('.cnr-ask .cnr-quiz');
  await q.waitFor();
  assert.equal(await q.locator('.cnr-quiz__q').textContent(), QUESTION.question);
  assert.equal(await q.locator('.cnr-quiz__count').textContent(), '第 1 题，共 1 题');
  assert.equal(calls.quiz.length, 1);
  assert.deepEqual(calls.quiz[0], { path: LESSON, round: 0, turnstile: 'test-token', stream: true });
  await q.locator('.cnr-quiz__opt[data-k="1"]').click();
  assert.match(await q.locator('.cnr-quiz__result').textContent(), /✅ 正确！/);
  assert.equal(await q.locator('.cnr-quiz__next').textContent(), '查看得分');
  await q.locator('.cnr-quiz__next').click();
  await page.locator('.cnr-quiz--done').waitFor();
  assert.match(await page.locator('.cnr-quiz__score').textContent(), /1 \/ 1/);
  assert.match(await page.locator('.cnr-quiz--done').textContent(), /满分/);
  assert.deepEqual(errors, []);
});
