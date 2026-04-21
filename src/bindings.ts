import type { IUrlRepository } from './db/types';

/**
 * AppEnv 统一 Cloudflare Worker Bindings 与 Node.js process.env 的形态。
 * Cloudflare 端由 Worker Binding 注入；Node 端由 adapters/node.ts 从 process.env 装配。
 */
export interface AppEnv {
    BACKEND?: string;
    DEFAULT_BACKEND?: string;
    CUSTOM_BACKEND?: string;
    LOCK_BACKEND?: boolean;
    REMOTE_CONFIG?: string;
    CHUNK_COUNT?: string;
    /** Cloudflare D1 binding；Node 环境下不存在 */
    DB?: D1Database;
    /** 是否启用短链服务（由适配层根据 DB / Repository 注入情况决定） */
    SHORT_URL_ENABLED?: boolean;
}

/** Hono Context Variables，用于跨中间件传递依赖 */
export interface AppVars {
    repo: IUrlRepository | null;
}

export interface AppBindings {
    Bindings: AppEnv;
    Variables: AppVars;
}
