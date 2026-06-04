/**
 * 认证模块 — Cookie 会话 + Basic Auth 兼容
 */
import { generateLoginHtml } from './lib/login.js';

/**
 * 从请求中提取凭证（Cookie 或 Basic Auth）
 * @returns {{ user: string, pass: string } | null}
 */
function extractCredentials(request) {
    // 优先检查 Cookie
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/session=([^;]+)/);
    if (match) {
        try {
            const decoded = atob(match[1]);
            const [user, pass] = decoded.split(':');
            if (user && pass) return { user, pass };
        } catch {}
    }

    // 回退到 Basic Auth
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        const [scheme, encoded] = authHeader.split(' ');
        if (scheme === 'Basic' && encoded) {
            try {
                const [user, pass] = atob(encoded).split(':');
                if (user && pass) return { user, pass };
            } catch {}
        }
    }

    return null;
}

/**
 * 验证凭证是否正确
 */
function validateCredentials(user, pass, env) {
    return user === env.WEBDAV_USER && pass === env.WEBDAV_PASS;
}

/**
 * 构建 session cookie 字符串
 */
function buildSessionCookie(user, pass) {
    const token = btoa(user + ':' + pass);
    return 'session=' + token + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800';
}

/**
 * 处理退出登录 — 清除 session cookie
 */
export function handleLogout() {
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
        },
    });
}

/**
 * 处理登录 POST 请求
 */
export function handleLogin(request, env) {
    return request.json().then(body => {
        const { username, password } = body || {};
        if (!username || !password) {
            return new Response(JSON.stringify({ error: '请输入用户名和密码' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!validateCredentials(username, password, env)) {
            return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true, redirect: '/' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': buildSessionCookie(username, password),
            },
        });
    });
}

/**
 * 认证检查 — 返回 Response 表示拒绝，返回 null 表示放行
 */
export function checkAuth(request, env) {
    const user = env.WEBDAV_USER;
    const pass = env.WEBDAV_PASS;
    if (!user || !pass) return null;

    const creds = extractCredentials(request);

    // 有效凭证 → 放行
    if (creds && validateCredentials(creds.user, creds.pass, env)) {
        return null;
    }

    // 浏览器 GET 请求 → 显示登录页面
    const accept = request.headers.get('Accept') || '';
    if (request.method === 'GET' && accept.includes('text/html')) {
        return new Response(generateLoginHtml(), {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }

    // 其他请求（WebDAV 客户端等）→ 401
    return new Response('Authorization required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="WebDAV"' },
    });
}
