import type { MiddlewareHandler } from 'hono';
import type { AppBindings } from '../bindings';
import { cors } from 'hono/cors';

export function corsMiddleware(): MiddlewareHandler<AppBindings> {
    return cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400
    });
}
