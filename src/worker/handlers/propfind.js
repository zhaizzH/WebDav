/**
 * PROPFIND — RFC 4918 兼容实现
 * 支持 Depth: 0（单资源属性）和 Depth: 1（子项列表）
 */
import { generateWebDAVXml, generateSingleResourceXml } from '../lib/xml.js';

export async function handlePropfind(request, env, r2Path) {
    const depth = request.headers.get('Depth') || '1';
    const prefix = r2Path === '/' ? '' : r2Path.replace(/^\/+/, '').replace(/\/+$/, '');
    const isRoot = !prefix;

    try {
        // Depth: 0 — 只返回资源自身的属性
        if (depth === '0') {
            return await handleDepthZero(env, r2Path, prefix, isRoot);
        }

        // Depth: 1 或 infinity — 列出子项
        return await handleDepthOne(env, r2Path, prefix, isRoot);
    } catch (error) {
        return new Response(`PROPFIND failed: ${error.message}`, { status: 500 });
    }
}

async function handleDepthZero(env, r2Path, prefix, isRoot) {
    const href = r2Path.startsWith('/') ? '/' + r2Path : '/' + r2Path;

    // 根目录
    if (isRoot || r2Path === '/') {
        const now = new Date();
        const xml = generateSingleResourceXml('/', {
            displayname: '',
            resourcetype: '<D:collection/>',
            creationdate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
            getlastmodified: now.toUTCString(),
            getetag: '"/"',
        });
        return new Response(xml, {
            status: 207,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'DAV': '1, 2',
            },
        });
    }

    // 检查是否是文件
    const object = await env.R2.head(r2Path);
    if (object) {
        const fileName = r2Path.split('/').pop();
        const mtime = object.customMetadata?.mtime
            ? new Date(Number(object.customMetadata.mtime))
            : new Date(object.lastModified?.getTime?.() || object.uploaded || Date.now());
        const contentType = object.httpMetadata?.contentType || 'application/octet-stream';

        const xml = generateSingleResourceXml(href, {
            displayname: fileName,
            resourcetype: '',
            creationdate: mtime.toISOString().replace(/\.\d{3}Z$/, 'Z'),
            getlastmodified: mtime.toUTCString(),
            getcontentlength: String(object.size),
            getcontenttype: contentType,
            getetag: '"' + href + '"',
        });
        return new Response(xml, {
            status: 207,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'DAV': '1, 2',
            },
        });
    }

    // 检查是否是目录前缀
    const listed = await env.R2.list({ prefix: prefix + '/', delimiter: '/', maxKeys: 1 });
    if (listed.objects.length > 0 || listed.delimitedPrefixes.length > 0) {
        // 是一个存在的目录
        const now = new Date();
        const xml = generateSingleResourceXml(href, {
            displayname: prefix.split('/').pop(),
            resourcetype: '<D:collection/>',
            creationdate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
            getlastmodified: now.toUTCString(),
            getetag: '"' + href + '"',
        });
        return new Response(xml, {
            status: 207,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'DAV': '1, 2',
            },
        });
    }

    // 不存在
    return new Response('Not Found', { status: 404 });
}

async function handleDepthOne(env, r2Path, prefix, isRoot) {
    const listed = await env.R2.list({ prefix: prefix ? prefix + '/' : '', delimiter: '/' });

    const files = [];
    const directories = [];

    for (const commonPrefix of listed.delimitedPrefixes) {
        const dirName = commonPrefix.replace(prefix ? prefix + '/' : '', '').replace(/\/$/, '');
        if (dirName) directories.push(dirName);
    }

    for (const obj of listed.objects) {
        const relativeKey = prefix ? obj.key.slice(prefix.length + 1) : obj.key;
        if (!relativeKey || relativeKey.includes('/')) continue;
        if (relativeKey === '.clistr') continue;

        const mtime = obj.customMetadata?.mtime
            ? Number(obj.customMetadata.mtime)
            : (obj.lastModified?.getTime?.() || Date.now());
        files.push({
            name: relativeKey,
            metadata: {
                FileSizeBytes: String(obj.size),
                FileSize: (obj.size / (1024 * 1024)).toFixed(2),
                TimeStamp: String(mtime),
                FileType: obj.httpMetadata?.contentType || 'application/octet-stream',
            },
        });
    }

    const basePath = !r2Path || r2Path === '/'
        ? '/'
        : (r2Path.endsWith('/') ? '/' + r2Path.replace(/^\/+/, '') : '/' + r2Path.replace(/^\/+/, '') + '/');

    const xml = generateWebDAVXml(basePath, files, directories, isRoot);
    return new Response(xml, {
        status: 207,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'DAV': '1, 2',
        },
    });
}
