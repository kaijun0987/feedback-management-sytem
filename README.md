# 反馈中心（Soybean Feedback）

基于 [SoybeanAdmin](https://github.com/soybeanjs/soybean-admin) 的 Vue3 + Vite 管理台与自研 **NestJS + Prisma** 反馈 API 组成的 Monorepo，用于内部反馈表单、提交与简单管理端。

- **产品说明**：见 [`docs/feedback-system-design.md`](docs/feedback-system-design.md)
- **原模板说明**（Soybean 官方长文档）：见 [`docs/soybean-admin-upstream-README.md`](docs/soybean-admin-upstream-README.md)

## 技术栈

| 区域 | 技术                                               |
| ---- | -------------------------------------------------- |
| 前端 | Vue 3、Vite 8、TypeScript、Naive UI、Pinia、UnoCSS |
| 后端 | NestJS、Prisma 7、PostgreSQL                       |

## 环境要求

- **Node** ≥ 20.19
- **pnpm** ≥ 10.5
- **Docker**（可选，用于本机起 PostgreSQL，见 `backend/feedback-api/docker-compose.yml`）

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在仓库**根目录**从示例复制并修改：

```bash
cp .env.example .env
cp .env.test.example .env.test
```

`pnpm dev` 使用 `vite --mode test`，会合并加载 `.env` 与 `.env.test`。反馈相关接口在 `VITE_OTHER_SERVICE_BASE_URL` 的 `feedback` 键上，默认指向本机 `http://127.0.0.1:3001/api`；需配合下方 API 与代理说明。

启动 **Feedback API** 时，在 `backend/feedback-api` 中：

```bash
cp .env.example .env
# 编辑 .env 中的 DATABASE_URL、JWT_SECRET、FEEDBACK_SUBMISSION_HMAC_SECRET
```

> **与 Git 的关系**：`.gitignore` 已忽略根目录 `.env`、`.env.test`、`.env.prod` 与 `backend/feedback-api/.env`，但若这些文件**曾经被提交过**，需在本机执行 `git rm --cached .env .env.test .env.prod` 再提交一次，之后才会真正不再跟踪。新成员用 `cp .env.example` / `cp .env.test.example` 即可，不必提交自己的 env 文件。

### 3. 数据库与迁移（仅后端）

见 [`backend/feedback-api/README.md`](backend/feedback-api/README.md)：`docker compose`、Prisma 迁移、种子账号等。

### 4. 启动

**终端 1：API**（`backend/feedback-api`）

```bash
cd backend/feedback-api
pnpm start:dev
```

默认 <http://127.0.0.1:3001>，全局路径前缀为 `/api`。

**终端 2：前端**（仓库根目录）

```bash
pnpm dev
```

默认 <http://127.0.0.1:9527>，开发时若 `VITE_HTTP_PROXY=Y`（见 `.env.example`），会按 `src/utils/service.ts` 将请求代理到 `VITE_*_SERVICE_*` 配置的主机。

### 5. 检查

- `pnpm typecheck`：前端类型检查
- 种子用户（若已执行 `prisma:seed`）：`Super` / `Admin` / `User` 与密码 `123456`（以 `backend/feedback-api` 文档为准）

## 目录结构（节选）

```text
.
├── src/                    # 前端（页面、路由、store、service）
├── build/                  # Vite 插件与构建配置
├── backend/feedback-api/   # Nest + Prisma API
│   ├── prisma/             # schema、migrations、seed
│   └── src/
└── packages/               # 工作区 @sa/* 子包
```

## 其他脚本（根 `package.json`）

| 命令              | 说明                      |
| ----------------- | ------------------------- |
| `pnpm build`      | 使用 `mode prod` 构建     |
| `pnpm build:test` | `mode test` 构建          |
| `pnpm dev:prod`   | 以 `mode prod` 起开发服务 |
| `pnpm preview`    | 预览构建结果              |

## License

与上游 [SoybeanAdmin](https://github.com/soybeanjs/soybean-admin) 相同为 **MIT**（见 `LICENSE`）。
