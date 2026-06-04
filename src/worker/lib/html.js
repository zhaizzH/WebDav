/**
 * HTML 页面生成 — CSS + JS + 目录浏览页面
 */
import { escapeHtml, formatFileSize, formatDate, getFileIcon } from './utils.js';

const PAGE_CSS = `
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
.layout { display: flex; flex: 1; overflow: hidden; position: relative }
.main { flex: 1; background: var(--z-50); min-width: 0; overflow: hidden; display: flex; flex-direction: column }
html.dark .main { background: var(--z-900) }
.toolbar { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-bottom: 1px solid var(--z-200); background: rgba(255,255,255,0.5); flex-shrink: 0 }
html.dark .toolbar { border-color: var(--z-800); background: rgba(24,24,27,0.5) }
.crumbs { display: flex; align-items: center; gap: 0; font-size: 0.875rem; overflow-x: auto; min-width: 0; flex: 1 }
.crumb-sep { color: var(--z-400); margin: 0; padding: 0 0.125rem }
html.dark .crumb-sep { color: var(--z-600) }
.crumb-link { background: none; border: none; color: var(--blue-500); cursor: pointer; font-family: inherit; font-size: inherit; padding: 0 }
.crumb-link:hover { color: var(--blue-400) }
.tb-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0 }
.btn { font-family: var(--font-mono); font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 0.25rem; cursor: pointer; transition: all .15s; border: none; outline: none }
.btn-ghost { background: transparent; color: var(--z-500) }
.btn-ghost:hover { color: var(--z-700) }
html.dark .btn-ghost:hover { color: var(--z-300) }
.table-wrap { flex: 1; overflow: auto }
.file-table { width: 100%; font-size: 0.875rem }
.file-table thead { position: sticky; top: 0; z-index: 10 }
.file-table th { text-align: left; padding: 0.5rem 1rem; font-weight: 400; font-size: 0.75rem; color: var(--z-500); border-bottom: 1px solid var(--z-200); background: var(--z-50) }
html.dark .file-table th { border-color: var(--z-800); background: var(--z-900) }
.td-size { width: 6rem; text-align: right }
.td-date { width: 11rem; text-align: right }
.td-action { width: 6rem; text-align: right }
.file-table td { padding: 0.5rem 1rem; border-bottom: 1px solid var(--z-100) }
html.dark .file-table td { border-color: var(--z-800-50) }
.file-row:hover td { background: var(--z-100) }
html.dark .file-row:hover td { background: var(--z-800-30) }
.name-btn { background: none; border: none; cursor: pointer; font-family: inherit; font-size: inherit; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0 }
.folder-name { color: var(--blue-500) }
.folder-name:hover { color: var(--blue-400) }
.file-name { color: var(--z-700) }
html.dark .file-name { color: var(--z-300) }
.icon { font-size: 1rem }
.folder-icon { color: var(--yellow-500) }
.action-btn { color: var(--z-400); background: none; border: none; cursor: pointer; padding: 0.25rem; font-size: 0.875rem; transition: color .15s }
.action-btn:hover { color: var(--blue-500) }
html.dark .action-btn { color: var(--z-500) }
.empty { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--z-400); font-size: 0.875rem }
html.dark .empty { color: var(--z-600) }
.progress-wrap { display: none; padding: 0.5rem 1rem; border-bottom: 1px solid var(--z-200); background: var(--z-50) }
html.dark .progress-wrap { border-color: var(--z-800); background: var(--z-900) }
.progress-bar-bg { height: 4px; background: var(--z-200); border-radius: 2px; overflow: hidden }
html.dark .progress-bar-bg { background: var(--z-700) }
.progress-bar { height: 100%; background: var(--blue-500); width: 0; transition: width 0.15s }
.progress-text { font-size: 0.75rem; color: var(--z-500); margin-top: 0.25rem; text-align: right }
.footer { flex-shrink: 0; border-top: 1px solid var(--z-200); background: var(--z-50); padding: 0.5rem 1rem }
html.dark .footer { border-color: var(--z-800); background: var(--z-900) }
.footer-inner { display: flex; align-items: center; justify-content: center; gap: 1rem; font-size: 0.75rem; color: var(--z-500) }
.footer-sep { color: var(--z-300) }
html.dark .footer-sep { color: var(--z-700) }
.footer a { color: inherit; text-decoration: none; transition: color .15s }
.footer a:hover { color: var(--z-700) }
html.dark .footer a:hover { color: var(--z-300) }
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal }
html.dark::view-transition-old(root) { z-index: 2147483646 }
html.dark::view-transition-new(root) { z-index: 1 }
html:not(.dark)::view-transition-old(root) { z-index: 1 }
html:not(.dark)::view-transition-new(root) { z-index: 2147483646 }
`;

