import type { AppBindings } from '../bindings';
import { Hono } from 'hono';
import { showPage } from '../page/page';

export const pageRoute = new Hono<AppBindings>();

pageRoute.get('/', c => {
    return showPage(c.req.raw, c.env);
});

pageRoute.get('/favicon.ico', c => c.body(null, 204));
