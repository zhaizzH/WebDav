/**
 * OPTIONS — 返回 DAV 兼容头
 */
export function handleOptions() {
    return new Response('', {
        status: 200,
        headers: {
            'Allow': 'OPTIONS, GET, HEAD, PUT, DELETE, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK, UNLOCK',
            'DAV': '1, 2',
            'MS-Author-Via': 'DAV',
        },
    });
}
