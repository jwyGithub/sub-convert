import type { Context } from 'hono';
import type { AppBindings } from '../bindings';
import type { UrlService } from '../services/url.service';
import { HTTPException } from 'hono/http-exception';
import { getTargetConfig } from '../page/config/targetConfig';
import { getConfiguredAdminKey, safeEqualString } from '../shared/adminKey';

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
        const payload = await c.req.json<{ long_url?: string; serve?: string; short_code?: string }>();
        if (!payload?.long_url) {
            throw new HTTPException(400, { message: 'Missing long_url' });
        }

        // 可选的自定义短码后缀：留空则由仓库层自动生成随机短码
        let customCode: string | undefined;
        const rawCode = payload.short_code?.trim();
        if (rawCode) {
            if (!/^[\w-]{1,64}$/.test(rawCode)) {
                throw new HTTPException(400, {
                    message: '自定义后缀仅支持字母、数字、下划线和短横线，长度 1-64'
                });
            }
            // 校验是否已存在，存在则提示（避免覆盖已有短链）
            const existing = await this.service.getByCode(rawCode);
            if (existing) {
                throw new HTTPException(409, { message: '该短链后缀已存在，请更换' });
            }
            customCode = rawCode;
        }

        const url = new URL(c.req.url);
        const baseUrl = payload.serve || `${url.protocol}//${url.host}`;
        const result = await this.service.add(payload.long_url, baseUrl, customCode);
        return c.json({ data: result });
    }

    async verifyAdmin(c: Context<AppBindings>): Promise<Response> {
        if (c.env.SHORT_URL_ENABLED !== true) {
            throw new HTTPException(503, { message: '短链服务未启用' });
        }

        const configured = getConfiguredAdminKey(c.env);
        if (!configured) {
            throw new HTTPException(503, { message: '请先配置 SHORT_URL_KEY' });
        }

        const payload = await c.req.json<{ key?: string }>().catch(() => ({ key: '' }));
        const key = payload?.key?.trim() ?? '';
        if (!key || !safeEqualString(key, configured)) {
            throw new HTTPException(401, { message: '密钥不正确' });
        }

        return c.json({ data: { ok: true } });
    }

    async delete(c: Context<AppBindings>): Promise<Response> {
        this.assertAdminKey(c);
        const code = c.req.query('code');
        if (!code) {
            throw new HTTPException(400, { message: 'Missing code' });
        }
        await this.service.deleteByCode(code);
        return c.json({ data: { deleted: true } });
    }

    async queryByCode(c: Context<AppBindings>): Promise<Response> {
        this.assertAdminKey(c);
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
        this.assertAdminKey(c);
        const page = Number.parseInt(c.req.query('page') || '1', 10);
        const pageSize = Number.parseInt(c.req.query('pageSize') || '20', 10);
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

    private assertAdminKey(c: Context<AppBindings>): void {
        const configured = getConfiguredAdminKey(c.env);
        if (!configured) {
            throw new HTTPException(503, { message: '请先配置 SHORT_URL_KEY' });
        }

        const provided = (c.req.header('X-Admin-Key') ?? '').trim();
        if (!provided || !safeEqualString(provided, configured)) {
            throw new HTTPException(401, { message: '密钥不正确' });
        }
    }
}
