import type { ClashType, SingboxType, V2RayType } from '../../types';
import type { Confuse } from '../confuse';
import { ClashClient } from './client/clash';
import { SingboxClient } from './client/singbox';
import { V2RayClient } from './client/v2ray';

export class Restore {
    constructor(private confuse: Confuse) {
        this.confuse = confuse;
    }

    public async getClashConfig(request: Request): Promise<ClashType> {
        const clashConfuseConfig = await this.confuse.getClashConfig(request);
        const clashClient = new ClashClient(clashConfuseConfig);
        return clashClient.getOriginConfig(this.confuse.vpsStore!);
    }

    public async getSingboxConfig(request: Request): Promise<SingboxType> {
        const singboxConfuseConfig = await this.confuse.getSingboxConfig(request);
        const singboxClient = new SingboxClient(singboxConfuseConfig);
        return singboxClient.getOriginConfig(this.confuse.vpsStore!);
    }

    public async getV2RayConfig(): Promise<V2RayType> {
        const v2rayConfuseConfig = await this.confuse.getV2RayConfig();
        const v2rayClient = new V2RayClient(v2rayConfuseConfig);
        return v2rayClient.getOriginConfig();
    }
}

