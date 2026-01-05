import type { UrlService } from '../services/url.service';
import { getTargetConfig } from '../page/config/targetConfig';
import { ResponseUtil } from '../shared/response';

export class UrlController {
    constructor(private service: UrlService) {}

    async toSub(request: Request, env: Env): Promise<Response> {
        try {
            const convertType = new URL(request.url).searchParams.get('target');
            if (!convertType) {
                return ResponseUtil.error('Unsupported client type');
            }

            const targetConfig = getTargetConfig();
            const supportList = targetConfig.map(item => item.value);

            if (!supportList.includes(convertType)) {
                return ResponseUtil.error(`Unsupported client type, support list: ${supportList.join(', ')}`);
            }

            const subConfig = await this.service.toSub(request, env, convertType);
            return ResponseUtil.cors(subConfig);
        } catch (error: any) {
            return ResponseUtil.error(error.message || 'Invalid request');
        }
    }

    async forward(request: Request, env: Env): Promise<Response> {
        return this.service.forward(request, env);
    }

    async getVersion(request: Request, env: Env): Promise<Response> {
        return this.service.getVersion(request, env);
    }

    async add(request: Request): Promise<Response> {
        try {
            const { long_url, serve } = await request.json<{ long_url: string; serve?: string }>();
            if (!long_url) {
                return ResponseUtil.error('Missing long_url');
            }

            const url = new URL(request.url);
            const baseUrl = serve || `${url.protocol}//${url.host}`;

            const result = await this.service.add(long_url, baseUrl);
            return ResponseUtil.success(result);
        } catch (error: any) {
            return ResponseUtil.error(error.message || 'Invalid request');
        }
    }

    async delete(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const code = url.searchParams.get('code');

            if (!code) {
                return ResponseUtil.error('Missing code');
            }

            await this.service.deleteByCode(code);
            return ResponseUtil.success({ deleted: true });
        } catch (error: any) {
            return ResponseUtil.error(error.message || 'Invalid request');
        }
    }

    async queryByCode(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const code = url.searchParams.get('code');

            if (!code) {
                return ResponseUtil.error('Missing code');
            }

            const result = await this.service.getByCode(code);
            return result ? ResponseUtil.success(result) : ResponseUtil.error('Not found', 404);
        } catch (error: any) {
            return ResponseUtil.error(error.message || 'Invalid request');
        }
    }

    async queryList(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const page = Number.parseInt(url.searchParams.get('page') || '1');
            const pageSize = Number.parseInt(url.searchParams.get('pageSize') || '10');

            const result = await this.service.getList(page, pageSize);
            return ResponseUtil.success(result);
        } catch (error: any) {
            return ResponseUtil.error(error.message || 'Invalid request');
        }
    }

    async redirect(request: Request): Promise<Response> {
        try {
            const code = request.params?.code;
            if (!code) {
                return ResponseUtil.error('Invalid short URL');
            }

            const result = await this.service.getByCode(code);
            if (result) {
                return Response.redirect(result.long_url, 302);
            }
            return ResponseUtil.error('Not found', 404);
        } catch (error: any) {
            return ResponseUtil.error(error.message || 'Invalid request');
        }
    }
}

