import type { MiddlewareHandler } from 'hono';
import type { AppBindings } from 'src/bindings';
import { logger } from 'hono/logger';

export function loggerMiddleware(): MiddlewareHandler<AppBindings> {
    return logger();
}
