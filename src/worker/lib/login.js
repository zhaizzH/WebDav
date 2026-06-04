/**
 * 登录页面 HTML 生成
 */

const LOGIN_CSS = `
:root {
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --z-50: #fafafa; --z-100: #f4f4f5; --z-200: #e4e4e7; --z-300: #d4d4d8;
  --z-400: #a1a1aa; --z-500: #71717a; --z-600: #52525b; --z-700: #3f3f46;
  --z-800: #27272a; --z-900: #18181b; --z-950: #09090b;
  --z-800-50: rgba(39,39,42,0.5); --z-800-30: rgba(39,39,42,0.3);
  --blue-400: #60a5fa; --blue-500: #3b82f6; --blue-600: #2563eb;
  --yellow-500: #eab308; --green-500: #22c55e; --green-600: #16a34a; --red-500: #ef4444;
}
* { margin: 0; padding: 0; box-sizing: border-box }
body { font-family: var(--font-mono); background: var(--z-100); color: var(--z-900); height: 100vh; overflow: hidden; display: flex; flex-direction: column }
html.dark body, html.dark { background: var(--z-950); color: var(--z-100); color-scheme: dark }
.header { border-bottom: 1px solid var(--z-200); background: var(--z-50); flex-shrink: 0 }
html.dark .header { border-color: var(--z-800); background: var(--z-900) }
.header-inner { padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem }
.header-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.025em }
.header-center { flex: 1; text-align: center; min-width: 0 }
.header-sub { font-size: 0.875rem; color: var(--z-500); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block }
html.dark .header-sub { color: var(--z-400) }
.header-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0 }
.btn { font-family: var(--font-mono); font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 0.25rem; cursor: pointer; transition: all .15s; border: none; outline: none }
.btn-ghost { background: transparent; color: var(--z-500) }
.btn-ghost:hover { color: var(--z-700) }
html.dark .btn-ghost:hover { color: var(--z-300) }
.login-wrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem }
.login-card { width: 100%; max-width: 22rem; background: var(--z-50); border: 1px solid var(--z-200); border-radius: 0.5rem; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06) }
html.dark .login-card { background: var(--z-900); border-color: var(--z-800); box-shadow: 0 1px 3px rgba(0,0,0,0.3) }
.login-icon { text-align: center; font-size: 2.5rem; margin-bottom: 1rem; line-height: 1 }
.login-title { text-align: center; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem }
.login-subtitle { text-align: center; font-size: 0.75rem; color: var(--z-500); margin-bottom: 1.5rem }
html.dark .login-subtitle { color: var(--z-400) }
.form-group { margin-bottom: 1rem }
.form-label { display: block; font-size: 0.75rem; color: var(--z-500); margin-bottom: 0.375rem }
html.dark .form-label { color: var(--z-400) }
.form-input { width: 100%; padding: 0.5rem 0.75rem; font-family: var(--font-mono); font-size: 0.875rem; background: var(--z-50); color: var(--z-900); border: 1px solid var(--z-300); border-radius: 0.25rem; outline: none; transition: border-color .15s }
.form-input:focus { border-color: var(--blue-500); box-shadow: 0 0 0 2px rgba(59,130,246,0.15) }
html.dark .form-input { background: var(--z-950); color: var(--z-100); border-color: var(--z-700) }
html.dark .form-input:focus { border-color: var(--blue-500); box-shadow: 0 0 0 2px rgba(59,130,246,0.2) }
.form-input::placeholder { color: var(--z-400) }
.login-btn { width: 100%; padding: 0.5rem; font-family: var(--font-mono); font-size: 0.875rem; font-weight: 600; background: var(--blue-500); color: #fff; border: none; border-radius: 0.25rem; cursor: pointer; transition: background .15s }
.login-btn:hover { background: var(--blue-600) }
.login-btn:active { transform: scale(0.98) }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed }
.login-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: var(--red-500); font-size: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem; text-align: center }
.footer { flex-shrink: 0; border-top: 1px solid var(--z-200); background: var(--z-50); padding: 0.5rem 1rem }
html.dark .footer { border-color: var(--z-800); background: var(--z-900) }
.footer-inner { display: flex; align-items: center; justify-content: center; gap: 1rem; font-size: 0.75rem; color: var(--z-500) }
.footer a { color: inherit; text-decoration: none; transition: color .15s }
.footer a:hover { color: var(--z-700) }
html.dark .footer a:hover { color: var(--z-300) }
@keyframes shake {
  0%, 100% { transform: translateX(0) }
  25% { transform: translateX(-4px) }
  75% { transform: translateX(4px) }
}
.login-error.shake { animation: shake 0.3s ease-in-out }
`;

