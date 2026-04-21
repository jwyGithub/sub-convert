import type { V2RayType } from '../../../types/V2Ray';

export class V2RayClient {
    private confuseConfig: V2RayType;

    constructor(confuseConfig: V2RayType) {
        this.confuseConfig = confuseConfig;
    }

    public getOriginConfig(): V2RayType {
        try {
            return this.confuseConfig;
        } catch (error: any) {
            throw new Error(`Get origin config failed: ${error.message || error}, function trace: ${error.stack}`);
        }
    }
}
