import type { SsrConfig } from '../types';
import { base64Decode, base64Encode, tryBase64Decode } from 'cloudflare-tools';
import { Faker } from '../../../shared/faker';
import { PsUtil } from '../../../shared/ps';

export class SsrParser extends Faker {
    /** * @description 原始链接 */
    #originLink: string = '';

    /** * @description 混淆链接 */
    #confuseLink: string = '';

    /** * @description vps原始配置 */
    #originConfig: Partial<SsrConfig> = {};

    /** * @description 混淆配置 */
    #confuseConfig: Partial<SsrConfig> = {};

    /** * @description 原始备注 */
    #originPs: string = '';

    /** * @description 混淆备注 */
    #confusePs: string = '';

    public constructor(v: string) {
        super();
        this.#confusePs = crypto.randomUUID();
        // 设置原始配置
        this.setOriginConfig(v);
        // 设置混淆配置
        this.setConfuseConfig();
    }

    /**
     * @description 设置原始配置
     * @param {string} v
     */
    private setOriginConfig(v: string): void {
        const [_, config] = v.match(/ssr:\/\/(.*)/) || [];
        this.#originLink = v;
        this.#originConfig = this.getOriginConfig(base64Decode(config));
        this.#originPs = this.#originConfig.remarks ?? '';
    }

    // oxo.08050611.xyz:10000:origin:aes-256-cfb:plain:NlJWUHp2bVQ1MCthdTNXajBCL2hiTTJ6VVZ5bWxVQTJkbkx3aXZDMFR5TT0/?remarks=5rWL6K-Vc3Ny&protoparam=&obfsparam=
    private getOriginConfig(v: string): SsrConfig {
        const [server, port, protocol, method, obfs, password] = v.split(':');
        const params = new URL(v);

        return {
            server,
            port,
            protocol,
            method,
            obfs,
            password_base64: password.replace(params.search, ''),
            remarks: tryBase64Decode(params.searchParams.get('remarks')?.replace('-', '+') || ''),
            params: params.search.replace(`?remarks=${params.searchParams.get('remarks')}`, '')
        };
    }

    /**
     * @description 更新原始配置
     * @param {string} ps
     */
    public updateOriginConfig(ps: string): void {
        this.#originConfig.remarks = ps;
        this.#originPs = ps;
        this.#originLink = `ssr://${base64Encode(`${this.#originConfig.server}:${this.#originConfig.port}:${this.#originConfig.protocol}:${this.#originConfig.method}:${this.#originConfig.obfs}:${this.#originConfig.password_base64}?remarks=${this.#originConfig.remarks}${this.#originConfig.params}`)}`;
        this.setConfuseConfig();
    }

    /**
     * @description 设置混淆配置
     */
    private setConfuseConfig(): void {
        this.#confuseConfig = structuredClone(this.#originConfig);
        this.#confuseConfig.server = this.getHostName();
        this.#confuseConfig.port = this.getPort();
        this.#confuseConfig.remarks = base64Encode(PsUtil.setPs(this.#originPs, this.#confusePs));
        this.#confuseLink = `ssr://${base64Encode(`${this.#confuseConfig.server}:${this.#confuseConfig.port}:${this.#confuseConfig.protocol}:${this.#confuseConfig.method}:${this.#confuseConfig.obfs}:${this.#confuseConfig.password_base64}?remarks=${this.#confuseConfig.remarks}${this.#confuseConfig.params}`)}`;
    }

    public restoreClash(proxy: Record<string, string | number>, ps: string): Record<string, string | number> {
        proxy.name = ps;
        proxy.server = this.originConfig.server ?? '';
        proxy.port = Number(this.originConfig?.port ?? 0);
        return proxy;
    }

    public restoreSingbox(outbound: Record<string, any>, ps: string): Record<string, string | number> {
        outbound.server = this.originConfig.server ?? '';
        outbound.server_port = Number(this.originConfig.port ?? 0);
        outbound.tag = ps;
        if (outbound.tls?.server_name) {
            outbound.tls.server_name = this.originConfig.add ?? '';
        }
        return outbound;
    }

    /**
     * @description 原始备注
     * @example '#originPs'
     */
    get originPs(): string {
        return this.#originPs;
    }

    /**
     * @description 原始链接
     * @example 'vmess://...'
     */
    get originLink(): string {
        return this.#originLink;
    }

    /**
     * @description 原始配置
     */
    get originConfig(): Partial<SsrConfig> {
        return this.#originConfig;
    }

    /**
     * @description 混淆备注
     * @example 'confusePs'
     */
    get confusePs(): string {
        return this.#confusePs;
    }

    /**
     * @description 混淆链接
     * @example 'vmess://...'
     */
    get confuseLink(): string {
        return this.#confuseLink;
    }

    /**
     * @description 混淆配置
     */
    get confuseConfig(): Partial<SsrConfig> {
        return this.#confuseConfig;
    }
}
