/**
 * MOVE — 移动/重命名文件（R2 无原生 move，用 copy + delete 模拟）
 */
export async function handleMove(request, env, r2Path) {
    if (!r2Path || r2Path.endsWith('/')) {
        return new Response('Cannot move directory', { status: 400 });
    }

    const destination = request.headers.get('Destination');
    if (!destination) {
        return new Response('Missing Destination header', { status: 400 });
    }

    const destUrl = new URL(destination, request.url);
    const destPath = decodeURIComponent(destUrl.pathname).replace(/^\/+/, '');

    if (!destPath) {
        return new Response('Invalid destination', { status: 400 });
    }

    const sourcePath = r2Path.replace(/^\/+/, '');

    if (sourcePath === destPath) {
        return new Response(null, {
            status: 204,
            headers: { 'DAV': '1, 2' },
        });
    }

    try {
        const object = await env.R2.get(sourcePath);
        if (!object) {
            return new Response('Source not found', { status: 404 });
        }

        await env.R2.put(destPath, object.body, {
            httpMetadata: object.httpMetadata,
        });

        await env.R2.delete(sourcePath);

        return new Response(null, {
            status: 204,
            headers: { 'DAV': '1, 2' },
        });
    } catch (error) {
        return new Response(`MOVE failed: ${error.message}`, { status: 500 });
    }
}
