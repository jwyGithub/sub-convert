import type { ClashType, SingboxType, V2RayType, VpsMap } from '../../types';
import { DEFAULT_CONFIG } from '../../config';
import { Parser } from '../parser';
import { ClashClient } from './client/clash';
import { SingboxClient } from './client/singbox';
import { V2RayClient } from './client/v2ray';

export class Confuse {
    private urls: string[] = [];
    private vps: string[] = [];

    private backend: string = DEFAULT_CONFIG.BACKEND;
    private parser: Parser | null = null;

    private clashClient: ClashClient = new ClashClient();
    private singboxClient: SingboxClient = new SingboxClient();
    private v2rayClient: V2RayClient = new V2RayClient(this.vps);

    constructor(env: Env) {
        this.backend = env.BACKEND ?? DEFAULT_CONFIG.BACKEND;
        this.parser = null;
    }

    public async setSubUrls(request: Request): Promise<void> {
        const { searchParams } = new URL(request.url);
        const vpsUrl = searchParams.get('url');
        const protocol = searchParams.get('protocol');
        this.backend = searchParams.get('backend') ?? this.backend;

        const vps = vpsUrl!.split(/\||\n/).filter(Boolean);
        this.parser = new Parser(vps, [], protocol);
        this.vps = vps;
        await this.parser.parse(vps);
        this.urls = this.parser.urls;
    }

    public async getClashConfig(request: Request): Promise<ClashType> {
        return await this.clashClient.getConfig({
            request,
            urls: this.urls,
            backend: this.backend
        });
    }

    public async getSingboxConfig(request: Request): Promise<SingboxType> {
        return await this.singboxClient.getConfig({
            request,
            urls: this.urls,
            backend: this.backend
        });
    }

    public async getV2RayConfig(): Promise<V2RayType> {
        return await this.v2rayClient.getConfig(this.urls, this.vps);
    }

    get vpsStore(): VpsMap | undefined {
        return this.parser?.vpsMap;
    }
}

