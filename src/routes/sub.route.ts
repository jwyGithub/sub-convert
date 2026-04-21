import type { AppBindings } from '../bindings';
import { Hono } from 'hono';
import { UrlController } from '../controllers/url.controller';
import { UrlService } from '../services/url.service';

export const subRoute = new Hono<AppBindings>();

subRoute.get('/sub', c => {
    const service = new UrlService(c.get('repo'));
    const controller = new UrlController(service);
    return controller.toSub(c);
});

subRoute.get('/version', c => {
    const service = new UrlService(c.get('repo'));
    const controller = new UrlController(service);
    return controller.getVersion(c);
});
