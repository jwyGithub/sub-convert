import { base64Encode } from 'cloudflare-tools';

/**
 * 将 Vmess 配置对象转换为 Vmess 标准协议 URL
 * @param {object} config - Vmess 配置对象
 * @returns {string} Vmess 标准协议 URL (vmess://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function vmessConvert(config: Record<string, any>): string {
    if (!config || !config.server || !config.port || !config.uuid) {
        throw new Error('Vmess configuration object must contain server, port, and uuid.');
    }

    const uriJson: Record<string, any> = {
        v: '2', // Vmess 协议版本，通常是 2
        ps: config.name || '',
        add: config.server,
        port: config.port,
        id: config.uuid,
        aid: config.alterId || 0,
        scy: config.cipher || 'auto',
        net: config.network || 'tcp'
    };

    // 处理 TLS 相关配置
    if (config.tls) {
        uriJson.tls = 'tls';
        uriJson.sni = config.servername || config.server;
        if (config['client-fingerprint']) {
            uriJson.fp = config['client-fingerprint'];
        }
        // skip-cert-verify 通常是客户端选项，不包含在标准 URI 中
    } else {
        uriJson.tls = ''; // 关闭 TLS
    }

    // 处理不同的网络类型配置 (network)
    switch (uriJson.net) {
        case 'ws':
        case 'http': {
            const opts = config['ws-opts'] || config['http-opts'] || {};
            if (opts.headers && opts.headers.Host) {
                uriJson.host = opts.headers.Host;
            } else if (uriJson.sni) {
                uriJson.host = uriJson.sni;
            } else {
                uriJson.host = uriJson.add;
            }
            // Path 字段
            uriJson.path = opts.path || '/';
            if (uriJson.net === 'http' && !config.tls) {
                uriJson.type = 'http';
            } else if (uriJson.net === 'ws' && !config.tls) {
                uriJson.type = 'ws';
            }

            break;
        }
        case 'tcp':
            if (!config.tls) {
                uriJson.type = 'none';
            }
            break;
        case 'grpc':
            // gRPC 需要 serviceName
            if (config['grpc-opts'] && config['grpc-opts'].serviceName) {
                uriJson.serviceName = config['grpc-opts'].serviceName;
            }

            uriJson.type = 'grpc';
            break;
    }

    if (uriJson.type === 'none' || (uriJson.net === uriJson.type && !config.tls)) {
        delete uriJson.type;
    }

    uriJson.tfo = config.tfo ? '1' : '0';

    uriJson.udp = config.udp ? '1' : '0';

    const jsonString = JSON.stringify(uriJson);

    const base64String = base64Encode(jsonString);

    return `vmess://${base64String}`;
}
