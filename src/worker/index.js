/**
 * WebDAV over R2 — Cloudflare Worker 入口
 *
 * 路由层：将请求分发到对应的 handler。
 * 详细实现见 handlers/ 和 lib/ 目录。
 *
 * @type {ExportedHandler<{ R2: R2Bucket }>}
 */
import { checkAuth, handleLogin, handleLogout } from './auth.js';
import { handleOptions } from './handlers/options.js';
import { handlePropfind } from './handlers/propfind.js';
import { handleProppatch } from './handlers/proppatch.js';
import { handleGet } from './handlers/get.js';
import { handleHead } from './handlers/head.js';
import { handlePut } from './handlers/put.js';
import { handleDelete } from './handlers/delete.js';
import { handleMkcol } from './handlers/mkcol.js';
import { handleCopy } from './handlers/copy.js';
import { handleMove } from './handlers/move.js';

/**
 * LOCK — 存根实现，返回假锁令牌以兼容客户端
 */
function handleLock(request, r2Path) {
    const token = '<urn:uuid:' + crypto.randomUUID() + '>';
    const href = r2Path ? '/' + r2Path : '/';
    const xml = `<?xml version="1.0" encoding="utf-8"?>` +
        `<D:multistatus xmlns:D="DAV:">` +
        `<D:response>` +
        `<D:href>${encodeURI(href)}</D:href>` +
        `<D:propstat><D:prop>` +
        `<D:lockdiscovery><D:activelock>` +
        `<D:lockscope><D:exclusive/></D:lockscope>` +
        `<D:locktype><D:write/></D:locktype>` +
        `<D:locktoken><D:href>${token}</D:href></D:locktoken>` +
        `<D:timeout>Second-3600</D:timeout>` +
        `</D:activelock></D:lockdiscovery>` +
        `</D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat>` +
        `</D:response></D:multistatus>`;
    return new Response(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Lock-Token': token,
            'DAV': '1, 2',
        },
    });
}

/**
 * UNLOCK — 存根实现，始终返回成功
 */
function handleUnlock() {
    return new Response('', {
        status: 200,
        headers: { 'DAV': '1, 2' },
    });
}

export default {
    async fetch(request, env, ctx) {
        // 登录/退出接口 — 在认证检查之前处理
        const url = new URL(request.url);
        if (request.method === 'POST' && url.pathname === '/login') {
            return handleLogin(request, env);
        }
        if (request.method === 'POST' && url.pathname === '/logout') {
            return handleLogout();
        }

        const authResponse = checkAuth(request, env);
        if (authResponse) return authResponse;

        const r2Path = decodeURIComponent(new URL(request.url).pathname || '/')
            .replace(/\/+/g, '/')
            .replace(/^\/+/, '');

        switch (request.method) {
            case 'OPTIONS':   return handleOptions();
            case 'PROPFIND':  return handlePropfind(request, env, r2Path);
            case 'PROPPATCH': return handleProppatch(request, env, r2Path);
            case 'GET':       return handleGet(request, env, r2Path);
            case 'HEAD':      return handleHead(env, r2Path);
            case 'PUT':       return handlePut(request, env, r2Path);
            case 'DELETE':    return handleDelete(env, r2Path);
            case 'MKCOL':     return handleMkcol(env, r2Path);
            case 'COPY':      return handleCopy(request, env, r2Path);
            case 'MOVE':      return handleMove(request, env, r2Path);
            case 'LOCK':      return handleLock(request, r2Path);
            case 'UNLOCK':    return handleUnlock();
            default: {
                const allow = 'OPTIONS, GET, HEAD, PUT, DELETE, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK, UNLOCK';
                return new Response('Method Not Allowed', {
                    status: 405,
                    headers: { Allow: allow },
                });
            }
        }
    },
};
