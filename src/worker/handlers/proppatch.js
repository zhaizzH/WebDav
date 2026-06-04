/**
 * PROPPATCH — 属性修改（R2 不支持自定义属性，返回成功即可）
 */
export async function handleProppatch(request, env, r2Path) {
    // 文件不存在时也返回成功，兼容 Via 浏览器等客户端对尚未创建文件的操作

    const href = r2Path.startsWith('/') ? r2Path : '/' + r2Path;
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<D:multistatus xmlns:D="DAV:">
  <D:response>
    <D:href>${encodeURI(href)}</D:href>
    <D:propstat>
      <D:prop/>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>
</D:multistatus>`;

    return new Response(xml, {
        status: 207,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'DAV': '1, 2',
        },
    });
}
