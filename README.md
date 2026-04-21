# sub-convert

一个防止节点泄漏的订阅转换小工具，**同时支持 Cloudflare Worker / Pages 与 Docker 自托管** [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/jwyGithub/sub-convert)

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/jwyGithub/sub-convert/cloudflare-release.yml?label=cloudflare" alt='cloudflare build'>
  <img src="https://img.shields.io/github/actions/workflow/status/jwyGithub/sub-convert/docker-release.yml?label=docker" alt='docker build'>
  <img src="https://img.shields.io/github/issues/jwyGithub/sub-convert" alt='issues'>
  <img src="https://img.shields.io/github/license/jwyGithub/sub-convert" alt='license'>
</p>

## ✨ 功能特点

### 📌 在线体验

体验地址：[https://convert.looby.dpdns.org](https://convert.looby.dpdns.org)

### 📌 支持的协议类型

| 协议         | 状态 | url      | base64   | yaml/yml |
| ------------ | ---- | -------- | -------- | -------- |
| VLESS        | ✅   | 完全支持 | 完全支持 | 已测试   |
| VMess        | ✅   | 完全支持 | 完全支持 | 已测试   |
| Trojan       | ✅   | 完全支持 | 完全支持 | 已测试   |
| Shadowsocks  | ✅   | 完全支持 | 完全支持 | 已测试   |
| ShadowsocksR | ✅   | 完全支持 | 完全支持 | 已测试   |
| Hysteria     | ✅   | 完全支持 | 完全支持 | 已测试   |
| Hysteria2    | ✅   | 完全支持 | 完全支持 | 已测试   |
| HY2          | ✅   | 完全支持 | 完全支持 | 已测试   |

### 📦 订阅格式转换支持

- ✅ Base64 编码
- ✅ YAML 配置
- 🚧 JSON 配置

### 🔄 支持转换的客户端

- ✅ Clash
- ✅ sing-box
- ✅ v2ray

## 🏗 架构

项目采用 Hono 作为 HTTP 层，通过 **Adapter 模式**同时适配两套运行时：

```text
┌────────────────────────────────────────────────┐
│          src/app.ts  (Hono app factory)        │
│  routes · middleware · UrlService · IUrlRepo   │
└───────────────┬──────────────────┬─────────────┘
                │                  │
     ┌──────────▼───────┐   ┌──────▼──────────┐
     │  cloudflare.ts   │   │    node.ts      │
     │  (CF Worker)     │   │ @hono/node-server│
     │  D1 Repository   │   │ node:sqlite     │
     └──────────────────┘   └─────────────────┘
                │                  │
     ┌──────────▼───────┐   ┌──────▼──────────┐
     │ dist/worker/     │   │ dist/node/      │
     │   _worker.js     │   │   server.mjs    │
     └──────────────────┘   └─────────────────┘
```

构建产物统一输出到 `dist/`，由 tsdown 一个配置文件产出两套，详见 `tsdown.config.ts`。

## ⚙️ 配置说明

### 环境变量配置（通用）

| 变量名            | 说明                             | 默认值              | 必填 | 备注                               |
| ----------------- | -------------------------------- | ------------------- | ---- | ---------------------------------- |
| `BACKEND`         | 转换时的后端服务地址             | `https://url.v1.mk` | ❌   | 真正执行转换的服务地址             |
| `DEFAULT_BACKEND` | 默认后端服务地址                 | worker服务地址      | ❌   |                                    |
| `LOCK_BACKEND`    | 是否锁定后端服务                 | `false`             | ❌   |                                    |
| `CUSTOM_BACKEND`  | 自定义后端服务地址(支持多行配置) | 无                  | ❌   | 每行填写一个                       |
| `REMOTE_CONFIG`   | 自定义远程配置<br>(支持多行配置) | `https://xxxxx1`    | ❌   |                                    |
| `CHUNK_COUNT`     | 节点批量处理分片大小             | `20`                | ❌   |                                    |

### 短链服务开关

| 运行环境             | 开关方式                                                       | 数据库            |
| -------------------- | -------------------------------------------------------------- | ----------------- |
| Cloudflare Worker    | 在 `wrangler.jsonc` 绑定 `DB`（D1）                            | Cloudflare D1     |
| Docker / Node        | 设置 `DATABASE_DRIVER=sqlite`（默认值）                        | `node:sqlite` 本地文件 |

### Docker / Node 专属变量

| 变量名              | 说明                          | 默认值                      |
| ------------------- | ----------------------------- | --------------------------- |
| `DATABASE_DRIVER`   | 数据库驱动，留空则关闭短链    | `sqlite`                    |
| `SQLITE_PATH`       | SQLite 数据库文件路径         | `/data/sub-convert.sqlite`  |
| `PORT`              | HTTP 服务端口                 | `3000`                      |
| `HOST`              | 监听地址                      | `0.0.0.0`                   |

## 📝 使用说明

### 🛠 本地开发

```bash
# 安装依赖
pnpm install

# Cloudflare Worker 本地开发
pnpm dev            # 等价于 wrangler dev

# Node/Docker 适配器本地开发（tsx watch）
pnpm dev:node
```

### 📦 构建

```bash
pnpm build          # 同时产出 dist/worker/_worker.js + dist/node/server.mjs
pnpm build:worker   # 仅 Cloudflare 产物
pnpm build:node     # 仅 Node 产物
```

| 产物                       | 用途                                              |
| -------------------------- | ------------------------------------------------- |
| `dist/worker/_worker.js`   | Cloudflare Worker / Pages 自包含 bundle           |
| `dist/node/server.mjs`     | Node.js / Docker 入口，node_modules 保持 external |

### ☁️ 部署方式一：Cloudflare Worker（wrangler）

```bash
pnpm deploy   # 等价于 wrangler deploy
```

### ☁️ 部署方式二：Cloudflare Pages（直接上传）

1. 登录 Cloudflare Dashboard → Workers & Pages → 创建 Pages 项目
2. 选择 "直接上传"
3. 从 `release` 分支下载 `_worker.zip`（由 GitHub Action 自动产出）
4. 上传并等待部署完成

### ☁️ 部署方式三：通过 Git 仓库部署到 Pages

1. Fork 本仓库
2. Cloudflare Dashboard → Workers & Pages → 创建 Pages 项目
3. "连接到 Git" 并选择 Fork 后的仓库
4. 构建命令、构建输出目录均留空，部署分支选择 `release`

### 🐳 部署方式四：Docker

仓库在打 tag 时会由 GitHub Actions 自动构建并推送 multi-arch 镜像（linux/amd64 + linux/arm64）到 GHCR：

```bash
ghcr.io/jwygithub/sub-convert:latest
ghcr.io/jwygithub/sub-convert:<tag>
```

#### docker run

```bash
docker run -d \
  --name sub-convert \
  --restart unless-stopped \
  -p 3000:3000 \
  -v sub-data:/data \
  -e BACKEND=https://url.v1.mk \
  -e DATABASE_DRIVER=sqlite \
  -e SQLITE_PATH=/data/sub-convert.sqlite \
  ghcr.io/jwygithub/sub-convert:latest
```

#### docker-compose

仓库自带 `docker-compose.yml`，直接：

```bash
docker compose up -d
```

#### 本地自行构建

```bash
pnpm docker:build   # 等价于 docker build -t sub-convert .
pnpm docker:run     # 使用默认 env 启动一个临时容器
```

### 🔗 访问地址

- Worker 部署：`https://your-worker-name.your-subdomain.workers.dev`
- Pages 部署：`https://your-project-name.pages.dev`
- Docker 部署：`http://<host>:3000`

### 🔗 短链服务

短链服务用于将较长的订阅链接转换为简短的 URL，便于分享和使用。短链服务是否启用由运行环境自动判定：

- **Cloudflare**：`wrangler.jsonc` 中绑定了 D1（`DB`）→ 启用
- **Node / Docker**：`DATABASE_DRIVER=sqlite`（默认值）→ 启用；设为空字符串关闭

#### 💾 数据库表

- 表名：`short_url`
- 字段：
    - `id`：自增主键
    - `short_code`：短链码
    - `short_url`：短链 URL
    - `long_url`：原始订阅链接

#### 💾 数据库结构

```sql
CREATE TABLE IF NOT EXISTS short_url (
    id INTEGER PRIMARY KEY,
    short_code TEXT,
    short_url TEXT,
    long_url TEXT
);
```

> Cloudflare D1 环境下表由 `schema.sql` 初始化；Node/Docker 环境下由 `SqliteUrlRepository` 启动时自动建表，挂载数据卷（如 `-v sub-data:/data`）持久化。

#### 💾 配置示例

![配置示例](./src/doc/screen/env.png)

#### 💾 数据库部署文档

[Cloudflare D1](https://developers.cloudflare.com/d1/get-started/)

#### 💾 工作原理

<p><img src="./src/doc/screen/flow.svg" width="200px" height="auto" alt="工作原理" /></p>

#### 💾 提示

- `只有使用部署的 Worker / Docker 服务，才有混淆的效果；使用其他第三方后端转换服务没有混淆效果`

## 🚀 发布流程

仓库采用 tag 驱动的统一发布模式，推送 `v*.*.*` 会并行触发两条流水线：

| 事件              | 触发的 GitHub Action                                              | 产物                                                               |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| push tag `v*.*.*` | [`cloudflare-release`](.github/workflows/cloudflare-release.yml) | `release` 分支更新 `_worker.js` + `_worker.zip`                    |
| push tag `v*.*.*` | [`docker-release`](.github/workflows/docker-release.yml)         | GHCR multi-arch 镜像 `ghcr.io/<owner>/<repo>:<tag>` + `latest`     |

发布命令：

```bash
git tag v0.1.0
git push origin v0.1.0
```

两个 workflow 均支持 **`workflow_dispatch` 手动触发**，方便在不打 tag 的情况下重跑。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## ⚠️ 免责声明

在使用此项目时均被视为已经仔细阅读并完全同意以下条款：

- 此项目仅供个人学习与交流使用，严禁用于商业以及不良用途。
- 如有发现任何商业行为以及不良用途，此项目作者有权撤销使用权。
- 使用本软件所存在的风险将完全由其本人承担，此项目作者不承担任何责任。
- 此项目注明之服务条款外，其它因不当使用本软件而导致的任何意外、疏忽、合约毁坏、诽谤、版权或其他知识产权侵犯及其所造成的任何损失，本软件作者概不负责，亦不承担任何法律责任。
- 对于因不可抗力或因黑客攻击、通讯线路中断等不能控制的原因造成的服务中断或其他缺陷，导致用户不能正常使用，此项目作者不承担任何责任，但将尽力减少因此给用户造成的损失或影响。
- 本声明未涉及的问题请参见国家有关法律法规，当本声明与国家有关法律法规冲突时，以国家法律法规为准。
- 本软件相关声明版权及其修改权、更新权和最终解释权均属此项目作者所有。

## 📄 开源协议

本项目遵循 [LICENSE](./LICENSE) 开源协议。

