import type { ClashType, VpsMap } from '../../../types';
import { PsUtil } from '../../../shared/ps';

export class ClashClient {
    private confuseConfig: ClashType;

    constructor(confuseConfig: ClashType) {
        this.confuseConfig = confuseConfig;
    }

    public getOriginConfig(vpsMap: VpsMap): ClashType {
        try {
            this.confuseConfig.proxies = this.restoreProxies(this.confuseConfig.proxies, vpsMap);
            this.confuseConfig['proxy-groups'] = this.confuseConfig?.['proxy-groups']?.map(group => {
                if (group.proxies) {
                    group.proxies = this.updateProxiesGroups(group.proxies);
                }
                return group;
            });

            return this.confuseConfig;
        } catch (error: any) {
            throw new Error(`Get origin config failed: ${error.message || error}, function trace: ${error.stack}`);
        }
    }

    private restoreProxies(proxies: Array<Record<string, string>> | null, vpsMap: VpsMap): Array<Record<string, string>> {
        const result: Array<Record<string, string>> = [];
        if (!proxies) {
            return result;
        }
        for (const proxy of proxies) {
            try {
                const [originPs, confusePs] = PsUtil.getPs(proxy.name);
                if (vpsMap.has(confusePs)) {
                    const vps = vpsMap.get(confusePs);
                    vps?.restoreClash(proxy, originPs);
                    result.push(proxy);
                }
            } catch (error: any) {
                console.warn(`Restore proxies failed: ${error.message || error}, function trace: ${error.stack}`);
                continue;
            }
        }

        return result;
    }

    private updateProxiesGroups(proxies: string[]): string[] {
        try {
            return proxies.map(proxy => {
                const [originPs] = PsUtil.getPs(proxy);
                return originPs;
            });
        } catch (error: any) {
            throw new Error(`Update proxies groups failed: ${error.message || error}, function trace: ${error.stack}`);
        }
    }
}
