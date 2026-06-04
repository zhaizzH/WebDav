/**
 * HEAD — 获取文件元信息（无响应体）
 */
export async function handleHead(env, r2Path) {
    if (!r2Path || r2Path.endsWith('/')) {
        return new Response(null, { status: 200, headers: { 'DAV': '1, 2' } });
    }

    const object = await env.R2.head(r2Path);
    if (!object) {
        return new Response(null, {
            status: 200,
            headers: { 'DAV': '1, 2', 'Content-Length': '0', 'Content-Type': 'application/octet-stream' },
        });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('content-length', String(object.size));
    headers.set('DAV', '1, 2');
    headers.set('Accept-Ranges', 'bytes');

    const mtime = object.customMetadata?.mtime
        ? new Date(Number(object.customMetadata.mtime))
        : new Date(object.lastModified?.getTime?.() || object.uploaded || Date.now());
    headers.set('Last-Modified', mtime.toUTCString());

    return new Response(null, { status: 200, headers });
}
