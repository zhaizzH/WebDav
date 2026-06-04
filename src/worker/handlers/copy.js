/**
 * COPY — 复制文件（R2 无原生 copy，用 get + put 模拟）
 */
export async function handleCopy(request, env, r2Path) {
    if (!r2Path || r2Path.endsWith('/')) {
        return new Response('Cannot copy directory', { status: 400 });
    }

    const destination = request.headers.get('Destination');
    if (!destination) {
        return new Response('Missing Destination header', { status: 400 });
    }

    // 解析目标路径
    const destUrl = new URL(destination, request.url);
    const destPath = decodeURIComponent(destUrl.pathname).replace(/^\/+/, '');

    if (!destPath) {
        return new Response('Invalid destination', { status: 400 });
    }

    const sourcePath = r2Path.replace(/^\/+/, '');

    try {
        const object = await env.R2.get(sourcePath);
        if (!object) {
            return new Response('Source not found', { status: 404 });
        }

        await env.R2.put(destPath, object.body, {
            httpMetadata: object.httpMetadata,
        });

        return new Response(null, {
            status: 204,
            headers: { 'DAV': '1, 2' },
        });
    } catch (error) {
        return new Response(`COPY failed: ${error.message}`, { status: 500 });
    }
}
