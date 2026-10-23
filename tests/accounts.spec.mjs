/* Smoke test for the reader-account features on 代码酷 (sign-in popup, learning tools, /learn/, /profile/).
 * Build first (hugo/scripts/build.sh), then:
 *   node --test tests/accounts.spec.mjs
 * Playwright comes from CNR_PLAYWRIGHT_MODULE, or the Compile-N-Run checkout next to this repo. */
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
const QR_TICKET = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQTicket'; // aborted below like every third-party URL; only the src matters
const session = { configured: true, providers: { google: true, github: true, email: false }, user: null };

let server, browser, origin;
const freePort = () => new Promise((resolve, reject) => {
  const s = net.createServer(); s.unref(); s.on('error', reject);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); });
});
before(async () => {
  assert.ok(existsSync(path.join(publicDir, 'learn/index.html')), 'build the site first: hugo/scripts/build.sh');
  const port = await freePort();
  server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', publicDir], { stdio: 'ignore' });
  origin = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(origin + '/learn/')).ok) break; } catch (_) {}
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({ headless: true });
});
after(async () => { await browser?.close(); server?.kill(); });

async function open(t, url, reply = session) {
  const context = await browser.newContext({ locale: 'zh-CN' });
  t.after(() => context.close());
  const sessionCalls = [];
  // No third-party scripts (ads, analytics, Google Identity Services) in a local smoke test.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  await context.route('**/api/auth/session', route => { sessionCalls.push(route.request().url()); route.fulfill({ contentType: 'application/json', body: JSON.stringify(reply) }); });
  await context.route('**/api/**', route => {
    const url = route.request().url();
    if (url.includes('/api/auth/session')) return route.fallback();
    if (url.includes('/api/auth/wechat/start')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ code: '483921', expiresAt: Date.now() + 300000, mode: 'scan', qr: QR_TICKET }) });
    if (url.includes('/api/auth/wechat/status')) return route.fulfill({ contentType: 'application/json', body: '{"status":"pending"}' });
    return route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"authentication_required"}' });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(origin + encodeURI(url), { waitUntil: 'domcontentloaded' });
  return { page, errors, sessionCalls };
}

test('the navbar shows 登录 and the popup offers Google and GitHub without an email form', async t => {
  const { page, errors, sessionCalls } = await open(t, LESSON);
  const signin = page.locator('.navbar [data-auth-open]');
  await signin.waitFor({ state: 'visible' });
  assert.equal((await signin.textContent()).trim(), '登录');
  await signin.click();
  const dialog = page.locator('dialog[data-auth-dialog]');
  await dialog.waitFor({ state: 'visible' });
  await page.locator('[data-auth-google]').waitFor({ state: 'visible' });
  await page.locator('[data-auth-github]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-auth-google]').textContent(), /使用 Google 继续/);
  assert.match(await page.locator('[data-auth-github]').textContent(), /使用 GitHub 继续/);
  assert.equal(await page.locator('[data-auth-email]').isVisible(), false, 'email form must stay hidden');
  assert.equal(await page.locator('[data-auth-form="login"] input[type=password]').isVisible(), false);
  assert.ok(sessionCalls.length >= 1, 'the popup asks the Worker for the session');
  assert.match(await page.locator('#cnr-auth-title').textContent(), /登录/);
  assert.deepEqual(errors, []);
});

