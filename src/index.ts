import { UrlController } from './controllers/url.controller';
import { Router } from './core/router';
import { showPage } from './page/page';
import { UrlService } from './services/url.service';
import { ResponseUtil } from './shared/response';

const router = new Router();

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        try {
            if (request.method === 'OPTIONS') {
                return ResponseUtil.cors(new Response(null, { status: 200 }));
            }

            const service = new UrlService(env.DB);
            const controller = new UrlController(service);

            router
                .get('/', req => showPage(req, env))
                .get('/favicon.ico', () => new Response(null, { status: 200 }))
                .get('/sub', req => controller.toSub(req, env))
                .get('/forward', req => controller.forward(req, env))
                .get('/version', req => controller.getVersion(req, env))
                .post('/api/add', req => controller.add(req))
                .delete('/api/delete', req => controller.delete(req))
                .get('/api/queryByCode', req => controller.queryByCode(req))
                .get('/api/queryList', req => controller.queryList(req))
                .get('/:code', req => controller.redirect(req));

            const response = await router.handle(request, env);
            return ResponseUtil.cors(response);
        } catch (error: any) {
            return ResponseUtil.error(error.message || error);
        }
    }
} satisfies ExportedHandler<Env>;

