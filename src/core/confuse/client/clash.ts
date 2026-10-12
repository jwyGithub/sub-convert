import type { ClashType } from '../../../types';
import { fetchWithRetry } from 'cloudflare-tools';
import { load } from 'js-yaml';

export class ClashClient {
    public async getConfig(urls: string[]): Promise<ClashType> {
        try {
            // 并行拉取各订阅文本以降低延迟；解析与合并在 mergeClashConfig 内逐个进行，
            // 避免同时在内存中驻留所有订阅的「解析后对象树」(Worker 内存上限 128MB)。
            const rawConfigs = await Promise.all(urls.map(url => fetchWithRetry(url, { retries: 3 }).then(r => r.data.text())));
            return this.mergeClashConfig(rawConfigs);
        } catch (error: any) {
            throw new Error(`Failed to get clash config: ${error.message || error}`);
        }
    }

    /**
     * @description 逐个解析并合并 Clash 配置
     * - proxies: 直接追加，保留重复节点（不做去重）
     * - proxy-groups: 按组名合并，组内引用去重并保持顺序
     * 内存优化：边解析边合并，解析完立即释放原始文本，任一时刻最多只持有一份解析树。
     * @param {string[]} rawConfigs 各订阅的原始 YAML 文本
     * @returns {ClashType} mergedConfig
     */
    private mergeClashConfig(rawConfigs: string[] = []): ClashType {
        try {
            if (!rawConfigs.length) {
                return {} as ClashType;
            }

            // 只有一个配置时直接解析返回
            if (rawConfigs.length === 1) {
                return load(rawConfigs[0]) as ClashType;
            }

            // 使用局部别名以便在解析后释放原始文本（不直接改写入参）
            const sources = rawConfigs;

            // proxies: 保留重复，直接追加
            const mergedProxies: ClashType['proxies'] = [];

            // proxy-groups: 每个分组维护一个常驻 Set 做 O(1) 去重，并原地 push，
            // 避免每并入一份配置就重建 Set / 全量复制数组（原实现对订阅数近似二次）。
            const groupMap = new Map<string, ClashType['proxy-groups'][number]>();
            const groupSeen = new Map<string, Set<string>>();
            const groupOrder: string[] = [];

            // 仅保留第一个配置里除 proxies / proxy-groups 外的其他字段（如 rules、dns 等），
            // 这样第一份配置的 proxies/proxy-groups 原始容器可被尽早回收。
            let base: Record<string, any> | null = null;
            // 记录第一份配置的原始键顺序（含 proxies / proxy-groups 的位置），
            // 以便最终输出时与原配置文件保持一致的字段顺序（不写死顺序）。
            let keyOrder: string[] = [];

            for (let i = 0; i < sources.length; i++) {
                const config = load(sources[i]) as ClashType;
                // 解析完立即释放原始文本，便于 GC 回收
                sources[i] = '';

                if (base === null) {
                    base = {};
                    keyOrder = Object.keys(config);
                    for (const key of keyOrder) {
                        if (key !== 'proxies' && key !== 'proxy-groups') {
                            base[key] = (config as Record<string, any>)[key];
                        }
                    }
                }

                // proxies: 逐个追加（用循环而非 push(...spread)，规避超大数组的参数上限）
                if (config.proxies?.length) {
                    for (const proxy of config.proxies) {
                        mergedProxies.push(proxy);
                    }
                }

                // proxy-groups: 按组名合并，组内去重并保持顺序
                const groups = config['proxy-groups'];
                if (groups?.length) {
                    for (const group of groups) {
                        const existingGroup = groupMap.get(group.name);
                        if (!existingGroup) {
                            const proxies = [...(group.proxies ?? [])];
                            groupMap.set(group.name, { ...group, proxies });
                            groupSeen.set(group.name, new Set(proxies));
                            groupOrder.push(group.name);
                        } else {
                            const seen = groupSeen.get(group.name)!;
                            const target = existingGroup.proxies!;
                            for (const proxy of group.proxies ?? []) {
                                if (!seen.has(proxy)) {
                                    seen.add(proxy);
                                    target.push(proxy);
                                }
                            }
                        }
                    }
                }
                // 本轮解析树 config 不再被引用（proxy 对象已被 mergedProxies 持有），可被 GC
            }

            // 按第一份配置的原始键顺序重建对象，将合并后的 proxies / proxy-groups
            // 放回它们在原配置中的位置；若原配置缺少这两个字段则补到末尾。
            const mergedGroups = groupOrder.map(name => groupMap.get(name)!);
            const merged: Record<string, any> = {};
            let proxiesPlaced = false;
            let groupsPlaced = false;
            for (const key of keyOrder) {
                if (key === 'proxies') {
                    merged.proxies = mergedProxies;
                    proxiesPlaced = true;
                } else if (key === 'proxy-groups') {
                    merged['proxy-groups'] = mergedGroups;
                    groupsPlaced = true;
                } else {
                    merged[key] = (base as Record<string, any>)[key];
                }
            }
            if (!proxiesPlaced) merged.proxies = mergedProxies;
            if (!groupsPlaced) merged['proxy-groups'] = mergedGroups;

            return merged as ClashType;
        } catch (error: any) {
            throw new Error(`Failed to merge clash config: ${error.message || error}`);
        }
    }
}
