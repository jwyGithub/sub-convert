import type { SubType } from '../../types';
import type { ParserType } from './types';
import { base64Decode, fetchWithRetry } from 'cloudflare-tools';
import { load } from 'js-yaml';
import { Convert } from '../convert';
import { Hysteria2Parser } from './protocol/hysteria2';
import { SsParser } from './protocol/ss';
import { SsrParser } from './protocol/ssr';
import { TrojanParser } from './protocol/trojan';
import { VlessParser } from './protocol/vless';
import { VmessParser } from './protocol/vmess';
import { getYamlProxies } from './yaml';

export * from './protocol/hysteria2';
export * from './protocol/ss';
export * from './protocol/ssr';
export * from './protocol/trojan';
export * from './protocol/vless';
export * from './protocol/vmess';

export class Parser extends Convert {
    private urlSet: Set<string> = new Set<string>();
    private vpsStore: Map<string, ParserType> = new Map();
    private originUrls: Set<string> = new Set<string>();

    private vps: string[] = [];
    private includeProtocol: string[] = [];

    constructor(vps: string[], existedVps: string[] = [], protocol: string | null = '') {
        super(existedVps);
        this.vps = vps;
        this.includeProtocol = protocol ? JSON.parse(protocol) : [];
    }

    public async parse(vps: string[] = this.vps): Promise<void> {
        for await (const v of vps) {
            try {
                const processVps = this.updateVpsPs(v);
                if (processVps) {
                    let parser: ParserType | null = null;

                    if (processVps.startsWith('vless://') && this.hasProtocol('vless')) {
                        parser = new VlessParser(processVps);
                    } else if (processVps.startsWith('vmess://') && this.hasProtocol('vmess')) {
                        parser = new VmessParser(processVps);
                    } else if (processVps.startsWith('trojan://') && this.hasProtocol('trojan')) {
                        parser = new TrojanParser(processVps);
                    } else if (processVps.startsWith('ss://') && this.hasProtocol('shadowsocks')) {
                        parser = new SsParser(processVps);
                    } else if (processVps.startsWith('ssr://') && this.hasProtocol('shadowsocksr')) {
                        parser = new SsrParser(processVps);
                    } else if (this.isHysteria2(processVps) && this.hasProtocol('hysteria', 'hysteria2', 'hy2')) {
                        parser = new Hysteria2Parser(processVps);
                    }

                    if (parser) {
                        this.setStore(processVps, parser);
                    }
                }

                if (v.startsWith('https://') || v.startsWith('http://')) {
                    const subContent = await fetchWithRetry(v, { retries: 3 }).then(async r => r.data.text());
                    const { subType, content } = this.getSubType(subContent);

                    if (subType === 'base64' && content) {
                        this.updateExist(Array.from(this.originUrls));
                        await this.parse(content.split('\n').filter(Boolean));
                    }

                    if (subType === 'yaml' && content) {
                        const proxies = content.proxies;
                        if (proxies.length) {
                            this.updateExist(Array.from(this.originUrls));
                            const vps = getYamlProxies(proxies);
                            await this.parse(vps.filter(Boolean));
                        }
                    }
                }
            } catch {
                continue;
            }
        }
    }

    private setStore(v: string, parser: ParserType): void {
        this.urlSet.add(parser.confuseLink);
        this.originUrls.add(v);
        this.vpsStore.set(parser.confusePs, parser);
    }

    private getSubType(content: string): {
        subType: SubType;
        content: any;
    } {
        try {
            const subContent = base64Decode(content);
            return {
                subType: 'base64',
                content: subContent
            };
        } catch {
            try {
                const subContent = load(content);
                return {
                    subType: 'yaml',
                    content: subContent
                };
            } catch {
                try {
                    const subContent = JSON.parse(content);
                    return {
                        subType: 'json',
                        content: JSON.stringify(subContent)
                    };
                } catch {
                    return {
                        subType: 'unknown',
                        content
                    };
                }
            }
        }
    }

    private isHysteria2(vps: string): boolean {
        return vps.startsWith('hysteria2://') || vps.startsWith('hysteria://') || vps.startsWith('hy2://');
    }

    private hasProtocol(...args: string[]): boolean {
        return this.includeProtocol.length === 0 || args.some(p => this.includeProtocol.includes(p));
    }

    public get urls(): string[] {
        return Array.from(this.urlSet);
    }

    public get vpsMap(): Map<string, ParserType> {
        return this.vpsStore;
    }

    public get originVps(): string[] {
        return Array.from(this.originUrls);
    }
}
