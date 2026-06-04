/**
 * GET — 下载文件 / HTML 目录浏览
 */
import { generateDirectoryHtml } from '../lib/html.js';

export async function handleGet(request, env, r2Path) {
    if (!r2Path || r2Path.endsWith('/')) {
        return handleGetDirectory(env, r2Path || '/');
    }

    const object = await env.R2.get(r2Path);
    if (!object) {
        return new Response(null, {
            status: 200,
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/octet-stream',
            },
        });
    }

    const fileName = r2Path.split('/').pop();
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent(fileName) + '"');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', '*');

    // 设置 Last-Modified
    const mtime = object.customMetadata?.mtime
        ? new Date(Number(object.customMetadata.mtime))
        : new Date(object.lastModified?.getTime?.() || object.uploaded || Date.now());
    headers.set('Last-Modified', mtime.toUTCString());

    return new Response(object.body, { headers });
}

async function handleGetDirectory(env, r2Path) {
    const prefix = r2Path === '/' ? '' : r2Path.replace(/^\/+/, '').replace(/\/+$/, '');
    const listed = await env.R2.list({ prefix: prefix ? prefix + '/' : '', delimiter: '/' });

    const basePath = !r2Path || r2Path === '/' ? '' : (r2Path.endsWith('/') ? r2Path : r2Path + '/');
    const dirs = [];
    const files = [];

    for (const commonPrefix of listed.delimitedPrefixes) {
        const dirName = commonPrefix.replace(prefix ? prefix + '/' : '', '').replace(/\/$/, '');
        if (dirName) dirs.push(dirName);
    }
    for (const obj of listed.objects) {
        const relativeKey = prefix ? obj.key.slice(prefix.length + 1) : obj.key;
        if (!relativeKey || relativeKey.includes('/')) continue;
        if (relativeKey === '.clistr') continue;
        const mtime = obj.customMetadata?.mtime
            ? new Date(Number(obj.customMetadata.mtime))
            : (obj.lastModified || new Date(obj.uploaded));
        files.push({ name: relativeKey, size: obj.size, lastModified: mtime });
    }

    const html = generateDirectoryHtml(basePath, dirs, files);
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
