import type { Hono } from 'hono';
import type { AppBindings } from '../bindings';
import { pageRoute } from './page.route';
import { shortUrlRoute } from './shortUrl.route';
import { subRoute } from './sub.route';

/**
 * 将所有业务路由挂载到根 app；
 * 新增路由模块只需在此文件追加一行即可，业务各域保持解耦。
 */
export function registerRoutes(app: Hono<AppBindings>): void {
    app.route('/', pageRoute);
    app.route('/', subRoute);
    // 短链路由包含 /:code，必须最后注册以避免吞掉其他精确路径
    app.route('/', shortUrlRoute);
}