const LOGIN_SCRIPT = `
var isDark = document.documentElement.classList.contains("dark");
if (!localStorage.getItem("theme")) { isDark = true; document.documentElement.classList.add("dark") }
else if (localStorage.getItem("theme") === "dark") { isDark = true; document.documentElement.classList.add("dark") }
else { isDark = false; document.documentElement.classList.remove("dark") }
updateThemeBtn();

function toggleTheme() {
  isDark = !isDark;
  if (isDark) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark") }
  else { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light") }
  updateThemeBtn();
}
function updateThemeBtn() { var b = document.getElementById("themeBtn"); if (b) b.textContent = isDark ? "\\u2600 \\u4eae\\u8272" : "\\u263e \\u6697\\u8272" }
function logout() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/logout", true);
  xhr.onload = function() { window.location.href = "/"; };
  xhr.onerror = function() { window.location.href = "/"; };
  xhr.send();
}

function handleLogin(e) {
  e.preventDefault();
  var user = document.getElementById("username").value;
  var pass = document.getElementById("password").value;
  if (!user || !pass) {
    showError("\\u8bf7\\u8f93\\u5165\\u7528\\u6237\\u540d\\u548c\\u5bc6\\u7801");
    return;
  }
  var btn = document.getElementById("loginBtn");
  btn.disabled = true;
  btn.textContent = "\\u767b\\u5f55\\u4e2d...";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status === 200) {
      var res;
      try { res = JSON.parse(xhr.responseText); } catch(ex) { res = {}; }
      window.location.href = res.redirect || "/";
    } else {
      var msg;
      try { msg = JSON.parse(xhr.responseText).error; } catch(ex) { msg = "\\u767b\\u5f55\\u5931\\u8d25"; }
      showError(msg);
      btn.disabled = false;
      btn.textContent = "\\u767b\\u5f55";
    }
  };
  xhr.onerror = function() {
    showError("\\u7f51络错误");
    btn.disabled = false;
    btn.textContent = "\\u767b\\u5f55";
  };
  xhr.send(JSON.stringify({ username: user, password: pass }));
}

function showError(msg) {
  var el = document.getElementById("errorMsg");
  el.textContent = msg;
  el.style.display = "block";
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
}
`;

export function generateLoginHtml(error) {
    const errorHtml = error
        ? '<div class="login-error" id="errorMsg" style="display:block">' + error + '</div>'
        : '<div class="login-error" id="errorMsg" style="display:none"></div>';

    return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n'
        + '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        + '<link rel="icon" href="https://img.zhaizz.top/file/avatar/obVInnoY.png">\n'
        + '<title>zzz\'s WebDAV - 登录</title>\n<style>' + LOGIN_CSS + '</style>\n</head>\n<body>\n'
        + '<header class="header"><div class="header-inner">'
        + '<div style="display:flex;align-items:center;gap:0.75rem;flex-shrink:0"><span class="header-title">zzz\'s WebDAV</span></div>'
        + '<div class="header-center"><span class="header-sub">WebDAV 存储</span></div>'
        + '<div class="header-actions"><button class="btn btn-ghost" id="themeBtn" onclick="toggleTheme()">☀ 亮色</button>'
        + '</div></div></header>\n'
        + '<div class="login-wrap"><div class="login-card">'
        + '<div class="login-title">登录</div>'
        + '<div class="login-subtitle">请输入账号和密码以访问 WebDAV 存储</div>'
        + errorHtml
        + '<form onsubmit="handleLogin(event)">'
        + '<div class="form-group"><label class="form-label" for="username">用户名</label>'
        + '<input class="form-input" type="text" id="username" name="username" autocomplete="username" autofocus></div>'
        + '<div class="form-group"><label class="form-label" for="password">密码</label>'
        + '<input class="form-input" type="password" id="password" name="password" autocomplete="current-password"></div>'
        + '<button type="submit" class="login-btn" id="loginBtn">登录</button>'
        + '</form>'
        + '</div></div>\n'
        + '<footer class="footer"><div class="footer-inner">'
        + '<span>Author: <a href="https://github.com/zhaizzH" target="_blank" rel="noopener noreferrer" style="color:var(--z-400)">zhaizzH</a></span>'
        + '<span class="footer-sep">|</span>'
        + '<span>Powered by <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" style="color:#f97316">Cloudflare</a></span>'
        + '</div></footer>\n'
        + '<script>' + LOGIN_SCRIPT + '</script>\n</body>\n</html>';
}
