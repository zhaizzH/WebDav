/**
 * DELETE — 删除文件或目录
 */
export async function handleDelete(env, r2Path) {
    const cleanPath = r2Path.replace(/^\/+/, '').replace(/\/+$/, '');
    if (!cleanPath) return new Response('Cannot delete root', { status: 400 });

    if (r2Path.endsWith('/')) {
        const prefix = cleanPath + '/';
        let cursor;
        do {
            const listed = await env.R2.list({ prefix, cursor });
            if (listed.objects.length > 0) {
                await env.R2.delete(listed.objects.map((o) => o.key));
            }
            cursor = listed.truncated ? listed.cursor : undefined;
        } while (cursor);
    } else {
        await env.R2.delete(cleanPath);
    }

    return new Response(null, {
        status: 204,
        headers: { 'DAV': '1, 2' },
    });
}
