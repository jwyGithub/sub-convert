import type { SingboxType } from '../../../types';
import { fetchWithRetry } from 'cloudflare-tools';
import { Search } from '../../../shared/search';

export class SingboxClient {
    public async getConfig({ request, urls, backend }: { request: Request; urls: string[]; backend: string }): Promise<SingboxType> {
        try {
            const { searchParams } = new URL(request.url);
            const subSearchParams = Search.omit(searchParams, ['url', 'protocol']);
            const config = await fetchWithRetry(new URL('/forward', request.url).toString(), {
                retries: 3,
                headers: new Headers({
                    'x-forward-urls': urls.join('|'),
                    'x-forward-backend': backend,
                    'x-forward-search': subSearchParams.toString()
                })
            }).then(r => r.data.text());
            return JSON.parse(config);
        } catch (error: any) {
            throw new Error(`Failed to get singbox config: ${error.message || error}`);
        }
    }
}

