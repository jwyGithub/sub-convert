import type { Context } from 'hono';
import type { AppBindings } from '../bindings';
import type { UrlService } from '../services/url.service';
import { HTTPException } from 'hono/http-exception';
import { getTargetConfig } from '../page/config/targetConfig';

export class UrlController {
    constructor(private readonly service: UrlService) {}

    async toSub(c: Context<AppBindings>): Promise<Response> {
        const convertType = c.req.query('target');
        if (!convertType) {
            throw new HTTPException(400, { message: 'Unsupported client type' });
        }

        const supportList = getTargetConfig().map(item => item.value);
        if (!supportList.includes(convertType)) {
            throw new HTTPException(400, {
                message: `Unsupported client type, support list: ${supportList.join(', ')}`
            });
        }

        const { body, contentType } = await this.service.toSub(c.req.raw, c.env, convertType);
        return c.body(body, 200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-store'
        });
    }

    async getVersion(c: Context<AppBindings>): Promise<Response> {
        const url = this.service.getVersionRedirect(c.req.raw, c.env);
        return c.redirect(url, 302);
    }

    async add(c: Context<AppBindings>): Promise<Response> {
        const payload = await c.req.json<{ long_url?: string; serve?: string }>();
        if (!payload?.long_url) {
            throw new HTTPException(400, { message: 'Missing long_url' });
        }

        const url = new URL(c.req.url);
        const baseUrl = payload.serve || `${url.protocol}//${url.host}`;
        const result = await this.service.add(payload.long_url, baseUrl);
        return c.json({ data: result });
    }

    async delete(c: Context<AppBindings>): Promise<Response> {
        const code = c.req.query('code');
        if (!code) {
            throw new HTTPException(400, { message: 'Missing code' });
        }
        await this.service.deleteByCode(code);
        return c.json({ data: { deleted: true } });
    }

    async queryByCode(c: Context<AppBindings>): Promise<Response> {
        const code = c.req.query('code');
        if (!code) {
            throw new HTTPException(400, { message: 'Missing code' });
        }

        const result = await this.service.getByCode(code);
        if (!result) {
            throw new HTTPException(404, { message: 'Not found' });
        }
        return c.json({ data: result });
    }

    async queryList(c: Context<AppBindings>): Promise<Response> {
        const page = Number.parseInt(c.req.query('page') || '1', 10);
        const pageSize = Number.parseInt(c.req.query('pageSize') || '10', 10);
        const result = await this.service.getList(page, pageSize);
        return c.json({ data: result });
    }

    async redirect(c: Context<AppBindings>): Promise<Response> {
        const code = c.req.param('code');
        if (!code) {
            throw new HTTPException(400, { message: 'Invalid short URL' });
        }

        const result = await this.service.getByCode(code);
        if (!result) {
            throw new HTTPException(404, { message: 'Not found' });
        }
        return c.redirect(result.long_url, 302);
    }
}
