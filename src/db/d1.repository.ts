import type { ShortUrl } from '../types';
import type { IUrlRepository } from './types';
import { generateShortCode } from './types';

export class D1UrlRepository implements IUrlRepository {
    constructor(private readonly db: D1Database) {}

    async add(long_url: string, baseUrl: string, customCode?: string): Promise<ShortUrl> {
        const code = customCode?.trim() ? customCode.trim() : generateShortCode();
        const short_url = `${baseUrl}/${code}`;
        const created_at = new Date().toISOString();

        const result = await this.db
            .prepare(
                'INSERT INTO short_url (short_code, short_url, long_url, created_at) VALUES (?, ?, ?, ?) RETURNING id'
            )
            .bind(code, short_url, long_url, created_at)
            .first<{ id: number }>();

        if (!result?.id) {
            throw new Error('Failed to create short URL');
        }

        return { id: result.id, short_code: code, short_url, long_url, created_at };
    }

    async deleteByCode(code: string): Promise<void> {
        await this.db.prepare('DELETE FROM short_url WHERE short_code = ?').bind(code).run();
    }

    async getByCode(code: string): Promise<ShortUrl | null> {
        return await this.db
            .prepare('SELECT id, short_code, short_url, long_url, created_at FROM short_url WHERE short_code = ?')
            .bind(code)
            .first<ShortUrl>();
    }

    async getList(page: number, pageSize: number): Promise<{ total: number; items: ShortUrl[] }> {
        const offset = (page - 1) * pageSize;
        const [total, items] = await Promise.all([
            this.db.prepare('SELECT COUNT(*) as count FROM short_url').first<{ count: number }>(),
            this.db
                .prepare(
                    `SELECT id, short_code, short_url, long_url, created_at
                     FROM short_url
                     ORDER BY created_at IS NULL, created_at DESC, id DESC
                     LIMIT ? OFFSET ?`
                )
                .bind(pageSize, offset)
                .all<ShortUrl>()
        ]);

        return {
            total: total?.count || 0,
            items: items?.results || []
        };
    }
}
