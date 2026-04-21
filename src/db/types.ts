import type { ShortUrl } from '../types';

export interface IUrlRepository {
    add: (long_url: string, baseUrl: string) => Promise<ShortUrl>;
    deleteByCode: (code: string) => Promise<void>;
    getByCode: (code: string) => Promise<ShortUrl | null>;
    getList: (page: number, pageSize: number) => Promise<{ total: number; items: ShortUrl[] }>;
}

export function generateShortCode(): string {
    return crypto.randomUUID().substring(0, 8);
}
