import type { SingboxOutboundType, SingboxType, VpsMap } from '../../../types';
import { PsUtil } from '../../../shared/ps';

export class SingboxClient {
    private confuseConfig: SingboxType;

    constructor(confuseConfig: SingboxType) {
        this.confuseConfig = confuseConfig;
    }

    public getOriginConfig(vpsMap: VpsMap): SingboxType {
        try {
            this.confuseConfig.outbounds = this.restoreOutbounds(this.confuseConfig.outbounds, vpsMap);
            return this.confuseConfig;
        } catch (error: any) {
            throw new Error(`Get origin config failed: ${error.message || error}, function trace: ${error.stack}`);
        }
    }

    private restoreOutbounds(outbounds: SingboxType['outbounds'] = [], vpsMap: VpsMap): SingboxType['outbounds'] {
        const result: SingboxType['outbounds'] = [];
        if (!outbounds) {
            return result;
        }
        for (const outbound of outbounds) {
            try {
                if (this.isConfuseVps(outbound.tag)) {
                    const [originPs, confusePs] = PsUtil.getPs(outbound.tag);
                    const vps = vpsMap.get(confusePs);
                    vps?.restoreSingbox(outbound, originPs);
                }

                if (Reflect.has(outbound, 'outbounds')) {
                    outbound.outbounds = this.updateOutbouns(outbound.outbounds);
                }
                result.push(outbound);
            } catch (error: any) {
                console.warn(`Restore outbounds failed: ${error.message || error}, function trace: ${error.stack}`);
                continue;
            }
        }
        return result;
    }

    private updateOutbouns(outbounds: string[] | undefined = []): string[] {
        try {
            return outbounds.map(outbound => {
                if (this.isConfuseVps(outbound)) {
                    const [originPs] = PsUtil.getPs(outbound);
                    return originPs;
                }
                return outbound;
            });
        } catch (error: any) {
            throw new Error(`Update outbounds failed: ${error.message || error}, function trace: ${error.stack}`);
        }
    }

    private isConfuseVps(tag: SingboxOutboundType['tag']): boolean {
        return PsUtil.isConfigType(tag);
    }
}
