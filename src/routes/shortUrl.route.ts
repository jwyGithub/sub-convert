import type { Context } from 'hono';
import type { AppBindings } from '../bindings';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UrlController } from '../controllers/url.controller';
import { UrlService } from '../services/url.service';

export const shortUrlRoute = new Hono<AppBindings>();

function withController(c: Context<AppBindings>): UrlController {
    const repo = c.get('repo');
    if (!repo) {
        throw new HTTPException(503, { message: 'Short URL service is not enabled' });
    }
    const service = new UrlService(repo);
    return new UrlController(service);
}

shortUrlRoute.post('/api/add', c => withController(c).add(c));
shortUrlRoute.delete('/api/delete', c => withController(c).delete(c));
shortUrlRoute.get('/api/queryByCode', c => withController(c).queryByCode(c));
shortUrlRoute.get('/api/queryList', c => withController(c).queryList(c));
shortUrlRoute.get('/:code', c => withController(c).redirect(c));

