import { createApp } from '../app';
import { createD1Repository } from '../db/factory';

/**
 * Cloudflare Worker 入口。
 * 每次请求按当前 bindings 构造 App（Hono 实例足够轻量），
 * 保证短链服务按是否绑定 DB 动态启停。
 */
export default {
    fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> | Response {
        const repo = createD1Repository(env.DB);
        const app = createApp({ repo });
        const boundEnv: Env = { ...env, SHORT_URL_ENABLED: repo !== null };
        return app.fetch(request, boundEnv, ctx);
    }
} satisfies ExportedHandler<Env>;
