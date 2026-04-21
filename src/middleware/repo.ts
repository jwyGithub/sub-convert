import type { MiddlewareHandler } from 'hono';
import type { AppBindings } from '../bindings';
import type { IUrlRepository } from '../db/types';

/**
 * 将仓储注入到 Hono Context，便于后续处理器通过 c.get('repo') 获取。
 */
export function repoMiddleware(repo: IUrlRepository | null): MiddlewareHandler<AppBindings> {
    return async (c, next) => {
        c.set('repo', repo);
        await next();
    };
}
