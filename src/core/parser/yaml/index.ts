import type { ClashType } from 'src/types';
import { hysteriaConvert } from './protocol/hysteria';
import { hysteria2Convert } from './protocol/hysteria2';
import { shadowsocksConvert } from './protocol/shadowsocks';
import { shadowsocksRConvert } from './protocol/shadowsocksR';
import { trojanConvert } from './protocol/trojan';
import { vlessConvert } from './protocol/vless';
import { vmessConvert } from './protocol/vmess';

export function getYamlProxies(proxies: ClashType['proxies']): string[] {
    const proxiesList: string[] = [];
    for (const proxy of proxies) {
        try {
            if (proxy.type === 'vmess') {
                proxiesList.push(vmessConvert(proxy));
            }

            if (proxy.type === 'trojan') {
                proxiesList.push(trojanConvert(proxy));
            }

            if (proxy.type === 'vless') {
                proxiesList.push(vlessConvert(proxy));
            }

            if (proxy.type === 'ss') {
                proxiesList.push(shadowsocksConvert(proxy));
            }
            if (proxy.type === 'ssr') {
                proxiesList.push(shadowsocksRConvert(proxy));
            }

            if (proxy.type === 'hysteria2' || proxy.type === 'hy2') {
                proxiesList.push(hysteria2Convert(proxy));
            }

            if (proxy.type === 'hysteria') {
                proxiesList.push(hysteriaConvert(proxy));
            }
        } catch {
            continue;
        }
    }

    return proxiesList;
}
