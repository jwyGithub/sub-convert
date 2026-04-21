import type { ParserType } from '../parser/types';
import { Hysteria2Parser, SsParser, SsrParser, TrojanParser, VlessParser, VmessParser } from '../parser';

export class FormatPs {
    private existVps: string[] = [];

    private existVpsMap: Map<string, number> = new Map();

    constructor(existVps: string[] = []) {
        this.existVps = existVps;
        this.updateExist(this.existVps);
    }

    public updateExist(existVps: string[] = []): void {
        for (const vps of existVps) {
            const parser = this.getParser(vps);
            if (parser) {
                this.setExistVpsMap(parser);
            }
        }
    }

    public updateVpsPs(vps: string): string | null {
        const parser = this.getParser(vps);
        if (!parser) return null;

        const ps = parser.originPs;
        const [name, suffix] = ps.split('#');

        if (!suffix) return vps;

        const count = this.existVpsMap.get(suffix) || 0;
        const newPs = count === 0 ? ps : `${name}#${suffix} ${count}`;

        parser.updateOriginConfig(newPs);
        this.existVpsMap.set(suffix, count + 1);

        return parser.originLink;
    }

    private setExistVpsMap(parser: ParserType): void {
        const ps = parser.originPs;
        const [, suffix] = ps.split('#');
        if (!suffix) return;

        const [suffixName, countStr] = suffix.split(' ');
        const count = countStr ? Number.parseInt(countStr) >>> 0 : 0;
        const currentMax = this.existVpsMap.get(suffixName) || 0;
        this.existVpsMap.set(suffixName, Math.max(currentMax, count + 1));
    }

    private getParser(vps: string): ParserType | null {
        if (vps.startsWith('vless://')) {
            return new VlessParser(vps);
        }
        if (vps.startsWith('vmess://')) {
            return new VmessParser(vps);
        }
        if (vps.startsWith('trojan://')) {
            return new TrojanParser(vps);
        }
        if (vps.startsWith('ss://')) {
            return new SsParser(vps);
        }
        if (vps.startsWith('ssr://')) {
            return new SsrParser(vps);
        }
        if (vps.startsWith('hysteria2://') || vps.startsWith('hysteria://') || vps.startsWith('hy2://')) {
            return new Hysteria2Parser(vps);
        }

        return null;
    }
}
