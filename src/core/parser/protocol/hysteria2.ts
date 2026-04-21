import type { Hysteria2Config } from '../types';
import { hasKey } from '../../../shared';
import { Faker } from '../../../shared/faker';
import { PsUtil } from '../../../shared/ps';

export class Hysteria2Parser extends Faker {
    /** * @description 原始链接 */
    #originLink: string = '';

    /** * @description 混淆链接 */
    #confuseLink: string = '';

    /** * @description vps原始配置 */
    #originConfig: Partial<Hysteria2Config> = {};

    /** * @description 混淆配置 */
    #confuseConfig: Partial<Hysteria2Config> = {};

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
        this.#originPs = this.#originConfig.hash ?? '';
    }

    /**
     * @description 更新原始配置
     * @param {string} ps
     */
    public updateOriginConfig(ps: string): void {
        this.#originConfig.hash = ps;
        this.#originPs = ps;
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

    public restoreClash(proxy: Record<string, string | number>, ps: string): Record<string, string | number> {
        proxy.name = ps;
        proxy.server = this.originConfig.hostname ?? '';
        proxy.port = Number(this.originConfig.port ?? 0);
        if (proxy.type === 'hysteria2' && hasKey(proxy, 'password')) {
            proxy.password = this.originConfig?.searchParams?.get('password') ?? '';
        }

        if (hasKey(proxy, 'down')) {
            proxy.down =
                proxy.down !== ''
                    ? proxy.down
                    : (this.originConfig.searchParams?.get('down') ?? this.originConfig.searchParams?.get('downmbps') ?? 0);
            proxy.down = decodeURIComponent(proxy.down as string);
        }
        if (hasKey(proxy, 'up')) {
            proxy.up =
                proxy.up !== ''
                    ? proxy.up
                    : (this.originConfig.searchParams?.get('up') ?? this.originConfig.searchParams?.get('upmbps') ?? 0);
            proxy.up = decodeURIComponent(proxy.up as string);
        }
        if (hasKey(proxy, 'delay')) {
            proxy.delay = this.originConfig.searchParams?.get('delay') ?? 0;
        }

        if (this.originConfig.searchParams?.has('sni')) {
            proxy.sni = this.originConfig.searchParams?.get('sni') ?? '';
        }

        return proxy;
    }

    public restoreSingbox(outbound: Record<string, string | number>, ps: string): Record<string, string | number> {
        outbound.password = this.originConfig?.searchParams?.get('password') ?? '';
        outbound.server = this.originConfig.hostname ?? '';
        outbound.server_port = Number(this.originConfig.port ?? 0);
        outbound.tag = ps;
        if (outbound.down) {
            outbound.down = decodeURIComponent(outbound.down as string);
        }
        if (outbound.up) {
            outbound.up = decodeURIComponent(outbound.up as string);
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
    get originConfig(): Partial<Hysteria2Config> {
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
    get confuseConfig(): Partial<Hysteria2Config> {
        return this.#confuseConfig;
    }
}
