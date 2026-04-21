export function getProtocolConfig(): { label: string; value: string }[] {
    return [
        { label: 'Vless', value: 'vless' },
        { label: 'Vmess', value: 'vmess' },
        { label: 'Trojan', value: 'trojan' },
        { label: 'Shadowsocks', value: 'shadowsocks' },
        { label: 'ShadowsocksR', value: 'shadowsocksr' },
        { label: 'Hysteria', value: 'hysteria' },
        { label: 'Hysteria2', value: 'hysteria2' },
        { label: 'HY2', value: 'hy2' }
    ];
}
