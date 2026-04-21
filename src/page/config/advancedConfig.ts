export function getAdvancedConfig(): { label: string; value: string }[] {
    return [
        { label: 'Emoji', value: 'emoji' },
        { label: 'Clash新字段', value: 'new_name' },
        { label: 'UDP', value: 'udp' },
        { label: '排序节点', value: 'sort' },
        { label: 'TFO', value: 'tfo' },
        { label: '关闭证书检查', value: 'scv' },
        { label: '节点类型', value: 'append_type' },
        { label: '仅输出节点信息', value: 'list' }
    ];
}
