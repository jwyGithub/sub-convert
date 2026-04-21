import type { SsConfig } from '../types';
import { base64Decode, base64Encode } from 'cloudflare-tools';
import { Faker } from '../../../shared/faker';
import { PsUtil } from '../../../shared/ps';

export class SsParser extends Faker {
    /** * @description 原始链接 */
    #originLink: string = '';

    /** * @description 混淆链接 */
    #confuseLink: string = '';

    /** * @description vps原始配置 */
    #originConfig: Partial<SsConfig> = {};

    /** * @description 混淆配置 */
    #confuseConfig: Partial<SsConfig> = {};

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
        const _v = this.toStandard(v);
        this.#originLink = _v;
        this.#originConfig = new URL(_v);
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
        this.#confuseConfig = new URL(this.toStandard(v));
        this.#confuseConfig.username = this.getUsername();
        this.#confuseConfig.host = this.getHost();
        this.#confuseConfig.hostname = this.getHostName();
        this.#confuseConfig.port = this.getPort();
        this.#confuseConfig.hash = PsUtil.setPs(this.#originPs, this.#confusePs);
        this.#confuseLink = `ss://${decodeURIComponent(this.#originConfig.username!)}@${this.#confuseConfig.hostname}:${this.#confuseConfig.port}${this.#confuseConfig.search}#${this.#confuseConfig.hash}`;
    }

    public restoreClash(proxy: Record<string, string | number>, ps: string): Record<string, string | number> {
        proxy.name = ps;
        proxy.server = this.originConfig.hostname ?? '';
        proxy.port = Number(this.originConfig?.port ?? 0);
        return proxy;
    }

    public restoreSingbox(outbound: Record<string, string | number>, ps: string): Record<string, string | number> {
        outbound.server = this.originConfig.hostname ?? '';
        outbound.server_port = Number(this.originConfig.port ?? 0);
        outbound.tag = ps;
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
     * @example 'ss://...'
     */
    get originLink(): string {
        return this.#originLink;
    }

    /**
     * @description 原始配置
     */
    get originConfig(): Partial<SsConfig> {
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
     * @example 'ss://...'
     */
    get confuseLink(): string {
        return this.#confuseLink;
    }

    /**
     * @description 混淆配置
     */
    get confuseConfig(): Partial<SsConfig> {
        return this.#confuseConfig;
    }

    /**
     * @description 将传统格式 (SIP002) 的链接转换为标准新版 URI 格式的链接
     * @param {string} sipUrl SIP002 格式链接
     * @returns {string} 标准新版 URI 格式链接
     */
    private toStandard(sipUrl: string): string {
        // 检查是否为传统 SIP002 格式: ss://[base64(method:password@server:port)]#remark
        // 先提取 fragment (备注部分)
        const fragmentMatch = sipUrl.match(/#(.*)$/);
        const fragment = fragmentMatch ? `#${fragmentMatch[1]}` : '';

        // 移除 fragment 部分，只保留主体
        const mainUrl = sipUrl.replace(/#.*$/, '');

        // 检查是否为 ss:// 开头
        if (!mainUrl.startsWith('ss://')) {
            return sipUrl;
        }

        // 提取 base64 编码部分
        const base64Part = mainUrl.substring(5); // 移除 'ss://'

        // 检查是否包含 @ 符号，如果包含说明已经是标准格式
        if (base64Part.includes('@')) {
            return sipUrl;
        }

        try {
            // 解码 base64 获取完整配置: method:password@server:port
            const decodedConfig = base64Decode(base64Part);

            // 解析格式: method:password@server:port
            const atIndex = decodedConfig.lastIndexOf('@');
            if (atIndex === -1) {
                throw new Error('Invalid SIP002 format: missing @ separator');
            }

            const userInfo = decodedConfig.substring(0, atIndex); // method:password
            const serverPart = decodedConfig.substring(atIndex + 1); // server:port

            const colonIndex = userInfo.indexOf(':');
            if (colonIndex === -1) {
                throw new Error('Invalid user info: missing colon separator');
            }

            const method = userInfo.substring(0, colonIndex);
            const password = userInfo.substring(colonIndex + 1);

            // 解析服务器和端口
            const lastColonIndex = serverPart.lastIndexOf(':');
            if (lastColonIndex === -1) {
                throw new Error('Invalid server info: missing port');
            }

            const server = serverPart.substring(0, lastColonIndex);
            const port = serverPart.substring(lastColonIndex + 1);

            if (!method || !password || !server || !port) {
                throw new Error('Invalid format: missing required fields');
            }

            // 构造标准新版 URI 格式的 userinfo (method:password)
            const newUserInfo = `${method}:${password}`;
            const encodedNewUserInfo = base64Encode(newUserInfo);

            // 构造标准新版 URI 格式
            let newUrl = `ss://${encodedNewUserInfo}@${server}:${port}`;

            // 添加默认参数 type=tcp
            newUrl += '?type=tcp';

            // 添加 fragment (备注)
            if (fragment) {
                newUrl += fragment;
            }

            return newUrl;
        } catch {
            return sipUrl;
        }
    }
}
