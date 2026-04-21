export class PsUtil {
    static #LINK_KEY = '^LINK_TO^';
    static #PREFIX_CACHE = new Map();

    /**
     * @description 获取备注
     * @param {string} name
     * @returns {[string, string]} [origin, confuse]
     */
    public static getPs(name: string): [string, string] {
        const names = name.split(PsUtil.#LINK_KEY);
        return [names[0], names[1]];
    }

    /**
     * @description 设置备注
     * @param {string} name 原始备注
     * @param {string} ps 混淆备注
     * @returns {string} origin^LINK_TO^confuse
     */
    public static setPs(name: string, ps: string): string {
        return [this.formatPs(name), ps].join(PsUtil.#LINK_KEY);
    }

    public static formatPs(ps?: string): string {
        if (!ps) return crypto.randomUUID();

        return ps.replace(/\|/g, '-');
    }

    /**
     * @description 获取前缀（带缓存）
     * @param {string} name
     * @returns {string|null} prefix
     */
    static getPrefix(name: string): string | null {
        if (!name?.includes(PsUtil.#LINK_KEY)) return null;

        if (PsUtil.#PREFIX_CACHE.has(name)) {
            return PsUtil.#PREFIX_CACHE.get(name);
        }

        const [prefix] = PsUtil.getPs(name);
        if (prefix) {
            const trimmedPrefix = prefix.trim();
            PsUtil.#PREFIX_CACHE.set(name, trimmedPrefix);
            return trimmedPrefix;
        }
        return null;
    }

    static isConfigType(name: string): boolean {
        return name.includes(this.#LINK_KEY);
    }

    // 清除缓存
    static clearCache(): void {
        this.#PREFIX_CACHE.clear();
    }
}
