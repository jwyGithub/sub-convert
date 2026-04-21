import type { IUrlRepository } from './types';
import { D1UrlRepository } from './d1.repository';

/**
 * 短链仓储工厂集合。
 *
 * 说明：Cloudflare Worker 与 Node 运行时对 db 驱动的依赖不同，
 * 因此按「平台」拆分工厂，避免将 Node 原生模块（better-sqlite3）
 * 被静态分析进 Worker 产物。
 *
 * - Cloudflare：调用 {@link createD1Repository}
 * - Node：调用 {@link createSqliteRepository}（该文件仅在 Node 入口 import）
 */
export function createD1Repository(db: D1Database | undefined): IUrlRepository | null {
    if (!db) return null;
    return new D1UrlRepository(db);
}
