import type { AppBindings } from './bindings';
import type { IUrlRepository } from './db/types';
import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/error';
import { loggerMiddleware } from './middleware/logger';
import { repoMiddleware } from './middleware/repo';
import { registerRoutes } from './routes';

export interface CreateAppOptions {
    repo: IUrlRepository | null;
}

/**
 * 构造跨运行时共享的 Hono 应用实例。
 * Cloudflare 与 Node 适配层均复用该工厂，只需注入各自平台的依赖。
 */
export function createApp(options: CreateAppOptions): Hono<AppBindings> {
    const app = new Hono<AppBindings>();

    app.use('*', loggerMiddleware());
    app.use('*', corsMiddleware());
    app.use('*', repoMiddleware(options.repo));

    app.onError(errorHandler);

    app.notFound(c => c.json({ error: 'Not Found' }, 404));

    registerRoutes(app);

    return app;
}

