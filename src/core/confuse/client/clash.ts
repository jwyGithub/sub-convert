import type { ClashType } from '../../../types';
import { fetchWithRetry } from 'cloudflare-tools';
import { load } from 'js-yaml';
import { Search } from '../../../shared/search';

export class ClashClient {
    public async getConfig({ request, urls, backend }: { request: Request; urls: string[]; backend: string }): Promise<ClashType> {
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
            return load(config) as ClashType;
        } catch (error: any) {
            throw new Error(`Failed to get clash config: ${error.message || error}`);
        }
    }
}