const PAGE_SCRIPT = `
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
function updateThemeBtn() { var b = document.getElementById("themeBtn"); if (b) b.textContent = isDark ? "☀ 亮色" : "☾ 暗色" }
function logout() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/logout", true);
  xhr.onload = function() { window.location.href = "/"; };
  xhr.onerror = function() { window.location.href = "/"; };
  xhr.send();
}
function formatTimes() {
  document.querySelectorAll("[data-time]").forEach(function(el) {
    var ts = parseInt(el.getAttribute("data-time"), 10);
    if (ts) el.textContent = new Date(ts).toLocaleString("zh-CN");
  });
}
function navigateTo(p) { window.location.href = p ? "/" + p + "/" : "/" }
function navigateToUrl(u) { window.location.href = u }

function downloadFile(p) {
  var a = document.createElement("a");
  a.href = p;
  a.download = p.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function deleteItem(p) {
  if (!confirm("确定要删除吗？")) return;
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", p, true);
  xhr.onload = function() {
    if (xhr.status === 204 || xhr.status === 200) { window.location.reload(); }
    else { alert("删除失败: " + xhr.status + " " + xhr.statusText); }
  };
  xhr.onerror = function() { alert("网络错误"); };
  xhr.send();
}

function uploadFile() {
  var input = document.getElementById("fileInput");
  if (input.files.length === 0) { alert("请选择文件"); return; }
  var file = input.files[0];
  var basePath = window.location.pathname.replace(/^\\//, "").replace(/\\/$/, "");
  var uploadPath = basePath ? basePath + "/" + encodeURIComponent(file.name) : encodeURIComponent(file.name);
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "/" + uploadPath, true);
  xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
  xhr.onload = function() {
    if (xhr.status === 201) { window.location.reload(); }
    else { alert("上传失败: " + xhr.status); }
  };
  xhr.onerror = function() { alert("网络错误"); };
  var progressBar = document.getElementById("progressBar");
  var progressWrap = document.getElementById("progressWrap");
  progressWrap.style.display = "block";
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      var pct = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = pct + "%";
      document.getElementById("progressText").textContent = pct + "%";
    }
  };
  xhr.send(file);
}

function createNew() {
  var name = prompt("请输入文件名（如 notes.txt）：");
  if (!name) return;
  name = name.replace(/^\\//, "");
  var basePath = window.location.pathname.replace(/^\\//, "").replace(/\\/$/, "");
  var newPath = basePath ? basePath + "/" + encodeURIComponent(name) : encodeURIComponent(name);
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "/" + newPath, true);
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.onload = function() {
    if (xhr.status === 201) { window.location.reload(); }
    else { alert("创建失败: " + xhr.status); }
  };
  xhr.onerror = function() { alert("网络错误"); };
  xhr.send();
}

function createNewFolder() {
  var name = prompt("请输入文件夹名称：");
  if (!name) return;
  name = name.replace(/^\\//, "").replace(/\\/$/, "");
  var basePath = window.location.pathname.replace(/^\\//, "").replace(/\\/$/, "");
  var newPath = basePath ? basePath + "/" + encodeURIComponent(name) + "/" : encodeURIComponent(name) + "/";
  var xhr = new XMLHttpRequest();
  xhr.open("MKCOL", "/" + newPath, true);
  xhr.onload = function() {
    if (xhr.status === 201 || xhr.status === 200) { window.location.reload(); }
    else { alert("创建文件夹失败: " + xhr.status); }
  };
  xhr.onerror = function() { alert("网络错误"); };
  xhr.send();
}
formatTimes();
`;

