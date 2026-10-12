import { dump } from 'js-yaml';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClashClient } from '../../../src/core/confuse/client/clash';

// mock cloudflare-tools 的 fetchWithRetry，避免真实网络请求
const { fetchWithRetry } = vi.hoisted(() => ({ fetchWithRetry: vi.fn() }));
vi.mock('cloudflare-tools', () => ({ fetchWithRetry }));

/**
 * 把 { url: 配置对象 } 的映射转换成被 mock 的订阅响应（序列化为 YAML 文本），
 * 以此驱动 ClashClient.getConfig 的「拉取 -> 解析 -> 合并」完整链路。
 */
function mockSubscriptions(subs: Record<string, Record<string, any>>): void {
    fetchWithRetry.mockImplementation((url: string) =>
        Promise.resolve({
            data: {
                text: () => Promise.resolve(dump(subs[url]))
            }
        })
    );
}

describe('clashClient 合并逻辑', () => {
    let client: ClashClient;

    beforeEach(() => {
        client = new ClashClient();
        fetchWithRetry.mockReset();
    });

    it('空订阅列表返回空对象且不发起请求', async () => {
        const result = await client.getConfig([]);
        expect(result).toEqual({});
        expect(fetchWithRetry).not.toHaveBeenCalled();
    });

    it('单个订阅直接原样返回（解析后）', async () => {
        const only = {
            mode: 'rule',
            proxies: [{ name: 'A', server: '1.1.1.1' }],
            'proxy-groups': [{ name: 'G', type: 'select', proxies: ['A'] }]
        };
        mockSubscriptions({ u1: only });

        const result = await client.getConfig(['u1']);
        expect(result).toEqual(only);
    });

    it('保留重复节点：proxies 直接追加，不做去重', async () => {
        mockSubscriptions({
            u1: {
                proxies: [
                    { name: 'A', server: '1.1.1.1' },
                    { name: 'B', server: '2.2.2.2' }
                ],
                'proxy-groups': []
            },
            u2: {
                proxies: [
                    { name: 'A', server: '3.3.3.3' },
                    { name: 'C', server: '4.4.4.4' }
                ],
                'proxy-groups': []
            }
        });

        const result = await client.getConfig(['u1', 'u2']);

        // 两个同名 A 都应保留，顺序与追加顺序一致
        expect(result.proxies.map(p => p.name)).toEqual(['A', 'B', 'A', 'C']);
        expect(result.proxies).toHaveLength(4);
        // 确认是不同的两个 A（server 不同）
        const aNodes = result.proxies.filter(p => p.name === 'A');
        expect(aNodes.map(p => p.server)).toEqual(['1.1.1.1', '3.3.3.3']);
    });

    it('proxy-groups 按组名合并：组内去重且保持顺序', async () => {
        mockSubscriptions({
            u1: {
                proxies: [],
                'proxy-groups': [
                    { name: 'PROXY', type: 'select', proxies: ['A', 'B'] },
                    { name: 'AUTO', type: 'url-test', proxies: ['A'] }
                ]
            },
            u2: {
                proxies: [],
                'proxy-groups': [
                    { name: 'PROXY', type: 'select', proxies: ['B', 'C'] },
                    { name: 'REGION', type: 'select', proxies: ['C'] }
                ]
            }
        });

        const result = await client.getConfig(['u1', 'u2']);
        const groups = result['proxy-groups'];

        // 分组出现顺序：先第一份配置的分组，再追加后续新增分组
        expect(groups.map(g => g.name)).toEqual(['PROXY', 'AUTO', 'REGION']);
        // PROXY 合并去重并保持顺序：[A,B] + [B,C] => [A,B,C]
        expect(groups.find(g => g.name === 'PROXY')?.proxies).toEqual(['A', 'B', 'C']);
        expect(groups.find(g => g.name === 'AUTO')?.proxies).toEqual(['A']);
        expect(groups.find(g => g.name === 'REGION')?.proxies).toEqual(['C']);
    });

    it('保留第一个配置的其它字段（rules、mode 等），不被后续配置覆盖', async () => {
        mockSubscriptions({
            u1: {
                mode: 'rule',
                rules: ['DOMAIN,a.com,PROXY'],
                proxies: [{ name: 'A', server: '1.1.1.1' }],
                'proxy-groups': [{ name: 'G', type: 'select', proxies: ['A'] }]
            },
            u2: {
                mode: 'global',
                rules: ['DOMAIN,b.com,DIRECT'],
                proxies: [{ name: 'B', server: '2.2.2.2' }],
                'proxy-groups': [{ name: 'G', type: 'select', proxies: ['B'] }]
            }
        });

        const result = await client.getConfig(['u1', 'u2']);

        expect(result.mode).toBe('rule');
        expect(result.rules).toEqual(['DOMAIN,a.com,PROXY']);
        expect(result.proxies.map(p => p.name)).toEqual(['A', 'B']);
        expect(result['proxy-groups'].find(g => g.name === 'G')?.proxies).toEqual(['A', 'B']);
    });

    it('保持第一个配置的原始字段顺序（proxies / proxy-groups 不被挪到末尾）', async () => {
        mockSubscriptions({
            u1: {
                dns: { enable: true },
                proxies: [{ name: 'A', server: '1.1.1.1' }],
                'proxy-groups': [{ name: 'G', type: 'select', proxies: ['A'] }],
                rules: ['DOMAIN,a.com,PROXY']
            },
            u2: {
                dns: { enable: false },
                proxies: [{ name: 'B', server: '2.2.2.2' }],
                'proxy-groups': [{ name: 'G', type: 'select', proxies: ['B'] }],
                rules: ['DOMAIN,b.com,DIRECT']
            }
        });

        const result = await client.getConfig(['u1', 'u2']);

        // 输出的字段顺序应与第一份配置完全一致，而不是把 proxies/proxy-groups 排到末尾
        expect(Object.keys(result)).toEqual(['dns', 'proxies', 'proxy-groups', 'rules']);
    });

    it('缺少 proxies / proxy-groups 字段时也能正常合并', async () => {
        mockSubscriptions({
            u1: { proxies: [{ name: 'A', server: '1.1.1.1' }] }, // 没有 proxy-groups
            u2: { 'proxy-groups': [{ name: 'G', type: 'select', proxies: ['A'] }] } // 没有 proxies
        });

        const result = await client.getConfig(['u1', 'u2']);
        expect(result.proxies.map(p => p.name)).toEqual(['A']);
        expect(result['proxy-groups'].map(g => g.name)).toEqual(['G']);
    });

    it('请求失败时抛出带前缀的错误', async () => {
        fetchWithRetry.mockRejectedValue(new Error('network down'));
        await expect(client.getConfig(['u1'])).rejects.toThrow('Failed to get clash config');
    });
});
