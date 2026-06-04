# WebDAV over R2

部署在 Cloudflare Worker 上的 WebDAV 服务器，使用 R2 作为文件存储后端。支持浏览器 Web 界面浏览和标准 WebDAV 客户端访问。

## 功能

- 完整的 WebDAV 协议支持（RFC 4918）
- 浏览器 Web 界面（目录浏览、文件上传/下载/删除、新建文件/文件夹）
- 深色/浅色主题切换
- Basic Auth + Cookie 会话认证
- 文件类型图标识别
- LOCK/UNLOCK 存根实现，兼容主流 WebDAV 客户端
- 支持的 WebDAV 方法：`GET` `HEAD` `PUT` `DELETE` `PROPFIND` `PROPPATCH` `MKCOL` `COPY` `MOVE` `LOCK` `UNLOCK` `OPTIONS`

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) >= 18
- [Cloudflare 账号](https://dash.cloudflare.com/)（免费版即可）
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### 1. 创建 R2 存储桶

```bash
npx wrangler r2 bucket create webdav
```

### 2. 配置 `wrangler.toml`

编辑 `wrangler.toml`，填入你的 Cloudflare Account ID：

```toml
name = "webdav"
main = "src/worker/index.js"
compatibility_date = "2026-06-04"

[[r2_buckets]]
binding = "R2"
bucket_name = "webdav"

[vars]
WEBDAV_USER = "admin"
WEBDAV_PASS = "your-password-here"
```

### 3. 部署

```bash
# 本地开发
npm run dev

# 部署到 Cloudflare
npm run deploy
```

### 4. 访问

- **浏览器**：打开 Worker URL，输入用户名密码登录，即可浏览和管理文件。
- **WebDAV 客户端**：使用任意支持 WebDAV 的客户端（如 Cyberduck、Files、WinSCP、Explorer 等）连接 Worker URL，使用 Basic Auth 认证。

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `WEBDAV_USER` | WebDAV 用户名 | `admin` |
| `WEBDAV_PASS` | WebDAV 密码 | `password` |

> 部署前请务必修改默认密码。

## 项目结构

```
src/worker/
├── index.js               入口 + 路由分发
├── auth.js                认证模块（Cookie 会话 + Basic Auth）
├── handlers/              WebDAV 方法处理
│   ├── get.js             GET — 文件下载
│   ├── head.js            HEAD — 资源元信息
│   ├── put.js             PUT — 文件上传/覆盖
│   ├── delete.js          DELETE — 删除文件/目录
│   ├── propfind.js        PROPFIND — 资源属性查询
│   ├── proppatch.js       PROPPATCH — 属性修改
│   ├── mkcol.js           MKCOL — 创建目录
│   ├── copy.js            COPY — 复制资源
│   ├── move.js            MOVE — 移动/重命名资源
│   └── options.js         OPTIONS — CORS + DAV 能力声明
└── lib/                   生成层
    ├── xml.js             WebDAV XML 响应生成（RFC 4918）
    ├── html.js            浏览器 Web 界面生成
    ├── login.js           登录页面生成
    └── utils.js           工具函数（HTML 转义、文件大小格式化、图标映射等）
```
## 许可证

MIT
