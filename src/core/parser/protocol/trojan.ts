import type { TrojanConfig } from '../types';
import { Faker } from '../../../shared/faker';
import { PsUtil } from '../../../shared/ps';

export class TrojanParser extends Faker {
    /** * @description 原始链接 */
    #originLink: string = '';

    /** * @description 混淆链接 */
    #confuseLink: string = '';

    /** * @description vps原始配置 */
    #originConfig: Partial<TrojanConfig> = {};

    /** * @description 混淆配置 */
    #confuseConfig: Partial<TrojanConfig> = {};

    /** * @description 原始备注 */
    #originPs: string = '';

    /** * @description 混淆备注 */
    #confusePs: string = '';

    constructor(v: string) {
        super();
        this.#confusePs = crypto.randomUUID();
        // 设置原始配置
        this.setOriginConfig(v);
        // 设置混淆配置
        this.setConfuseConfig(v);
    }

    /**
     * @description 设置原始配置
     * @param {string} v
     */
    private setOriginConfig(v: string): void {
        this.#originLink = v;
        this.#originConfig = new URL(v);
        this.#originPs = PsUtil.formatPs(this.#originConfig.hash) ?? '';
    }

    /**
     * @description 更新原始配置
     * @param {string} ps
     */
    public updateOriginConfig(ps: string): void {
        this.#originConfig.hash = PsUtil.formatPs(ps);
        this.#originPs = PsUtil.formatPs(ps);
        this.#originLink = this.#originConfig.href!;
        this.setConfuseConfig(this.#originLink);
    }

    /**
     * @description 设置混淆配置
     * @param {string} v
     */
    private setConfuseConfig(v: string): void {
        this.#confuseConfig = new URL(v);
        this.#confuseConfig.username = this.getUsername();
        this.#confuseConfig.host = this.getHost();
        this.#confuseConfig.hostname = this.getHostName();
        this.#confuseConfig.port = this.getPort();
        this.#confuseConfig.hash = PsUtil.setPs(this.#originPs, this.#confusePs);
        this.#confuseLink = this.#confuseConfig.href!;
    }

    public restoreClash(proxy: Record<string, any>, ps: string): Record<string, any> {
        proxy.name = ps;
        proxy.server = this.originConfig.hostname ?? '';
        proxy.port = Number(this.originConfig.port ?? 0);
        proxy.password = this.originConfig?.username ?? '';
        proxy.alpn = proxy.alpn ? proxy.alpn.map((i: string) => decodeURIComponent(i)) : proxy.alpn;
        return proxy;
    }

    public restoreSingbox(outbound: Record<string, any>, ps: string): Record<string, any> {
        outbound.password = this.originConfig?.username ?? '';
        outbound.server = this.originConfig.hostname ?? '';
        outbound.server_port = Number(this.originConfig.port ?? 0);
        outbound.tag = ps;

        if (outbound.tls?.server_name) {
            outbound.tls.server_name = this.originConfig.hostname ?? '';
        }
        if (outbound.tls?.alpn) {
            outbound.tls.alpn = outbound.tls.alpn.map((i: string) => decodeURIComponent(i));
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
     * @example 'trojan://...'
     */
    get originLink(): string {
        return this.#originLink;
    }

    /**
     * @description 原始配置
     */
    get originConfig(): Partial<TrojanConfig> {
        return this.#originConfig;
    }

    /**
     * @description 混淆备注
     * @example 'confusePs'
     */
    get confusePs(): string {
        return encodeURIComponent(this.#confusePs);
    }

    /**
     * @description 混淆链接
     * @example 'trojan://...'
     */
    get confuseLink(): string {
        return this.#confuseLink;
    }

    /**
     * @description 混淆配置
     */
    get confuseConfig(): Partial<TrojanConfig> {
        return this.#confuseConfig;
    }
}
