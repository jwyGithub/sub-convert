/**
 * 将 Vless 配置对象转换为 Vless 标准协议 URL
 * @param {object} config - Vless 配置对象
 * @returns {string} Vless 标准协议 URL (trojan://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function vlessConvert(config: Record<string, any>): string {
    if (config.type !== 'vless') {
        throw new Error('Configuration type must be "vless"');
    }
    if (!config.uuid || !config.server || !config.port) {
        throw new Error('Missing required fields: uuid, server, or port');
    }

    const uuid = config.uuid;
    const server = config.server;
    const port = config.port;
    const nameFragment = `#${encodeURIComponent(config.name || 'vless-node')}`;

    const params = new URLSearchParams();
    const network = config.network || 'tcp';

    let securityLayer = 'none';

    if (config.security === 'reality' || config['reality-opts']) securityLayer = 'reality';
    else if (config.security === 'tls' || config.tls === true) {
        securityLayer = 'tls';
    }

    if (network !== 'tcp' || (network === 'tcp' && config['tcp-opts']?.header?.type && config['tcp-opts'].header.type !== 'none')) {
        params.set('type', network);
    }

    if (securityLayer === 'tls') {
        params.set('security', 'tls');
        if (config.servername) {
            params.set('sni', config.servername);
        }
        if (Array.isArray(config.alpn) && config.alpn.length > 0) {
            params.set('alpn', encodeURIComponent(config.alpn.join(',')));
        }
        const fingerprint = config['client-fingerprint'] || config.fingerprint;
        if (fingerprint) {
            params.set('fp', encodeURIComponent(fingerprint));
        }
        if (config['skip-cert-verify'] === true) {
            params.set('allowInsecure', '1');
        }
        if (config.flow) {
            params.set('flow', config.flow);
        }
    } else if (securityLayer === 'reality') {
        params.set('security', 'reality');
        if (config.servername) {
            params.set('sni', config.servername);
        }

        const realityOpts = config['reality-opts'] || {};
        const publicKey = realityOpts['public-key'] || realityOpts.publicKey; // Check both key styles
        const shortId = realityOpts['short-id'] || realityOpts.shortId;

        if (publicKey) {
            params.set('pbk', encodeURIComponent(publicKey));
        }
        if (shortId) {
            params.set('sid', encodeURIComponent(shortId));
        }

        const fingerprint = config['client-fingerprint'] || config.fingerprint;
        if (fingerprint) {
            params.set('fp', encodeURIComponent(fingerprint));
        }
    }

    switch (network) {
        case 'tcp':
            if (config['tcp-opts']?.header?.type && config['tcp-opts'].header.type !== 'none') {
                params.set('headerType', config['tcp-opts'].header.type);
            }
            break;
        case 'ws':
            if (config['ws-opts']) {
                if (config['ws-opts'].headers?.Host) {
                    params.set('host', config['ws-opts'].headers.Host);
                }
                if (config['ws-opts'].path) {
                    params.set('path', encodeURIComponent(config['ws-opts'].path));
                }
            }
            break;
        case 'grpc':
            if (config['grpc-opts']) {
                // --- Corrected gRPC mode check ---
                const grpcMode = config['grpc-opts']['grpc-mode'] || config['grpc-opts'].mode; // Check both styles
                if (grpcMode === 'multi') {
                    params.set('mode', 'multi');
                }
                // gRPC service name
                const serviceName = config['grpc-opts']['grpc-service-name'];
                if (serviceName) {
                    params.set('serviceName', encodeURIComponent(serviceName));
                }
            }
            break;
        case 'quic':
            if (securityLayer !== 'tls' && securityLayer !== 'reality') {
                if (!params.has('security')) params.set('security', 'tls'); // Default guess if missing
            }
            if (config['quic-opts']) {
                if (config['quic-opts'].security && config['quic-opts'].security !== 'none') {
                    params.set('quicSecurity', encodeURIComponent(config['quic-opts'].security));
                }
                if (config['quic-opts'].key) {
                    params.set('key', encodeURIComponent(config['quic-opts'].key));
                }
                if (config['quic-opts'].header?.type && config['quic-opts'].header.type !== 'none') {
                    params.set('headerType', config['quic-opts'].header.type);
                }
            }
            break;
        case 'httpupgrade':
            if (config['httpupgrade-opts']) {
                if (config['httpupgrade-opts'].host) {
                    params.set('host', config['httpupgrade-opts'].host);
                }
                if (config['httpupgrade-opts'].path) {
                    params.set('path', encodeURIComponent(config['httpupgrade-opts'].path));
                }
            }
            break;
        case 'h2':
            if (securityLayer !== 'tls' && securityLayer !== 'reality') {
                if (!params.has('security')) params.set('security', 'tls'); // Default guess if missing
            }
            if (config['h2-opts']) {
                const h2Host = config['h2-opts'].host;
                if (Array.isArray(h2Host) && h2Host.length > 0) {
                    params.set('host', encodeURIComponent(h2Host.join(',')));
                } else if (typeof h2Host === 'string') {
                    params.set('host', encodeURIComponent(h2Host));
                }
                if (config['h2-opts'].path) {
                    params.set('path', encodeURIComponent(config['h2-opts'].path));
                }
            }
            break;
        default:
            console.warn(`Unsupported network type for URL generation: ${network}`);
    }

    if (config.tfo === true) {
        params.set('tfo', '1');
    }

    const paramsString = params.toString();
    const url = `vless://${uuid}@${server}:${port}${paramsString ? `?${paramsString}` : ''}${nameFragment}`;

    return url;
}
