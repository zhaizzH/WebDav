/**
 * PUT — 上传文件（RFC 4918 兼容）
 */
export async function handlePut(request, env, r2Path) {
    if (!r2Path || r2Path === '/' || r2Path.endsWith('/')) {
        return new Response('Invalid file path', { status: 400 });
    }

    const cleanPath = r2Path.replace(/^\/+/, '');
    if (cleanPath.includes('..')) {
        return new Response('Invalid path', { status: 400 });
    }

    const contentType = request.headers.get('Content-Type') || 'application/octet-stream';
    const existing = await env.R2.head(cleanPath);
    await env.R2.put(cleanPath, request.body, {
        httpMetadata: { contentType },
        customMetadata: { mtime: String(Date.now()) },
    });

    const status = existing ? 200 : 201;
    const href = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
    const headers = new Headers();
    headers.set('etag', '"' + href + '"');
    headers.set('Location', href);
    headers.set('DAV', '1, 2');

    return new Response('', { status, headers });
}