test('a doc page shows the learning tools; 标记为已读 adds the sidebar check mark', async t => {
  const { page, errors } = await open(t, LESSON);
  const tools = page.locator('[data-learning-tools]');
  await tools.waitFor({ state: 'visible' });
  const mark = tools.locator('[data-mark-done]');
  assert.equal((await mark.textContent()).trim(), '标记为已读');
  assert.match(await tools.locator('[data-learning-bookmark]').textContent(), /书签/);
  const link = page.locator(`.theme-doc-sidebar-container .theme-doc-sidebar-item-link > a.menu__link[href="${LESSON}"]`);
  assert.equal(await link.locator('.cnr-check').count(), 0);
  await mark.click();
  await link.locator('.cnr-check').waitFor();
  assert.equal(await mark.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(errors, []);
});

test('a lesson with a Chinese URL can be marked as read too', async t => {
  const { page, errors } = await open(t, ZH_LESSON);
  const mark = page.locator('[data-learning-tools] [data-mark-done]');
  await mark.waitFor({ state: 'visible' });
  await mark.click();
  await page.waitForFunction(() => document.querySelector('[data-learning-tools] [data-mark-done]').getAttribute('aria-pressed') === 'true');
  await page.locator('.theme-doc-sidebar-container .cnr-check').first().waitFor();
  assert.deepEqual(errors, []);
});

test('/learn/ renders the dashboard in Chinese with the course catalog', async t => {
  const { page, errors } = await open(t, LESSON);
  await page.locator('[data-learning-tools] [data-mark-done]').click();
  await page.locator('.cnr-check').first().waitFor();
  await page.goto(origin + '/learn/', { waitUntil: 'domcontentloaded' });
  assert.match(await page.title(), /^我的学习 \| 代码酷$/);
  // The course read above shows up, which needs /learning-catalog.json to load and validate.
  await page.locator('[data-learning-courses]').getByText('Python').first().waitFor();
  assert.equal(await page.locator('[data-learning-catalog-status]').textContent(), '');
  for (const heading of ['我的学习', '继续学习', '书签', '我的笔记', '学习计划', '练习与检查', '保留一份备份'])
    assert.ok(await page.getByRole('heading', { name: heading, exact: true }).count() >= 1, heading);
  await page.locator('[data-learning-export]').first().waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-learning-export]').first().textContent(), /下载学习备份/);
  assert.deepEqual(errors, []);
});

test('/profile/ renders for a guest', async t => {
  const { page, errors } = await open(t, '/profile/');
  assert.match(await page.title(), /^个人资料 \| 代码酷$/);
  await page.locator('[data-profile-guest]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-profile-guest] h2').textContent(), /你还没有登录/);
  assert.equal(await page.locator('[data-profile-member]').isVisible(), false);
  assert.equal(await page.locator('meta[name=referrer]').getAttribute('content'), 'no-referrer');
  assert.deepEqual(errors, []);
});

test('the popup opens straight on 微信扫码登录: the per-login QR code, no code to send, other methods kept below', async t => {
  const { page, errors } = await open(t, LESSON, { ...session, providers: { ...session.providers, wechat: true } });
  await page.locator('.navbar [data-auth-open]').click();
  await page.locator('[data-auth-wechat-panel]').waitFor({ state: 'visible' }); // no click needed: WeChat is the default view
  const qr = page.locator('[data-auth-wechat-qr]');
  assert.equal(await qr.isVisible(), true);
  await page.waitForFunction(ticket => document.querySelector('[data-auth-wechat-qr]').getAttribute('src') === ticket, QR_TICKET);
  assert.equal(await page.locator('[data-auth-wechat-code]').isVisible(), false, 'no code to send in scan mode');
  assert.equal(await page.locator('[data-auth-wechat-code]').textContent(), '');
  assert.equal(await page.locator('[data-auth-wechat-steps="scan"]').isVisible(), true);
  assert.equal(await page.locator('[data-auth-wechat-steps="code"]').isVisible(), false);
  assert.match(await page.locator('[data-auth-wechat-steps="scan"]').textContent(), /关注公众号后自动登录/);
  assert.equal(await page.locator('#cnr-auth-title').textContent(), '登录');
  assert.match(await page.locator('[data-auth-wechat-expires]').textContent(), /^二维码将在 \d+:\d\d 后过期$/);
  assert.equal(await page.locator('[data-auth-wechat-status]').textContent(), '等待你扫码…');
  assert.equal(await page.locator('[data-auth-wechat]').isVisible(), false, 'no separate WeChat button when the panel is the form');
  assert.equal(await page.locator('[data-auth-wechat-back]').isVisible(), false, 'nothing to go back to');
  assert.equal(await page.locator('[data-auth-wechat-others]').isVisible(), true);
  assert.equal((await page.locator('[data-auth-wechat-others]').textContent()).trim(), '或使用其他方式登录');
  assert.equal(await page.locator('[data-auth-github]').isVisible(), true, 'GitHub stays available below the QR code');
  const panelBox = await page.locator('[data-auth-wechat-panel]').boundingBox(), githubBox = await page.locator('[data-auth-github]').boundingBox();
  assert.ok(panelBox.y < githubBox.y, 'the QR code comes first');
  assert.deepEqual(errors, []);
});
