# syntax=docker/dockerfile:1.7
# ---------- Builder ----------
FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable \
 && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:node \
 && ls -al dist/node

# ---------- Runner ----------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DATABASE_DRIVER=sqlite \
    SQLITE_PATH=/data/sub-convert.sqlite \
    NODE_OPTIONS=--no-warnings=ExperimentalWarning

RUN corepack enable \
 && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./
# 纯 JS 依赖，无原生模块；node:sqlite 由 runtime 提供
RUN pnpm install --prod --frozen-lockfile \
 && pnpm store prune

COPY --from=builder /app/dist/node ./dist/node

RUN mkdir -p /data
VOLUME ["/data"]
EXPOSE 3000

CMD ["node", "dist/node/server.mjs"]
