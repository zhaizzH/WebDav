/**
 * WebDAV XML 生成 — RFC 4918 兼容
 */

const SUPPORTED_LOCK = '<D:supportedlock><D:lockentry><D:lockscope><D:exclusive/></D:lockscope><D:locktype><D:write/></D:locktype></D:lockentry></D:supportedlock>';
const LOCK_DISCOVERY = '<D:lockdiscovery/>';
const GET_CONTENT_LANG = '<D:getcontentlanguage>zh</D:getcontentlanguage>';

function isoDate(d) {
    return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function generateWebDAVXml(basePath, files, directories, isRoot) {
    let responses = '';
    responses += collectionXml(basePath, true);
    for (const dir of directories) {
        responses += collectionXml(`${basePath}${dir}/`, false);
    }
    for (const file of files) {
        responses += fileXml(basePath, file);
    }
    return `<?xml version="1.0" encoding="utf-8"?>` +
        `<D:multistatus xmlns:D="DAV:">${responses}</D:multistatus>`;
}

function collectionXml(path, isRoot) {
    const now = new Date();
    const name = path === '/' ? '' : path.split('/').filter(Boolean).pop() || '';
    const href = path.startsWith('/') ? path : '/' + path;
    const etag = '"' + path + '"';
    return `<D:response>` +
        `<D:href>${encodeURI(href)}</D:href>` +
        `<D:propstat><D:prop>` +
        `<D:displayname>${name}</D:displayname>` +
        `<D:resourcetype><D:collection/></D:resourcetype>` +
        `<D:creationdate>${isoDate(now)}</D:creationdate>` +
        `<D:getlastmodified>${now.toUTCString()}</D:getlastmodified>` +
        `<D:getetag>${etag}</D:getetag>` +
        SUPPORTED_LOCK +
        LOCK_DISCOVERY +
        GET_CONTENT_LANG +
        `</D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat>` +
        `</D:response>`;
}

function fileXml(basePath, file) {
    const timestamp = file.metadata?.TimeStamp
        ? new Date(Number(file.metadata.TimeStamp))
        : new Date();
    const contentType = file.metadata?.FileType || 'application/octet-stream';
    const fileSize = file.metadata?.FileSizeBytes || '0';
    const filePath = `${basePath}${file.name}`;
    const href = filePath.startsWith('/') ? filePath : '/' + filePath;
    const etag = '"' + filePath + '"';

    return `<D:response>` +
        `<D:href>${encodeURI(href)}</D:href>` +
        `<D:propstat><D:prop>` +
        `<D:displayname>${file.name}</D:displayname>` +
        `<D:resourcetype/>` +
        `<D:creationdate>${isoDate(timestamp)}</D:creationdate>` +
        `<D:getlastmodified>${timestamp.toUTCString()}</D:getlastmodified>` +
        `<D:getcontentlength>${fileSize}</D:getcontentlength>` +
        `<D:getcontenttype>${contentType}</D:getcontenttype>` +
        `<D:getetag>${etag}</D:getetag>` +
        SUPPORTED_LOCK +
        LOCK_DISCOVERY +
        GET_CONTENT_LANG +
        `</D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat>` +
        `</D:response>`;
}

/**
 * 生成单个资源的 PROPFIND Depth:0 响应
 */
export function generateSingleResourceXml(href, props) {
    const propEntries = Object.entries(props).map(([tag, val]) => `<D:${tag}>${val}</D:${tag}>`).join('');
    return `<?xml version="1.0" encoding="utf-8"?>` +
        `<D:multistatus xmlns:D="DAV:">` +
        `<D:response>` +
        `<D:href>${encodeURI(href)}</D:href>` +
        `<D:propstat><D:prop>${propEntries}${SUPPORTED_LOCK}${LOCK_DISCOVERY}${GET_CONTENT_LANG}</D:prop>` +
        `<D:status>HTTP/1.1 200 OK</D:status></D:propstat>` +
        `</D:response></D:multistatus>`;
}
