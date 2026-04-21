import type { V2RayType } from '../../../types/V2Ray';
import { tryBase64Encode } from 'cloudflare-tools';
import { Parser } from '../../parser';

export class V2RayClient extends Parser {
    public async getConfig(_: string[], vps: string[]): Promise<V2RayType> {
        try {
            await this.parse(vps);
            return tryBase64Encode(this.originVps.join('\n'));
        } catch (error: any) {
            throw new Error(`Failed to get v2ray config: ${error.message || error}`);
        }
    }
}
