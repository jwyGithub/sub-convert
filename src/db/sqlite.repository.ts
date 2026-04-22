import type { ShortUrl } from '../types';
import type { IUrlRepository } from './types';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { generateShortCode } from './types';

export class SqliteUrlRepository implements IUrlRepository {
    private readonly db: DatabaseSync;

    constructor(filename: string) {
        mkdirSync(dirname(filename), { recursive: true });
        this.db = new DatabaseSync(filename);
        this.db.exec('PRAGMA journal_mode = WAL;');
        this.migrate();
    }

    private migrate(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS short_url (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                short_code TEXT UNIQUE,
                short_url TEXT,
                long_url TEXT
            );
        `);
    }

    async add(long_url: string, baseUrl: string): Promise<ShortUrl> {
        const code = generateShortCode();
        const short_url = `${baseUrl}/${code}`;

        const result = this.db
            .prepare('INSERT INTO short_url (short_code, short_url, long_url) VALUES (?, ?, ?)')
            .run(code, short_url, long_url);

        if (result.lastInsertRowid === undefined || result.lastInsertRowid === null) {
            throw new Error('Failed to create short URL');
        }

        return {
            id: Number(result.lastInsertRowid),
            short_code: code,
            short_url,
            long_url
        };
    }

    async deleteByCode(code: string): Promise<void> {
        this.db.prepare('DELETE FROM short_url WHERE short_code = ?').run(code);
    }

    async getByCode(code: string): Promise<ShortUrl | null> {
        const row = this.db.prepare('SELECT id, short_code, short_url, long_url FROM short_url WHERE short_code = ?').get(code) as
            | ShortUrl
            | undefined;
        return row ? { ...row } : null;
    }

    async getList(page: number, pageSize: number): Promise<{ total: number; items: ShortUrl[] }> {
        const offset = (page - 1) * pageSize;
        const totalRow = this.db.prepare('SELECT COUNT(*) as count FROM short_url').get() as { count: number } | undefined;
        const items = this.db
            .prepare('SELECT id, short_code, short_url, long_url FROM short_url LIMIT ? OFFSET ?')
            .all(pageSize, offset) as unknown as ShortUrl[];

        return {
            total: totalRow?.count ?? 0,
            items: items.map(item => ({ ...item }))
        };
    }
}

