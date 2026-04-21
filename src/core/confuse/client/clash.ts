import type { ClashType } from '../../../types';
import { fetchWithRetry } from 'cloudflare-tools';
import { load } from 'js-yaml';

export class ClashClient {
    public async getConfig(urls: string[]): Promise<ClashType> {
        try {
            const configs = await Promise.all(urls.map(url => fetchWithRetry(url, { retries: 3 }).then(r => r.data.text())));
            const clashConfigs = configs.map(config => load(config) as ClashType);
            const mergedConfig = this.mergeClashConfig(clashConfigs);
            return mergedConfig;
        } catch (error: any) {
            throw new Error(`Failed to get clash config: ${error.message || error}`);
        }
    }

    /**
     * 对比两个 proxies 数组是否完全相同
     * 使用 Set 对比，忽略顺序差异
     */
    private isSameProxies(arr1: string[], arr2: string[]): boolean {
        if (arr1.length !== arr2.length) return false;
        const set1 = new Set(arr1);
        return arr2.every(item => set1.has(item));
    }

    /**
     * 合并两个 proxies 数组，去重并保持顺序
     * 时间复杂度: O(n)，使用 Set 优化查找
     */
    private mergeGroupProxies(existing: string[], incoming: string[]): string[] {
        const seen = new Set(existing);
        const result = [...existing];
        for (const proxy of incoming) {
            if (!seen.has(proxy)) {
                seen.add(proxy);
                result.push(proxy);
            }
        }
        return result;
    }

    /**
     * @description 合并配置
     * @param {ClashType[]} configs
     * @returns {ClashType} mergedConfig
     */
    private mergeClashConfig(configs: ClashType[] = []): ClashType {
        try {
            if (!configs.length) {
                return {} as ClashType;
            }

            // 如果只有一个配置，直接返回
            if (configs.length === 1) {
                return configs[0];
            }

            // 合并 proxies: 直接展开所有配置的 proxies
            const mergedProxies: Array<Record<string, string>> = [];
            for (const config of configs) {
                if (config.proxies?.length) {
                    mergedProxies.push(...config.proxies);
                }
            }

            // 合并 proxy-groups: 使用 Map 存储，O(1) 查找
            const groupMap = new Map<string, ClashType['proxy-groups'][0]>();
            const groupOrder: string[] = [];

            for (const config of configs) {
                if (!config['proxy-groups']?.length) continue;

                for (const group of config['proxy-groups']) {
                    const existingGroup = groupMap.get(group.name);

                    if (!existingGroup) {
                        // Map 中不存在该组名，直接添加
                        groupMap.set(group.name, {
                            ...group,
                            proxies: [...(group.proxies || [])] // 浅拷贝数组
                        });
                        groupOrder.push(group.name);
                    } else {
                        // Map 中已存在该组名，判断 proxies 是否相同
                        const existingProxies = existingGroup.proxies || [];
                        const incomingProxies = group.proxies || [];

                        if (!this.isSameProxies(existingProxies, incomingProxies)) {
                            // proxies 不同，合并差异部分
                            existingGroup.proxies = this.mergeGroupProxies(existingProxies, incomingProxies);
                        }
                        // proxies 相同则跳过，保持不变
                    }
                }
            }

            // 构建合并后的配置
            const mergedConfig: ClashType = {
                ...configs[0], // 保留第一个配置的其他属性
                proxies: mergedProxies,
                'proxy-groups': groupOrder.map(name => groupMap.get(name)!)
            };

            return mergedConfig;
        } catch (error: any) {
            throw new Error(`Failed to merge clash config: ${error.message || error}`);
        }
    }
}
