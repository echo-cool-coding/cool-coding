/* Shared account discovery and a small native-dialog sign-in UI.
 * Session details and passwords remain in memory. Learning ownership is handled
 * by learning-sync.js through the awaited cnr:auth-changed transition event. */
(function () {
  'use strict';
  if (window.CNRAuth) return;
  // UI language follows <html lang>: English by default, Simplified Chinese on zh pages (the sister site copies this file).
  const ZH = {
    'A newer account action replaced this connection check.': '新的账户操作已取代本次连接检查。',
    'Checking sign-in options…': '正在检查登录方式…',
    'Code expires in {time}': '验证码将在 {time} 后过期',
    'Could not connect to sign-in. Check your connection and try again.': '无法连接登录服务。请检查网络后重试。',
    'Create a free account to keep your progress, bookmarks and solved problems on every device. You can keep learning without one.': '注册免费账户，即可在所有设备上保留学习进度、书签和已解决的题目。不注册也可以继续学习。',
    'Create an account': '注册账户',
    'Email or password was not accepted. If you just registered, verify your email first.': '邮箱或密码不正确。如果刚刚注册，请先验证邮箱。',
    'Enter a valid email address.': '请输入有效的邮箱地址。',
    'Get a new QR code': '刷新二维码',
    'Getting a sign-in code…': '正在获取验证码…',
    'Google sign-in could not be verified. Please try again.': '无法验证 Google 登录。请重试。',
    'Google sign-in did not load.': 'Google 登录未能加载。',
    'If this address can be registered, a verification email will arrive shortly. Verify it before signing in.': '如果该邮箱可以注册，验证邮件将很快送达。请先完成验证再登录。',
    'If this address has an eligible account, a password reset email will arrive shortly.': '如果该邮箱有对应的账户，密码重置邮件将很快送达。',
    'If this address needs verification, a verification email will arrive shortly.': '如果该邮箱需要验证，验证邮件将很快送达。',
    'Learner': '学习者',
    'Learning needs attention': '学习记录需要处理',
    'Link WeChat': '关联微信',
    'Open account menu for {name}': '打开 {name} 的账户菜单',
    'Opening GitHub sign-in…': '正在打开 GitHub 登录…',
    'Opening Google sign-in…': '正在打开 Google 登录…',
    'Please wait a little before trying again.': '请稍候再试。',
    'Please wait for the current account request.': '请等待当前账户请求完成。',
    'QR code expires in {time}': '二维码将在 {time} 后过期',
    'Reconnect': '重新连接',
    'Reconnect to confirm the current account before signing out.': '请先重新连接以确认当前账户，再退出登录。',
    'Reconnecting…': '正在重新连接…',
    'Reset your password': '重置密码',
    'Saved on this device. Sign in to keep your progress on every device, or close this to keep going as a guest.': '已保存在本设备。登录后可在所有设备上保留学习进度；也可以关闭此窗口，继续以访客身份学习。',
    'Scan the QR code with WeChat to follow the account, then send this code in the chat:': '用微信扫码关注公众号，然后在对话框发送这个验证码：',
    'Sending your request…': '正在发送请求…',
    'Sign in': '登录',
    'Sign in with WeChat': '微信扫码登录',
    'Sign-in could not be confirmed. Please try again.': '无法确认登录状态。请重试。',
    'Sign-in details could not be verified. Please try again.': '无法验证登录信息。请重试。',
    'Sign-in is busy right now. Please try again in a moment.': '登录服务繁忙，请稍后重试。',
    'Sign-in is unavailable right now. Please try again later.': '登录服务暂不可用，请稍后重试。',
    'Sign-in is unavailable right now. You can keep learning on this device.': '登录服务暂不可用。你可以继续在本设备上学习。',
    'Sign-out could not be confirmed. Please try again.': '无法确认退出登录。请重试。',
    'Signed in with WeChat.': '已通过微信登录。',
    'Signing in with Google…': '正在使用 Google 登录…',
    'Signing in…': '正在登录…',
    'Signing out…': '正在退出登录…',
    'The account response was too large. Please try again.': '账户服务的响应过大。请重试。',
    'The account service returned an empty response.': '账户服务返回了空响应。',
    'The account service returned an unreadable response. Please try again.': '账户服务返回了无法读取的响应。请重试。',
    'The sign-in response could not be verified. Please try again.': '无法验证登录响应。请重试。',
    'The signed-in account changed before progress could be saved. Review the current account before trying again.': '在保存进度之前，已登录的账户发生了变化。请先确认当前账户再重试。',
    'The signed-in account changed. Review the current account before trying again.': '已登录的账户发生了变化。请先确认当前账户再重试。',
    'The WeChat code could not be verified. Please try again.': '无法验证微信验证码。请重试。',
    'This code has expired.': '验证码已过期。',
    'This QR code has expired.': '二维码已过期。',
    'This WeChat account is already linked to another account.': '这个微信已关联到另一个账户。',
    'Use a display name of 1–100 characters.': '显示名称需为 1–100 个字符。',
    'Use a password with 15–128 characters. Spaces are kept.': '密码需为 15–128 个字符，空格会被保留。',
    'Verify your email': '验证邮箱',
    'Waiting for your message…': '等待你在微信中发送验证码…',
    'Waiting for your scan…': '等待你扫码…',
    'WeChat account linked.': '已关联微信。',
    'Your latest progress could not be synced. You are still signed in; retry before signing out.': '最新进度未能同步。你仍处于登录状态，请重试同步后再退出登录。',
    'Your learning could not be kept safely before this account change. Try connecting again, then retry.': '切换账户前未能安全保留你的学习记录。请重新连接后再试。',
    'Your learning could not finish switching. Try connecting again before continuing.': '学习记录未能完成切换。请重新连接后再继续。',
    'Your learning needs attention. Retry the connection before editing.': '你的学习记录需要处理。请重试连接后再编辑。',
    'Your sign-in changed. Refresh the connection and try again.': '登录状态已变化。请刷新连接后重试。',
    'Your sign-in has ended. Please sign in again.': '登录已过期，请重新登录。',
  };
  const isZh = /^zh/i.test(document.documentElement.lang);
  function t(text, vars) { let out = isZh && ZH[text] !== undefined ? ZH[text] : text; if (vars) Object.keys(vars).forEach(k => { out = out.split('{' + k + '}').join(String(vars[k])); }); return out; }
  const widget = document.querySelector('[data-auth-widget]');
  const dialog = document.querySelector('[data-auth-dialog]');
  const menu = widget?.querySelector('[data-auth-menu]');
  const avatar = widget?.querySelector('[data-auth-avatar]');
  const openButton = widget?.querySelector('[data-auth-open]');
  const menuStatus = widget?.querySelector('[data-auth-menu-status]');
  const message = dialog?.querySelector('[data-auth-message]');
  const forms = dialog ? Array.from(dialog.querySelectorAll('[data-auth-form]')) : [];
  const wechatButton = dialog?.querySelector('[data-auth-wechat]'), wechatPanel = dialog?.querySelector('[data-auth-wechat-panel]');
  let wechatOpen = false, wechatLink = false;
  // data-auth-default="wechat" on the dialog (代码酷): the login form opens straight on the WeChat QR code and
  // the other sign-in methods stay available below it.
  const wechatDefault = dialog?.dataset.authDefault === 'wechat';
  const wechatSolo = () => wechatOpen && !(wechatDefault && !wechatLink); // the panel replaces the other methods
  const titles = { login: t('Sign in'), register: t('Create an account'), forgot: t('Reset your password'), resend: t('Verify your email') };
  let current = null, known = false, published = false, transitionFailed = false, actionPending = false, capabilities = { google: false, github: false, email: false, wechat: false };
  let inFlight = null, refreshController = null, initial = null, mutation = null, answered = false; // answered: a real server answer was validated
  let lastAttempt = 0, requestEpoch = 0, stateEpoch = 0, transition = Promise.resolve(), transitioning = false;
  let syncNotice = '', busy = false, mode = 'login', returnFocus = null, focusAvatarOnClose = false;
  const clone = value => value === null ? null : JSON.parse(JSON.stringify(value));
  // The Worker sets a readable cnr_signed_in=1 cookie next to the HttpOnly session cookie. Without it the page
  // is a guest and never asks /api/auth/session (one request per page view otherwise); the sign-in options are
  // remembered from the last real answer so the popup can render before it asks.
  const HINT='cnr_signed_in', PROVIDERS_KEY='cnr-auth-providers';
  const hinted=()=>new RegExp('(?:^|;\\s*)'+HINT+'=1(?:;|$)').test(document.cookie);
  // Domain-wide (compilenrun.com) so Moodle can sign readers in automatically; clearing also drops the older host-only cookie.
  const HINT_DOMAIN=(h=>h.length>=2&&!/^\d+$/.test(h[h.length-1])?'; Domain='+h.slice(-2).join('.'):'')(location.hostname.split('.'));
  function setHint(on){try{const base=HINT+'='+(on?'1':'')+'; Path=/; Max-Age='+(on?2592000:0)+'; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');if(!on)document.cookie=base;document.cookie=base+HINT_DOMAIN;}catch(_){}}
  // Sister-site sign-on (Moodle): /api/auth/oauth/authorize sends signed-out readers here with ?auth=login&next=<authorize url>.
  // The analytics dashboard's /api/analytics/connect hand-off uses the same door.
  // The target survives a full-page Google/GitHub round trip in sessionStorage and is used once the session exists.
  const SSO_KEY='cnr-sso-next';
  const ssoNext=(()=>{try{const p=new URLSearchParams(location.search);const n=p.get('auth')==='login'?p.get('next')||'':'';if(/^\/api\/(auth\/oauth\/authorize|analytics\/connect)\?[\w%&=.+-]+$/.test(n)){sessionStorage.setItem(SSO_KEY,n);return n;}return sessionStorage.getItem(SSO_KEY)||'';}catch(_){return '';}})();
  function ssoContinue(user){if(!ssoNext||!user)return false;try{sessionStorage.removeItem(SSO_KEY);}catch(_){}location.replace(ssoNext);return true;}
  function rememberProviders(p){try{localStorage.setItem(PROVIDERS_KEY,JSON.stringify({google:p.google===true,github:p.github===true,email:p.email===true,wechat:p.wechat===true}));}catch(_){}}
  function guestSession(){let p=null;try{p=JSON.parse(localStorage.getItem(PROVIDERS_KEY));}catch(_){p=null;}
    return {configured:true,providers:p&&typeof p==='object'?{google:p.google===true,github:p.github===true,email:p.email===true,wechat:p.wechat===true}:{google:true,github:true,email:true,wechat:false},user:null};}
  const mustCheck=()=>hinted()||/^\/profile\//.test(location.pathname)||/[?&#]auth=/.test(location.search+location.hash)||(()=>{try{return !!sessionStorage.getItem('cnr-sso-next');}catch(_){return false;}})();
  // Sign-in invitations (the popup and Google One Tap) share one snooze record.
  const INVITE_KEY='cnr-auth-invite',DAY=86400000;
  const inviteStore={get(){try{return JSON.parse(localStorage.getItem(INVITE_KEY))||{};}catch(_){return{};}},set(v){try{localStorage.setItem(INVITE_KEY,JSON.stringify(v));}catch(_){}}};
  const inviteSnoozed=()=>inviteStore.get().until>Date.now();
  function snoozeInvite(){const state=inviteStore.get(),dismissed=(state.dismissed||0)+1;inviteStore.set({dismissed,until:Date.now()+(dismissed>=3?90:14)*DAY});}
  const quietPage=()=>/^\/(profile|auth|reset-password|verify-email)\//.test(location.pathname)||location.pathname==='/';
  let oneTapDisplayed=false;
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const plain = (value, max, empty = false) => typeof value === 'string' && (empty || value.length > 0) && value.length <= max && !/[\u0000-\u001f\u007f]/.test(value);
  function fault(code, text) { const error = new Error(text); error.code = code; return error; }
  function validate(value) {
    if (!object(value) || typeof value.configured !== 'boolean' || (value.user !== null && !object(value.user))) throw fault('invalid_response',t('Sign-in details could not be verified. Please try again.'));
    const providers = object(value.providers) ? { google: value.providers.google === true, github: value.providers.github === true, email: value.providers.email === true, wechat: value.providers.wechat === true } : { google: value.googleConfigured === true, github: false, email: value.emailConfigured === true, wechat: false };
    if (value.user === null) return { configured: value.configured, providers: value.configured ? providers : { google: false, github: false, email: false, wechat: false }, user: null };
    const user = value.user;
    if (!value.configured || !plain(user.id,200) || !plain(user.name,100,true) ||
        !(user.email === undefined || user.email === null || plain(user.email,254)) ||
        typeof user.emailVerified !== 'boolean' || typeof user.hasPassword !== 'boolean' || typeof user.googleLinked !== 'boolean' || !(user.googleEmail === undefined || user.googleEmail === null || plain(user.googleEmail,254)) ||
        !(user.githubLinked === undefined || typeof user.githubLinked === 'boolean') || !(user.githubLogin === undefined || user.githubLogin === null || plain(user.githubLogin,39)) || !(user.wechatLinked === undefined || typeof user.wechatLinked === 'boolean') ||
        !(user.avatar === undefined || user.avatar === null || (plain(user.avatar,512) && /^https:\/\/[^\s"'<>]+$/.test(user.avatar))) || !plain(value.csrfToken,500)) {
      throw fault('invalid_response',t('Sign-in details could not be verified. Please try again.'));
    }
    return { configured: value.configured, providers, user: { id: user.id, name: user.name, email: user.email || null,
      emailVerified: user.emailVerified, hasPassword: user.hasPassword, googleLinked: user.googleLinked, googleEmail: user.googleLinked && user.googleEmail || null,
      githubLinked: user.githubLinked === true, githubLogin: user.githubLinked === true && user.githubLogin || null, wechatLinked: user.wechatLinked === true, avatar: user.avatar || null }, csrfToken: value.csrfToken };
  }
  function clearPasswords() { dialog?.querySelectorAll('input[type="password"]').forEach(input=>{input.value='';}); }
  function say(text, error = false) { if(message){message.textContent=text;message.dataset.error=String(error);} }
  function initials(name) {
    const parts=name.trim().split(/\s+/).filter(Boolean);
    return parts.length ? (Array.from(parts[0])[0] + (parts.length>1?Array.from(parts[parts.length-1])[0]:'')).toLocaleUpperCase() : '?';
  }
  // The profile picture (WeChat avatar) covers the initials while it loads fine; a failed image falls back to them.
  let pictureFailed='';
  function renderPicture(url) {
    const picture=widget?.querySelector('[data-auth-picture]');
    if(!picture)return;
    if(!url||url===pictureFailed){picture.hidden=true;if(picture.getAttribute('src'))picture.removeAttribute('src');return;}
    if(picture.getAttribute('src')!==url){picture.onerror=()=>{pictureFailed=url;picture.hidden=true;};picture.src=url;}
    picture.hidden=false;
  }
  function closeMenu(focus = false) {
    if(!menu)return;menu.hidden=true;avatar.setAttribute('aria-expanded','false');
    if(focus&&!avatar.hidden)avatar.focus();
  }
  function positionMenu() {
    if(!menu||menu.hidden)return;
    const rect=avatar.getBoundingClientRect(), width=menu.getBoundingClientRect().width;
    menu.style.setProperty('--cnr-auth-menu-top',Math.max(8,rect.bottom+8)+'px');
    menu.style.setProperty('--cnr-auth-menu-left',Math.max(12,Math.min(rect.right-width,innerWidth-width-12))+'px');
  }
  function openMenu(focusFirst = false) {
    if(!current?.user||!menu||busy||transitioning)return;
    menu.hidden=false;avatar.setAttribute('aria-expanded','true');positionMenu();
    if(menuStatus)menuStatus.textContent=transitionFailed?t('Your learning needs attention. Retry the connection before editing.'):syncNotice;
    if(focusFirst)menu.querySelector('a')?.focus();
  }
  function render() {
    const user=current?.user;
    if(widget){
      widget.setAttribute('aria-busy',String(busy||transitioning));
      openButton.hidden=Boolean(user);openButton.textContent=published&&current===null?t('Reconnect'):t('Sign in');avatar.hidden=!user;avatar.disabled=busy||transitioning;
      if(user){widget.querySelector('[data-auth-initials]').textContent=initials(user.name);widget.querySelector('[data-auth-name]').textContent=user.name||t('Learner');avatar.setAttribute('aria-label',t('Open account menu for {name}',{name:user.name||t('Learner')}));renderPicture(user.avatar);}
      else closeMenu();
      widget.querySelector('[data-auth-signout]').disabled=!user||busy||transitioning;
      widget.querySelector('[data-auth-refresh]').hidden=!transitionFailed;widget.querySelector('[data-auth-refresh]').disabled=busy||transitioning;
    }
    if(!dialog)return;
    dialog.setAttribute('aria-busy',String(busy||transitioning));
    dialog.querySelector('[data-auth-google]').hidden=!capabilities.google||(Boolean(user)&&transitionFailed)||gsiButton||wechatSolo();
    if(capabilities.google&&gsiButton)dialog.querySelector('[data-auth-google-gsi]').hidden=wechatSolo(); // capabilities first: render() also runs before gsiButton is declared
    dialog.querySelector('[data-auth-google]').setAttribute('aria-disabled',String(busy||transitioning||transitionFailed));
    dialog.querySelector('[data-auth-github]').hidden=!capabilities.github||(Boolean(user)&&transitionFailed)||wechatSolo();
    if(wechatButton){wechatButton.hidden=!capabilities.wechat||(Boolean(user)&&transitionFailed)||wechatOpen;wechatButton.disabled=busy||transitioning||transitionFailed;}
    if(wechatPanel)wechatPanel.hidden=!wechatOpen;
    const wechatBack=wechatPanel?.querySelector('[data-auth-wechat-back]');if(wechatBack)wechatBack.hidden=wechatDefault&&!wechatLink;
    const wechatOthers=dialog.querySelector('[data-auth-wechat-others]');if(wechatOthers)wechatOthers.hidden=!(wechatOpen&&wechatDefault&&!wechatLink&&(capabilities.google||capabilities.github||capabilities.email));
    dialog.querySelector('[data-auth-github]').setAttribute('aria-disabled',String(busy||transitioning||transitionFailed));
    dialog.querySelector('[data-auth-email]').hidden=!capabilities.email||(Boolean(user)&&transitionFailed)||wechatSolo();
    dialog.querySelector('[data-auth-divider]').hidden=!(capabilities.email&&(capabilities.google||capabilities.github||capabilities.wechat))||wechatSolo();
    dialog.querySelector('[data-auth-retry]').hidden=!transitionFailed&&Boolean(current?.configured && (capabilities.email||capabilities.google||capabilities.github||capabilities.wechat));
    dialog.querySelector('[data-auth-retry]').disabled=busy||Boolean(inFlight);
    dialog.querySelector('#cnr-auth-title').textContent=transitionFailed&&user?t('Learning needs attention'):wechatOpen&&wechatSolo()?(wechatLink?t('Link WeChat'):t('Sign in with WeChat')):titles[mode];
    forms.forEach(form=>{
      form.hidden=form.dataset.authForm!==mode;
      form.querySelectorAll('input,button').forEach(control=>{control.disabled=busy||transitioning||transitionFailed||!capabilities.email;});
    });
    dialog.querySelectorAll('[data-auth-mode]').forEach(button=>{button.hidden=button.dataset.authMode===mode || (mode!=='login'&&button.dataset.authMode!=='login');button.disabled=busy||transitioning||transitionFailed;});
  }
  async function accept(next, reason) {
    if(published&&!actionPending&&!transitionFailed&&JSON.stringify(current)===JSON.stringify(next)){await transition;return clone(current);}
    // Guest before and after: only the sign-in options changed (the guess made without a request versus the
    // server's answer). Ownership is unchanged, so update the popup without a learning transition.
    if(published&&!actionPending&&!transitionFailed&&next&&current&&current.user===null&&next.user===null&&current.configured===next.configured){
      await transition;current=next;known=true;capabilities={...next.providers};if(next.configured)rememberProviders(next.providers);setHint(false);render();
      if(wechatAuto())wechatBegin();
      if(dialog?.open&&!busy&&message?.textContent===t('Checking sign-in options…'))say('');
      return clone(current);
    }
    const previousUserId=current?.user?.id||null;
    current=next;published=true;actionPending=false;
    if(next){known=true;capabilities={...next.providers};if(reason!=='initial'||mustCheck()){setHint(!!next.user);if(next.configured)rememberProviders(next.providers);}}
    clearPasswords();
    const epoch=++stateEpoch, waits=[];
    transitioning=true;
    window.dispatchEvent(new CustomEvent('cnr:auth-changed',{detail:{session:clone(next),previousUserId,reason,waitUntil(value){waits.push(Promise.resolve(value));}}}));
    if(transitioning)closeMenu();
    render();
    transition=Promise.allSettled(waits);
    const results=await transition;
    if(epoch===stateEpoch){
      transitioning=false;transitionFailed=results.some(result=>result.status==='rejected');render();
      if(transitionFailed){
        const problem=fault('learning_transition_failed',t('Your learning could not finish switching. Try connecting again before continuing.'));
        say(problem.message,true);if(menuStatus)menuStatus.textContent=problem.message;
        if(dialog)dialog.querySelector('[data-auth-retry]').hidden=false;
        throw problem;
      }
      if(dialog?.open&&!busy){
        if(next?.user)closeDialog(true);
        else if(!next?.configured)say(next?t('Sign-in is unavailable right now. You can keep learning on this device.'):t('Could not connect to sign-in. Check your connection and try again.'),true);
        else if(message?.textContent===t('Checking sign-in options…'))say('');
      }
    }
    return clone(current);
  }
  async function beforeAction(action) {
    actionPending=true;const waits=[];
    window.dispatchEvent(new CustomEvent('cnr:auth-changing',{detail:{action,session:clone(current),waitUntil(value){waits.push(Promise.resolve(value));}}}));
    const results=await Promise.allSettled(waits);
    const failure=results.find(result=>result.status==='rejected');
    if(failure){
      if(failure.reason?.code==='account_changed')throw fault('account_changed',t('The signed-in account changed before progress could be saved. Review the current account before trying again.'));
      throw fault('learning_transition_failed',action==='logout'||action==='/api/auth/logout'?t('Your latest progress could not be synced. You are still signed in; retry before signing out.'):t('Your learning could not be kept safely before this account change. Try connecting again, then retry.'));
    }
  }
  async function readJSON(response) {
    if(Number(response.headers.get('content-length'))>65536)throw fault('invalid_response',t('The account response was too large. Please try again.'));
    const reader=response.body?.getReader();
    if(!reader)throw fault('invalid_response',t('The account service returned an empty response.'));
    const chunks=[];let size=0;
    try{while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>65536){await reader.cancel();throw fault('invalid_response',t('The account response was too large. Please try again.'));}chunks.push(part.value);}}
    finally{reader.releaseLock();}
    const bytes=new Uint8Array(size);let offset=0;chunks.forEach(chunk=>{bytes.set(chunk,offset);offset+=chunk.byteLength;});
    try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch(_){throw fault('invalid_response',t('The account service returned an unreadable response. Please try again.'));}
  }
  function responseError(response, value) {
    const code=object(value)&&typeof value.error==='string'?value.error:'';
    const texts={
      invalid_credentials:t('Email or password was not accepted. If you just registered, verify your email first.'),
      invalid_email:t('Enter a valid email address.'), invalid_name:t('Use a display name of 1–100 characters.'),
      password_policy:t('Use a password with 15–128 characters. Spaces are kept.'),
      account_changed:t('The signed-in account changed. Review the current account before trying again.'),
      authentication_required:t('Your sign-in has ended. Please sign in again.'),
      csrf_failed:t('Your sign-in changed. Refresh the connection and try again.'),
      password_service_busy:t('Sign-in is busy right now. Please try again in a moment.'),
      rate_limited:t('Please wait a little before trying again.'),
    };
    return fault(code||'unavailable',texts[code]||(response.status===429?texts.rate_limited:t('Sign-in is unavailable right now. Please try again later.')));
  }
  async function request(url,method='GET',body,identity,signal) {
    const controller=new AbortController();
    const abort=()=>controller.abort();if(signal){if(signal.aborted)abort();else signal.addEventListener('abort',abort,{once:true});}
    const timer=setTimeout(abort,15000),headers={Accept:'application/json'};
    if(method!=='GET')headers['Content-Type']='application/json';
    if(identity?.user){headers['X-CNR-User']=identity.user.id;headers['X-CSRF-Token']=identity.csrfToken;}
    try{
      const response=await fetch(url,{method,headers,credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal,...(body===undefined?{}:{body:JSON.stringify(body)})});
      const value=await readJSON(response);if(!response.ok)throw responseError(response,value);return value;
    }catch(error){if(error.code)throw error;throw fault('offline',t('Could not connect to sign-in. Check your connection and try again.'));}
    finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
  }
  function invalidateRefresh() {requestEpoch++;refreshController?.abort();inFlight=null;refreshController=null;}
  function fetchSession({force=true,reason='refresh'}={}) {
    if(inFlight)return inFlight;
    if(actionPending&&!force)return Promise.resolve(clone(current));
    if(!force && Date.now()-lastAttempt<30000)return Promise.resolve(clone(current));
    lastAttempt=Date.now();const epoch=requestEpoch,controller=new AbortController();refreshController=controller;
    const promise=(async()=>{
      try{
        const value=validate(await request('/api/auth/session','GET',undefined,undefined,controller.signal));
        if(epoch!==requestEpoch)throw fault('superseded',t('A newer account action replaced this connection check.'));
        answered=true;
        return await accept(value,reason);
      }catch(error){
        if(epoch!==requestEpoch)throw fault('superseded',t('A newer account action replaced this connection check.'));
        if(error.code==='learning_transition_failed')throw error;
        await accept(null,'unavailable');
        if(dialog?.open){say(error.message,true);dialog.querySelector('[data-auth-retry]').hidden=false;}
        throw error;
      }finally{if(inFlight===promise){inFlight=null;refreshController=null;render();}}
    })();
    inFlight=promise;return promise;
  }
  function refresh(options) {return mutation?mutation.then(()=>clone(current)):fetchSession(options);}
  function modeChanged(next) {
    if(!titles[next]||busy)return;
    const old=forms.find(form=>form.dataset.authForm===mode);const email=old?.elements.email?.value||'';
    mode=next;clearPasswords();forms.forEach(form=>{if(form.elements.email)form.elements.email.value=email;});say('');render();
    forms.find(form=>form.dataset.authForm===mode)?.querySelector('input')?.focus();
  }
  function closeDialog(success=false) {if(!dialog?.open)return;focusAvatarOnClose=success;dialog.close();}
  function openDialog(next='login',trigger=openButton) {
    if(!dialog)return;
    const viaWechat=next==='wechat'&&capabilities.wechat&&!transitionFailed;
    if(current?.user&&!viaWechat){openMenu(true);return;}
    closeMenu();returnFocus=trigger;mode=titles[next]?next:'login';clearPasswords();render();
    say(transitionFailed?t('Your learning could not finish switching. Try connecting again before continuing.'):current?.configured?'':known?t('Sign-in is unavailable right now. You can keep learning on this device.'):t('Checking sign-in options…'),transitionFailed);
    if(!dialog.open)dialog.showModal();
    const field=capabilities.email?forms.find(form=>form.dataset.authForm===mode)?.querySelector('input'):dialog.querySelector('[data-auth-close]');field?.focus();
    // Opening a dialog reuses the initial/ongoing check and only refreshes stale discovery.
    refresh({force:false}).catch(()=>{});
    if(viaWechat||wechatAuto())wechatBegin();
  }
  // In WeChat-default mode the login form starts on the QR code as soon as WeChat is known to be available, but only
  // when the reader opened the dialog. The sign-in invite below opens it unasked for thousands of guests a day, and
  // every started login costs a pooled single-use QR ticket and ~17 D1 row writes; those readers see the WeChat button.
  let invitedOpen=false;
  const wechatAuto=()=>wechatDefault&&!invitedOpen&&dialog?.open&&mode==='login'&&!wechatOpen&&!current?.user&&capabilities.wechat&&!busy&&!transitioning&&!transitionFailed;
  async function perform(form) {
    if(busy||transitioning||transitionFailed||!capabilities.email||!form.reportValidity())return;
    const kind=form.dataset.authForm,fields=Object.fromEntries(new FormData(form));
    if(kind==='register' && (Array.from(fields.password).length<15 || Array.from(fields.password).length>128 || fields.password.includes('\0'))){say(t('Use a password with 15–128 characters. Spaces are kept.'),true);form.elements.password.focus();return;}
    if(kind==='register' && (!fields.name.trim() || /[\u0000-\u001f\u007f]/.test(fields.name))){say(t('Use a display name of 1–100 characters.'),true);form.elements.name.focus();return;}
    const routes={login:'/api/auth/login',register:'/api/auth/register',forgot:'/api/auth/forgot-password',resend:'/api/auth/resend-verification'};
    const body=kind==='register'?{name:fields.name.trim(),email:fields.email.trim(),password:fields.password}:kind==='login'?{email:fields.email.trim(),password:fields.password}:{email:fields.email.trim()};
    busy=true;clearPasswords();say(kind==='login'?t('Signing in…'):t('Sending your request…'));render();
    if(kind==='login')invalidateRefresh();
    const operation=(async()=>{
      try{
        if(kind==='login')await beforeAction('login');
        const result=await request(routes[kind],'POST',body);
        if(!object(result)||result.ok!==true)throw fault('invalid_response',t('The sign-in response could not be verified. Please try again.'));
        if(kind==='login'){
          const next=await fetchSession({force:true,reason:'login'});
          if(!next?.user)throw fault('authentication_required',t('Sign-in could not be confirmed. Please try again.'));
          if(dialog?.open)closeDialog(true);
        }else if(kind==='register')say(t('If this address can be registered, a verification email will arrive shortly. Verify it before signing in.'));
        else say(kind==='forgot'?t('If this address has an eligible account, a password reset email will arrive shortly.'):t('If this address needs verification, a verification email will arrive shortly.'));
      }catch(error){
        say(error.message,true);
        if(kind==='login'&&error.code!=='learning_transition_failed'){try{await fetchSession({force:true,reason:'login-failed'});}catch(_){} }
        if(error.code==='learning_transition_failed'){transitionFailed=true;render();dialog.querySelector('[data-auth-retry]').hidden=false;}
        throw error;
      }finally{busy=false;clearPasswords();render();}
    })();
    mutation=operation;
    try{await operation;}catch(_){}finally{if(mutation===operation)mutation=null;}
  }
  async function signOut() {
    if(mutation||busy)throw fault('busy',t('Please wait for the current account request.'));
    const expected=current?.user?.id;
    if(!current)throw fault('offline',t('Reconnect to confirm the current account before signing out.'));
    if(!expected)return clone(current);
    busy=true;render();if(menuStatus)menuStatus.textContent=t('Signing out…');
    const operation=(async()=>{
      try{
        const verified=await fetchSession({force:true});
        if(!verified?.user || verified.user.id!==expected)throw fault('account_changed',t('The signed-in account changed. Review the current account before trying again.'));
        await beforeAction('logout');
        invalidateRefresh();
        const result=await request('/api/auth/logout','POST',{},verified);
        if(!object(result)||result.ok!==true)throw fault('invalid_response',t('Sign-out could not be confirmed. Please try again.'));
        const next=await fetchSession({force:true,reason:'logout'});
        closeMenu();return next;
      }catch(error){if(menuStatus)menuStatus.textContent=error.message;if(error.code==='offline'){await accept(null,'unavailable');}if(error.code==='learning_transition_failed'){transitionFailed=true;render();}if(['account_changed','authentication_required','csrf_failed'].includes(error.code)){try{await fetchSession({force:true});}catch(_){} }throw error;}
      finally{busy=false;render();}
    })();
    mutation=operation;
    try{return await operation;}finally{if(mutation===operation)mutation=null;}
  }
  // WeChat Official Account sign-in. Normally (mode 'scan') the reader scans a QR code made for this login and is
  // signed in on following (or at once if already following); as a fallback (mode 'code') the reader scans the
  // account's static QR code, follows and sends a short code in the chat. Either way the page polls until the Worker
  // has seen it. Signed-in readers use the same panel to link WeChat to their account.
  let wechatEpoch=0,wechatPoll=null,wechatTick=null,wechatController=null,wechatGate=false,wechatCode='',wechatScan=false;
  const wechatEl=name=>wechatPanel?.querySelector('[data-auth-wechat-'+name+']');
  const wechatQr=wechatEl('qr'),wechatQrStatic=wechatQr?.getAttribute('src')??null,wechatRenewText=wechatEl('renew')?.textContent??'';
  // mode: 'scan' (per-login QR in qr), 'code' (static QR + code), or null while a code is being fetched (no steps yet).
  function wechatMode(mode,qr){
    wechatScan=mode==='scan';
    if(wechatQr){if(wechatScan)wechatQr.src=qr;else if(mode==='code'||mode==='static'){if(wechatQrStatic===null)wechatQr.removeAttribute('src');else wechatQr.setAttribute('src',wechatQrStatic);}}
    wechatPanel?.querySelectorAll('[data-auth-wechat-steps]').forEach(list=>{list.hidden=list.dataset.authWechatSteps!==mode;});
    const code=wechatEl('code');if(code)code.hidden=mode!=='code';
    const renew=wechatEl('renew');if(renew)renew.textContent=wechatScan?t('Get a new QR code'):wechatRenewText;
  }
  const wechatExpired=()=>wechatScan?t('This QR code has expired.'):t('This code has expired.');
  function wechatStop(){clearTimeout(wechatPoll);clearInterval(wechatTick);wechatPoll=wechatTick=null;wechatController?.abort();wechatController=null;}
  function wechatStatus(text){const el=wechatEl('status');if(el)el.textContent=text;}
  function wechatHalt(text,error=true){wechatStop();wechatStatus('');const expires=wechatEl('expires');if(expires)expires.textContent='';say(text,error);const renew=wechatEl('renew');if(renew){renew.hidden=false;renew.disabled=false;}}
  // Leaving the panel before sign-in finished: tell learning the login did not happen, as a failed password login does.
  function wechatRelease(){if(!wechatGate)return;wechatGate=false;fetchSession({force:true,reason:'login-failed'}).catch(()=>{});}
  function wechatClose(){wechatEpoch++;wechatStop();wechatOpen=false;wechatCode='';wechatMode('static');wechatRelease();}
  function wechatShow(){
    wechatOpen=true;wechatLink=Boolean(current?.user);clearPasswords();
    const code=wechatEl('code'),expires=wechatEl('expires'),renew=wechatEl('renew');
    if(code)code.textContent='';if(expires)expires.textContent='';if(renew)renew.hidden=true;wechatStatus('');
    render();wechatEl('back')?.focus();
  }
  async function wechatBegin(){
    if(!wechatPanel||busy||transitioning||transitionFailed||!capabilities.wechat)return;
    wechatShow();await wechatStart();
  }
  async function wechatStart(){
    const epoch=++wechatEpoch;wechatStop();wechatCode='';
    const code=wechatEl('code'),renew=wechatEl('renew');if(code)code.textContent='';if(renew){renew.hidden=true;}
    if(!wechatScan)wechatMode(null); // a renewed scan keeps its steps until the new QR code arrives
    say(t('Getting a sign-in code…'));
    try{
      // Signing in changes who owns this browser's learning, so learning gets its chance first (as the Google button does).
      if(!wechatLink&&!wechatGate){wechatGate=true;await beforeAction('wechat');}
      if(epoch!==wechatEpoch)return;
      const result=await request('/api/auth/wechat/start','POST',{},current?.user?current:undefined);
      if(epoch!==wechatEpoch)return;
      // An older Worker sends no mode: that is the code flow.
      const scan=object(result)&&result.mode==='scan';
      if(!object(result)||typeof result.code!=='string'||!/^\d{6}$/.test(result.code)||typeof result.expiresAt!=='number'||!(result.mode===undefined||result.mode==='scan'||result.mode==='code')||
        scan&&!(typeof result.qr==='string'&&result.qr.length<=2000&&/^https:\/\/mp\.weixin\.qq\.com\/cgi-bin\/showqrcode\?ticket=[^\s"'<>]+$/.test(result.qr)))throw fault('invalid_response',t('The WeChat code could not be verified. Please try again.'));
      wechatCode=result.code;wechatMode(scan?'scan':'code',result.qr);
      if(scan){say('');wechatStatus(t('Waiting for your scan…'));}
      else{if(code)code.textContent=result.code;say(t('Scan the QR code with WeChat to follow the account, then send this code in the chat:'));wechatStatus(t('Waiting for your message…'));}
      // The server's clock decides; a skewed local clock only falls back to five minutes, and the server still says 'expired'.
      let left=result.expiresAt-Date.now();if(!(left>0&&left<=3600000))left=300000;
      const until=Date.now()+left,expires=wechatEl('expires');
      const tick=()=>{const s=Math.max(0,Math.ceil((until-Date.now())/1000));if(expires)expires.textContent=t(scan?'QR code expires in {time}':'Code expires in {time}',{time:Math.floor(s/60)+':'+String(s%60).padStart(2,'0')});if(s<=0&&epoch===wechatEpoch)wechatHalt(wechatExpired());};
      tick();wechatTick=setInterval(tick,1000);
      wechatSchedule(epoch);
    }catch(error){
      if(epoch!==wechatEpoch)return;
      if(error.code==='learning_transition_failed'){wechatGate=false;wechatStop();transitionFailed=true;say(error.message,true);render();dialog.querySelector('[data-auth-retry]').hidden=false;return;}
      wechatHalt(error.message);
    }
  }
  function wechatSchedule(epoch){wechatPoll=setTimeout(()=>{wechatCheck(epoch);},typeof window.CNR_WECHAT_POLL_MS==='number'?window.CNR_WECHAT_POLL_MS:2000);}
  async function wechatCheck(epoch){
    if(epoch!==wechatEpoch||!wechatOpen||!dialog?.open)return;
    const controller=new AbortController();wechatController=controller;
    let value;
    try{value=await request('/api/auth/wechat/status?code='+encodeURIComponent(wechatCode),'GET',undefined,undefined,controller.signal);}
    catch(error){if(epoch===wechatEpoch)wechatHalt(error.message);return;}
    finally{if(wechatController===controller)wechatController=null;}
    if(epoch!==wechatEpoch)return;
    const status=object(value)?value.status:'';
    if(status==='pending'){wechatSchedule(epoch);return;}
    if(status==='expired'){wechatHalt(wechatExpired());return;}
    if(status==='conflict'){wechatHalt(t('This WeChat account is already linked to another account.'));return;}
    if(status!=='done'&&status!=='linked'){wechatHalt(t('The WeChat code could not be verified. Please try again.'));return;}
    wechatStop();wechatStatus('');
    const linking=status==='linked';wechatGate=false;busy=true;render();
    const operation=(async()=>{
      try{
        if(!linking)invalidateRefresh();
        const next=await fetchSession({force:true,reason:linking?'refresh':'login'});
        if(!next?.user)throw fault('authentication_required',t('Sign-in could not be confirmed. Please try again.'));
        say(linking?t('WeChat account linked.'):t('Signed in with WeChat.'));
        if(dialog?.open)closeDialog(true);
      }catch(error){
        say(error.message,true);
        if(error.code==='learning_transition_failed'){transitionFailed=true;render();dialog.querySelector('[data-auth-retry]').hidden=false;}
        else if(!linking){try{await fetchSession({force:true,reason:'login-failed'});}catch(_){} }
        throw error;
      }finally{busy=false;render();}
    })();
    mutation=operation;
    try{await operation;}catch(_){}finally{if(mutation===operation)mutation=null;}
  }

  window.CNRAuth=Object.freeze({
    ready:()=>initial, getSession:()=>clone(current), refresh, signOut,
    open:(next)=>openDialog(next,document.activeElement),
  });
  if(dialog&&widget){
    document.addEventListener('click',event=>{
      const opener=event.target.closest('[data-auth-open]');if(opener){event.preventDefault();openDialog('login',opener);return;}
      if(!menu.hidden&&!menu.contains(event.target)&&!avatar.contains(event.target))closeMenu();
    });
    avatar.addEventListener('click',()=>menu.hidden?openMenu():closeMenu());
    avatar.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();openMenu(true);}});
    widget.querySelector('[data-auth-signout]').addEventListener('click',()=>{signOut().catch(()=>{});});
    widget.querySelector('[data-auth-refresh]').addEventListener('click',()=>{if(menuStatus)menuStatus.textContent=t('Reconnecting…');refresh({force:true}).catch(error=>{if(menuStatus)menuStatus.textContent=error.message;});});
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
    document.addEventListener('focusin',event=>{if(!menu.hidden&&!menu.contains(event.target)&&event.target!==avatar)closeMenu();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden&&!dialog.open){event.preventDefault();closeMenu(true);}});
    dialog.querySelector('[data-auth-close]').addEventListener('click',()=>closeDialog());
    dialog.addEventListener('close',()=>{
      invitedOpen=false;clearPasswords();if(wechatOpen){wechatClose();render();}
      const target=focusAvatarOnClose&&!avatar.hidden?avatar:returnFocus&&returnFocus.isConnected&&returnFocus.getClientRects().length?returnFocus:!avatar.hidden?avatar:openButton;
      focusAvatarOnClose=false;requestAnimationFrame(()=>target?.focus());
    });
    dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeDialog();}});
    dialog.querySelectorAll('[data-auth-mode]').forEach(button=>button.addEventListener('click',()=>modeChanged(button.dataset.authMode)));
    dialog.querySelector('[data-auth-github]').addEventListener('click',event=>{
      event.preventDefault();if(busy||transitioning||transitionFailed||!capabilities.github)return;
      busy=true;clearPasswords();render();say(t('Opening GitHub sign-in…'));
      beforeAction('github').then(()=>location.assign('/api/auth/github')).catch(error=>{busy=false;transitionFailed=true;say(error.message,true);render();});
    });
    dialog.querySelector('[data-auth-google]').addEventListener('click',event=>{
      event.preventDefault();if(busy||transitioning||transitionFailed||!capabilities.google)return;
      busy=true;clearPasswords();render();say(t('Opening Google sign-in…'));
      beforeAction('google').then(()=>location.assign('/api/auth/google')).catch(error=>{busy=false;transitionFailed=true;say(error.message,true);render();});
    });
    wechatButton?.addEventListener('click',event=>{event.preventDefault();wechatBegin();});
    wechatEl('renew')?.addEventListener('click',()=>{if(wechatOpen&&!busy)wechatStart();});
    wechatEl('back')?.addEventListener('click',()=>{
      if(busy)return;
      if(wechatLink){closeDialog();return;} // signed-in readers came only for WeChat; the sign-in options are not theirs
      wechatClose();say('');render();wechatButton?.focus();
    });
    dialog.querySelector('[data-auth-retry]').addEventListener('click',()=>{say(t('Checking sign-in options…'));refresh({force:true}).then(next=>{say(next?.configured?'':t('Sign-in is unavailable right now. You can keep learning on this device.'));}).catch(()=>{});});
    forms.forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();perform(form);}));
    window.addEventListener('resize',positionMenu,{passive:true});window.addEventListener('scroll',()=>closeMenu(),{passive:true});
    render();
  }
  // Invite guests to sign in, without nagging: once per visit at most, only after they have read a couple of
  // pages (or right after they save something as a guest that an account would keep across devices), never on
  // the home, profile or auth pages, and snoozed for two weeks after a dismissal (three months after the third).
  (function invite(){
    if(!dialog||!widget||quietPage())return;
    const KEY=INVITE_KEY;
    const session={get(k){try{return sessionStorage.getItem(KEY+':'+k);}catch(_){return null;}},set(k,v){try{sessionStorage.setItem(KEY+':'+k,v);}catch(_){}}};
    const pages=Number(session.get('pages')||0)+1;session.set('pages',String(pages));
    const delay=typeof window.CNR_INVITE_DELAY_MS==='number'?window.CNR_INVITE_DELAY_MS:25000;
    let invited=false,timer=null;
    const eligible=()=>!session.get('shown')&&!inviteSnoozed()&&!oneTapDisplayed&&known&&!current?.user&&!transitionFailed&&!busy&&!dialog.open&&document.visibilityState==='visible'&&(capabilities.google||capabilities.github||capabilities.email||capabilities.wechat);
    function show(text){
      if(!eligible())return;
      session.set('shown','1');invited=true;invitedOpen=true;
      openDialog('login',document.activeElement);say(text);
    }
    function later(ms,text){clearTimeout(timer);timer=setTimeout(()=>{if(document.visibilityState!=='visible'){document.addEventListener('visibilitychange',()=>later(1500,text),{once:true});return;}
      initial.then(()=>eligible()&&!answered?fetchSession({force:true,reason:'invite'}):null).then(()=>show(text)).catch(()=>{});},ms);}
    if(pages>=2)later(delay,t('Create a free account to keep your progress, bookmarks and solved problems on every device. You can keep learning without one.'));
    window.addEventListener('cnr:learning-updated',event=>{if(event.detail?.persistent&&!current?.user)later(1500,t('Saved on this device. Sign in to keep your progress on every device, or close this to keep going as a guest.'));});
    dialog.addEventListener('close',()=>{
      if(!invited)return;invited=false;
      if(current?.user)return;
      snoozeInvite();
    });
  })();

  // Google Identity Services: One Tap for guests, automatic sign-in for readers who signed in with Google here
  // before, and Google's own button (personalized when the browser has a matching session) in the popup. All
  // three hand the page a signed credential that the Worker verifies at /api/auth/google/credential.
  const GSI_CLIENT_ID=document.querySelector('meta[name="cnr-google-client-id"]')?.content||'';
  let gsiPromise=null,gsiNonce=null,gsiInitialized=false,gsiPrompted=false,gsiBusy=false,gsiButton=false;
  function gsiLoad(){
    if(gsiPromise)return gsiPromise;
    gsiPromise=new Promise((resolve,reject)=>{
      if(window.google?.accounts?.id)return resolve(window.google.accounts.id);
      const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.defer=true;
      script.onload=()=>window.google?.accounts?.id?resolve(window.google.accounts.id):reject(fault('gsi_unavailable',t('Google sign-in did not load.')));
      script.onerror=()=>reject(fault('gsi_unavailable',t('Google sign-in did not load.')));
      document.head.appendChild(script);
    }).catch(error=>{gsiPromise=null;throw error;});
    return gsiPromise;
  }
  function gsiNonceValue(){if(!gsiNonce){const bytes=crypto.getRandomValues(new Uint8Array(32));gsiNonce=btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}return gsiNonce;}
  async function gsiInit(){
    const id=await gsiLoad();
    if(!gsiInitialized){
      id.initialize({client_id:GSI_CLIENT_ID,callback:gsiCredential,nonce:gsiNonceValue(),auto_select:true,cancel_on_tap_outside:true,itp_support:true,use_fedcm_for_prompt:true,context:'signin'});
      gsiInitialized=true;
    }
    return id;
  }
  async function gsiCredential(credentialResponse){
    if(gsiBusy||busy||transitioning||transitionFailed||!object(credentialResponse)||typeof credentialResponse.credential!=='string')return;
    gsiBusy=true;busy=true;clearPasswords();render();if(dialog?.open)say(t('Signing in with Google…'));
    try{
      invalidateRefresh();
      await beforeAction('google');
      const result=await request('/api/auth/google/credential','POST',{credential:credentialResponse.credential,nonce:gsiNonceValue()});
      if(!object(result)||result.ok!==true)throw fault('invalid_response',t('Google sign-in could not be verified. Please try again.'));
      const next=await fetchSession({force:true,reason:'login'});
      if(!next?.user)throw fault('authentication_required',t('Sign-in could not be confirmed. Please try again.'));
      if(dialog?.open)closeDialog(true);
    }catch(error){
      if(dialog?.open)say(error.message,true);
      if(error.code==='learning_transition_failed'){transitionFailed=true;render();if(dialog)dialog.querySelector('[data-auth-retry]').hidden=false;}
      else{try{await fetchSession({force:true,reason:'login-failed'});}catch(_){}}
    }finally{busy=false;gsiBusy=false;render();}
  }
  const gsiEligible=()=>!!GSI_CLIENT_ID&&!!dialog&&!current?.user&&!hinted()&&!quietPage()&&capabilities.google&&!inviteSnoozed()&&!transitionFailed&&document.visibilityState==='visible';
  function gsiPrompt(){
    if(gsiPrompted||!gsiEligible())return;
    gsiPrompted=true;
    gsiInit().then(id=>id.prompt(notification=>{
      try{
        if(notification?.isDismissedMoment?.()){const reason=notification.getDismissedReason?.();if(reason&&reason!=='credential_returned')snoozeInvite();}
        else oneTapDisplayed=true; // shown (or decided by the browser); the popup invitation stays quiet this visit
      }catch(_){}
    })).catch(()=>{gsiPrompted=false;});
  }
  // Google renders its own button in the popup; the plain link stays as the fallback when the script is unavailable.
  function gsiRenderButton(){
    const box=dialog?.querySelector('[data-auth-google-gsi]');
    if(!box||gsiButton||!GSI_CLIENT_ID||!capabilities.google||current?.user)return;
    gsiInit().then(id=>{
      if(gsiButton||!dialog.open)return;
      box.hidden=false;
      id.renderButton(box,{type:'standard',theme:'outline',size:'large',text:'continue_with',shape:'pill',logo_alignment:'left',...(isZh?{locale:'zh_CN'}:{}),width:Math.min(400,Math.max(200,Math.round(box.clientWidth||320)))});
      gsiButton=!!box.childElementCount;
      if(!gsiButton)box.hidden=true;
      render();
    }).catch(()=>{});
  }
  function gsiSignedOut(){gsiLoad().then(id=>{try{id.disableAutoSelect();}catch(_){}}).catch(()=>{});}
  if(GSI_CLIENT_ID&&dialog){
    dialog.addEventListener('toggle',()=>{if(dialog.open)gsiRenderButton();});
    queueMicrotask(()=>initial?.then(()=>{setTimeout(gsiPrompt,typeof window.CNR_ONE_TAP_DELAY_MS==='number'?window.CNR_ONE_TAP_DELAY_MS:2000);})); // initial is created at the end of this module
    window.addEventListener('cnr:auth-changed',event=>{if(event.detail?.reason==='logout')gsiSignedOut();});
  }
  window.addEventListener('cnr:auth-changing',()=>{actionPending=true;invalidateRefresh();});
  window.addEventListener('cnr:sync-status',event=>{if(typeof event.detail?.message==='string'){syncNotice=event.detail.message.slice(0,400);if(menuStatus&&!busy&&!transitionFailed)menuStatus.textContent=syncNotice;}});
  function checkCurrentSession(){if(document.visibilityState==='visible'&&!mutation&&!actionPending&&(hinted()||current?.user))refresh({force:false}).catch(()=>{});}
  window.addEventListener('focus',checkCurrentSession);
  window.addEventListener('online',()=>{if(document.visibilityState==='visible'&&!mutation&&!actionPending&&(hinted()||current?.user||current===null))refresh({force:current===null}).catch(()=>{});});
  document.addEventListener('visibilitychange',checkCurrentSession);
  window.addEventListener('pageshow',event=>{if(event.persisted){busy=false;actionPending=true;invalidateRefresh();closeMenu();if(dialog?.open)say(t('Checking sign-in options…'));render();refresh({force:true,reason:'return'}).catch(()=>{});}});
  // No interval, localStorage token, or per-keystroke request. One deduplicated
  // initial discovery; focus/visibility checks are throttled for 30 seconds.
  // A recovered network immediately retries an unknown/failed session check.
  // Guests (no hint cookie) start from a synthetic guest session and only ask the server when the popup opens.
  initial=Promise.resolve().then(()=>mustCheck()?fetchSession({force:true,reason:'initial'}):accept(guestSession(),'initial')).catch(()=>clone(current));
  if(ssoNext){
    window.addEventListener('cnr:auth-changed',event=>{if(event.detail?.session?.user)ssoContinue(event.detail.session.user);});
    initial.then(s=>{if(!ssoContinue(s?.user)&&/[?&]auth=login/.test(location.search))openDialog('login');}).catch(()=>{});
  }
})();
