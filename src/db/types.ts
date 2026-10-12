import type { ShortUrl } from '../types';

export interface IUrlRepository {
    /**
     * 新增短链；customCode 为可选的自定义短码后缀，留空则自动生成随机短码。
     */
    add: (long_url: string, baseUrl: string, customCode?: string) => Promise<ShortUrl>;
    deleteByCode: (code: string) => Promise<void>;
    getByCode: (code: string) => Promise<ShortUrl | null>;
    getList: (page: number, pageSize: number) => Promise<{ total: number; items: ShortUrl[] }>;
}

export function generateShortCode(): string {
    return crypto.randomUUID().substring(0, 8);
}
