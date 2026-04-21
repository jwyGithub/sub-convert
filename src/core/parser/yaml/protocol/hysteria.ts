import { base64Encode } from 'cloudflare-tools';
import { hasKey } from '../../../../shared';

/**
 * 将 Hysteria 配置对象转换为 Hysteria 标准协议 URL
 * @param {object} config - Hysteria 配置对象
 * @returns {string} Hysteria 标准协议 URL (hysteria://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function hysteriaConvert(config: Record<string, any>): string {
    const auth = config.password || config.auth || config.auth_str;

    if (!config || !config.server || !config.port || !auth) {
        throw new Error('Hysteria configuration object must contain server, port, and authentication (password, auth, or auth_str).');
    }

    const server = config.server;
    const port = config.port;
    const remarks = config.name || ''; // 备注/别名

    const parameters = new URLSearchParams();

    // 核心认证参数
    parameters.append('auth', auth);

    if (config.peerCA) {
        parameters.append('peerCA', base64Encode(config.peerCA).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')); // peerCA 通常 Base64 编码
    }
    // insecure 参数对应 skip-cert-verify
    if (config.insecure || config['skip-cert-verify']) {
        parameters.append('insecure', '1');
    }
    if (config.alpn && (typeof config.alpn === 'string' || Array.isArray(config.alpn))) {
        parameters.append('alpn', Array.isArray(config.alpn) ? config.alpn.join(',') : config.alpn);
    }

    if (config.upmbps !== undefined && config.upmbps !== null) {
        parameters.append('upmbps', config.upmbps.toString());
    }
    if (config.downmbps !== undefined && config.downmbps !== null) {
        parameters.append('downmbps', config.downmbps.toString());
    }

    if (config.obfs) {
        parameters.append('obfs', config.obfs);
    }
    if (config['obfs-param']) {
        parameters.append('obfs-param', config['obfs-param']);
    }

    if (hasKey(config, 'up')) {
        parameters.append('up', config.up);
    }

    if (hasKey(config, 'down')) {
        parameters.append('down', config.down);
    }

    if (hasKey(config, 'delay')) {
        parameters.append('delay', config.delay);
    }

    if (hasKey(config, 'sni')) {
        parameters.append('sni', config.sni);
    }

    const queryString = parameters.toString();

    const encodedServer = encodeURIComponent(server);
    const encodedRemarks = encodeURIComponent(remarks);

    let hysteriaUrl = `hysteria://${encodedServer}:${port}`;
    if (queryString) {
        hysteriaUrl += `?${queryString}`;
    }
    if (remarks) {
        hysteriaUrl += `#${encodedRemarks}`;
    }

    return hysteriaUrl;
}
