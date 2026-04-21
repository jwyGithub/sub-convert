import { base64Encode } from 'cloudflare-tools';

/**
 * 将 Shadowsocks (SS) 配置对象转换为 SS 标准协议 URL
 * @param {object} config - Shadowsocks 配置对象
 * @returns {string} SS 标准协议 URL (ss://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function shadowsocksConvert(config: Record<string, any>): string {
    if (!config || !config.server || !config.port || !config.cipher || !config.password) {
        throw new Error('Shadowsocks configuration object must contain server, port, cipher, and password.');
    }

    const method = config.cipher;
    const password = config.password;
    const server = config.server;
    const port = config.port;
    const remarks = config.name || ''; // 别名/备注

    const userInfoString = `${method}:${password}`;
    const base64UserInfo = base64Encode(userInfoString);

    const parameters = new URLSearchParams();

    // 添加传输协议类型参数 (type)
    const network = config.network || 'tcp';
    if (network !== 'tcp' || config.network) {
        // 如果明确指定了 network，即使是 tcp 也加上
        parameters.append('type', network);
    }

    // 处理 TLS 相关参数 (同样是在扩展用法中常见)
    if (config.tls) {
        // 如果配置中有 tls: true
        parameters.append('security', 'tls');
        const sni = config.sni || config.servername || config.server;
        if (sni) {
            parameters.append('sni', sni);
        }
        if (config['client-fingerprint']) {
            // client-fingerprint 对应 fp 参数
            parameters.append('fp', config['client-fingerprint']);
        }
        if (config['skip-cert-verify']) {
            // skip-cert-verify 对应 allowInsecure 参数
            parameters.append('allowInsecure', '1');
        }
    }

    // 处理不同的网络类型特有的参数 (在扩展用法中)
    switch (network) {
        case 'ws': // WebSocket
        case 'http': {
            // HTTP/2
            const opts = config['ws-opts'] || config['http-opts'] || {};
            // Host 参数：优先 headers 中的 Host，其次是 SNI，最后是 server
            let transportHost;
            if (opts.headers && opts.headers.Host) {
                transportHost = opts.headers.Host; // 修正过的，去掉了多余的 .headers
            } else if (config.sni || config.servername) {
                transportHost = config.sni || config.servername;
            } else {
                transportHost = config.server;
            }
            if (transportHost) {
                parameters.append('host', transportHost);
            }

            // Path 参数
            const path = opts.path || '/';
            // 只有当 path 不是默认的 "/" 时才添加参数
            if (path !== '/') {
                parameters.append('path', path);
            }
            break;
        }
        case 'grpc': {
            // gRPC
            const grpcOpts = config['grpc-opts'] || {};
            if (grpcOpts.serviceName) {
                parameters.append('serviceName', grpcOpts.serviceName);
            }
            break;
        }
        // kcp, quic 等可能也有参数，但不太常见于标准 URI 参数中
    }

    if (config.tfo) {
        parameters.append('tfo', '1');
    }
    if (config.udp) {
        parameters.append('udp', '1');
    }

    const encodedServer = encodeURIComponent(server);

    let ssUrl = `ss://${base64UserInfo}@${encodedServer}:${port}`;

    const queryString = parameters.toString();
    if (queryString) {
        ssUrl += `?${queryString}`;
    }

    if (remarks) {
        const encodedRemarks = encodeURIComponent(remarks);
        ssUrl += `#${encodedRemarks}`;
    }

    return ssUrl;
}
