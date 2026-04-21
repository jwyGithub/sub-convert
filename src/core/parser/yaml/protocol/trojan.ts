/**
 * 将 Trojan 配置对象转换为 Trojan 标准协议 URL
 * @param {object} config - Trojan 配置对象
 * @returns {string} Trojan 标准协议 URL (trojan://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function trojanConvert(config: Record<string, any>): string {
    if (!config || !config.server || !config.port || !config.password) {
        throw new Error('Trojan configuration object must contain server, port, and password.');
    }

    const password = config.password;
    const server = config.server;
    const port = config.port;
    const remarks = config.name || '';

    const parameters = new URLSearchParams();

    const sni = config.sni || config.servername || config.server;
    // 只有当 SNI 和服务器地址不同时才添加，或者有些客户端总是添加如果配置了
    // 这里选择如果配置了 SNI/servername 就添加
    if (sni) {
        parameters.append('sni', sni);
    }

    // allowInsecure 参数 (对应 skip-cert-verify)
    // skip-cert-verify: true => allowInsecure=1
    // skip-cert-verify: false => 不添加参数 (默认安全)
    if (config['skip-cert-verify']) {
        parameters.append('allowInsecure', '1');
    }

    const network = config.network || 'tcp'; // 默认为 tcp
    parameters.append('type', network);

    // 处理不同的网络类型特有的参数
    switch (network) {
        case 'ws': // WebSocket
        case 'http': {
            // HTTP/2
            const opts = config['ws-opts'] || config['http-opts'] || {};
            // Host 参数：优先使用 headers 中的 Host，其次是 SNI，最后是 server 地址
            let transportHost;
            if (opts.headers && opts.headers.Host) {
                transportHost = opts.headers.Host;
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
            // 只有当 path 不是默认的 "/" 时才添加参数，以简化 URL
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
    }

    if (config.flow) {
        parameters.append('flow', config.flow);
    }

    if (config.tfo) {
        // TFO 是布尔值，参数值为 '1'
        parameters.append('tfo', '1');
    }

    if (config.udp) {
        // UDP 是布尔值，参数值为 '1'
        parameters.append('udp', '1');
    }

    if (config['client-fingerprint']) {
        parameters.append('fp', config['client-fingerprint']);
    }

    const encodedPassword = encodeURIComponent(password);
    const encodedServer = encodeURIComponent(server);

    let trojanUrl = `trojan://${encodedPassword}@${encodedServer}:${port}`;

    const queryString = parameters.toString();
    if (queryString) {
        trojanUrl += `?${queryString}`;
    }

    if (remarks) {
        const encodedRemarks = encodeURIComponent(remarks);
        trojanUrl += `#${encodedRemarks}`;
    }

    return trojanUrl;
}
