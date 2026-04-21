import type { IUrlRepository } from '../db/types';
import type { ShortUrl } from '../types';
import { dump } from 'js-yaml';
import { DEFAULT_CONFIG } from '../config';
import { Confuse } from '../core/confuse';
import { Restore } from '../core/restore';

export interface SubPayload {
    body: string;
    contentType: string;
}

export class UrlService {
    constructor(private readonly repo: IUrlRepository | null) {}

    async toSub(request: Request, env: Env, convertType: string): Promise<SubPayload> {
        const confuse = new Confuse(env);
        await confuse.setSubUrls(request);

        const restore = new Restore(confuse);

        if (['clash', 'clashr'].includes(convertType)) {
            const originConfig = await restore.getClashConfig();
            return {
                body: dump(originConfig, { indent: 2, lineWidth: 200 }),
                contentType: 'text/yaml; charset=UTF-8'
            };
        }

        if (convertType === 'singbox') {
            const originConfig = await restore.getSingboxConfig();
            return {
                body: JSON.stringify(originConfig),
                contentType: 'text/plain; charset=UTF-8'
            };
        }

        if (convertType === 'v2ray') {
            const originConfig = await restore.getV2RayConfig();
            return {
                body: originConfig,
                contentType: 'text/plain; charset=UTF-8'
            };
        }

        throw new Error('Unsupported client type, support list: clash, singbox, v2ray');
    }

    getVersionRedirect(request: Request, env: Env): string {
        const { searchParams } = new URL(request.url);
        const backend = searchParams.get('backend') ?? env.BACKEND ?? DEFAULT_CONFIG.BACKEND;
        return `${backend}/version`;
    }

    async add(long_url: string, baseUrl: string): Promise<ShortUrl> {
        this.ensureRepo();
        return this.repo!.add(long_url, baseUrl);
    }

    async deleteByCode(code: string): Promise<void> {
        this.ensureRepo();
        return this.repo!.deleteByCode(code);
    }

    async getByCode(code: string): Promise<ShortUrl | null> {
        this.ensureRepo();
        return this.repo!.getByCode(code);
    }

    async getList(page = 1, pageSize = 10): Promise<{ total: number; items: ShortUrl[] }> {
        this.ensureRepo();
        return this.repo!.getList(page, pageSize);
    }

    private ensureRepo(): void {
        if (!this.repo) {
            throw new Error('Short URL service is not enabled (no repository configured)');
        }
    }
}
