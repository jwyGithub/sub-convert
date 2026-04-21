import { base64Encode } from 'cloudflare-tools';

function base64UrlEncode(str: string): string {
    return base64Encode(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * 将 ShadowsocksR 配置对象转换为 SSR 标准协议 URL
 * @param {object} config - ShadowsocksR 配置对象
 * @returns {string} SSR 标准协议 URL (ssr://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function shadowsocksRConvert(config: Record<string, any>): string {
    if (!config || !config.server || !config.port || !config.protocol || !config.method || !config.obfs || !config.password) {
        throw new Error('ShadowsocksR configuration object must contain server, port, protocol, method, obfs, and password.');
    }

    const server = config.server;
    const port = config.port;
    const protocol = config.protocol;
    const method = config.method || config.cipher; // 有些配置可能用 cipher
    const obfs = config.obfs;
    const password = config.password;
    const obfsParam = config['obfs-param'] || '';
    const protocolParam = config['protocol-param'] || '';
    const remarks = config.name || '';

    const passwordBase64 = base64UrlEncode(password);

    let coreString = `${server}:${port}:${protocol}:${method}:${obfs}:${passwordBase64}/`;

    const paramsForEncoding = new URLSearchParams();

    if (obfsParam) {
        const obfsParamBase64 = base64UrlEncode(obfsParam);
        paramsForEncoding.append('obfsparam', obfsParamBase64);
    }
    if (protocolParam) {
        const protocolParamBase64 = base64UrlEncode(protocolParam);
        paramsForEncoding.append('protoparam', protocolParamBase64);
    }

    const paramsStringForEncoding = paramsForEncoding.toString();
    if (paramsStringForEncoding) {
        coreString += `?${paramsStringForEncoding}`;
    }

    const base64EncodedString = base64UrlEncode(coreString);

    const encodedRemarks = encodeURIComponent(remarks);

    let ssrUrl = `ssr://${base64EncodedString}`;

    // 添加备注 (如果存在)
    if (remarks) {
        ssrUrl += `#${encodedRemarks}`;
    }

    return ssrUrl;
}