export function generateDirectoryHtml(basePath, dirs, files) {
    const pathParts = basePath.split('/').filter(Boolean);
    let breadcrumbHtml = '<button onclick="navigateTo(\'\')" class="crumb-link">Root</button>';
    let accumulated = '';
    for (const part of pathParts) {
        accumulated += '/' + part;
        const p = accumulated.substring(1);
        breadcrumbHtml += '<span class="crumb-sep">/</span><button onclick="navigateTo(\'' + escapeHtml(p) + '\')" class="crumb-link">' + escapeHtml(part) + '</button>';
    }

    let tableRows = '';

    if (basePath) {
        const parts = basePath.replace(/\/+$/, '').split('/');
        parts.pop();
        const parentNav = parts.join('/');
        tableRows += '<tr class="file-row">'
            + '<td class="td-name"><button onclick="navigateTo(\'' + escapeHtml(parentNav) + '\')" class="name-btn folder-name"><span class="icon folder-icon">&#128193;</span>../</button></td>'
            + '<td class="td-size">-</td><td class="td-date">-</td><td class="td-action"></td></tr>';
    }

    for (const dir of dirs) {
        const fullDirPath = '/' + basePath + dir + '/';
        tableRows += '<tr class="file-row">'
            + '<td class="td-name"><button onclick="navigateTo(\'' + escapeHtml(basePath + dir) + '\')" class="name-btn folder-name"><span class="icon folder-icon">&#128193;</span>' + escapeHtml(dir) + '/</button></td>'
            + '<td class="td-size">-</td><td class="td-date">-</td>'
            + '<td class="td-action"><button onclick="deleteItem(\'' + escapeHtml(fullDirPath) + '\')" class="action-btn" title="删除">&#128465;</button></td></tr>';
    }

    for (const file of files) {
        const fullFilePath = '/' + basePath + file.name;
        const fileSize = formatFileSize(file.size);
        const mtimeTs = file.lastModified ? new Date(file.lastModified).getTime() : 0;
        const icon = getFileIcon(file.name);
        tableRows += '<tr class="file-row">'
            + '<td class="td-name"><span class="name-btn file-name"><span class="icon">' + icon + '</span>' + escapeHtml(file.name) + '</span></td>'
            + '<td class="td-size">' + fileSize + '</td>'
            + '<td class="td-date" data-time="' + mtimeTs + '">' + (mtimeTs ? '' : '-') + '</td>'
            + '<td class="td-action"><button onclick="downloadFile(\'' + escapeHtml(fullFilePath) + '\')" class="action-btn" title="下载">&#8595;</button> '
            + '<button onclick="deleteItem(\'' + escapeHtml(fullFilePath) + '\')" class="action-btn" title="删除">&#128465;</button></td></tr>';
    }

    const isEmpty = files.length === 0 && dirs.length === 0 && !basePath;

    return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n'
        + '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        + '<link rel="icon" href="https://img.zhaizz.top/file/avatar/obVInnoY.png">\n'
        + '<title>zzz\'s WebDAV</title>\n<style>' + PAGE_CSS + '</style>\n</head>\n<body>\n'
        + '<header class="header"><div class="header-inner">'
        + '<div style="display:flex;align-items:center;gap:0.75rem;flex-shrink:0"><span class="header-title">CList</span></div>'
        + '<div class="header-center"><span class="header-sub">WebDAV 存储</span></div>'
        + '<div class="header-actions"><button class="btn btn-ghost" id="themeBtn" onclick="toggleTheme()">☀ 亮色</button>'
        + '<button class="btn btn-ghost" onclick="logout()">退出</button>'
        + '</div></div></header>\n'
        + '<div class="layout"><main class="main">'
        + '<div class="toolbar"><div class="crumbs">' + breadcrumbHtml + '</div>'
        + '<div class="tb-actions">'
        + '<button class="btn btn-ghost" onclick="window.location.reload()">刷新</button>'
        + '<button class="btn btn-ghost" onclick="createNew()">新建</button>'
        + '<button class="btn btn-ghost" onclick="createNewFolder()">新建文件夹</button>'
        + '<label class="btn" style="background:var(--blue-500);color:#fff;cursor:pointer">上传<input type="file" id="fileInput" onchange="uploadFile()" style="display:none"></label>'
        + '</div></div>'
        + '<div class="progress-wrap" id="progressWrap"><div class="progress-bar-bg"><div class="progress-bar" id="progressBar"></div></div><div class="progress-text" id="progressText">0%</div></div>'
        + '<div class="table-wrap">'
        + (isEmpty
            ? '<div class="empty">文件夹为空</div>'
            : '<table class="file-table"><thead><tr><th>名称</th><th class="td-size">大小</th><th class="td-date">修改时间</th><th class="td-action">操作</th></tr></thead><tbody>' + tableRows + '</tbody></table>')
        + '</div></main></div>'
        + '<footer class="footer"><div class="footer-inner">'
        + '<span>Author <a href="https://github.com/zhaizzH" target="_blank" rel="noopener noreferrer" style="color:var(--z-400)">zhaizzH</a></span>'
        + '<span class="footer-sep">|</span>'
        + '<span>Powered by <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" style="color:#f97316">Cloudflare</a></span>'
        + '</div></footer>\n'
        + '<script>' + PAGE_SCRIPT + '</script>\n</body>\n</html>';
}
