/**
 * MKCOL — 创建目录
 * R2 无真实目录概念，通过在目录下创建占位文件使其可见。
 */
export async function handleMkcol(env, r2Path) {
    const cleanPath = r2Path.replace(/^\/+/, '').replace(/\/+$/, '');
    if (!cleanPath) {
        return new Response('Cannot create root', { status: 400 });
    }

    // 创建占位文件，使目录在 R2 列表中可见
    const placeholderKey = cleanPath + '/.clistr';
    const existing = await env.R2.head(placeholderKey);
    if (!existing) {
        await env.R2.put(placeholderKey, null, {
            httpMetadata: { contentType: 'application/x-clistr-dir' },
        });
    }

    return new Response(null, {
        status: 201,
        headers: { 'DAV': '1, 2' },
    });
}
