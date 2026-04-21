import type { IUrlRepository } from '../db/types';
import process from 'node:process';
import { serve } from '@hono/node-server';
import { createApp } from '../app';
import { SqliteUrlRepository } from '../db/sqlite.repository';

function parseBool(value: string | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

/**
 * Node.js / Docker 运行时入口。
 * 通过 process.env 装配与 Cloudflare bindings 同形态的 Env，再注入共享 Hono 应用。
 */
async function bootstrap(): Promise<void> {
    const driver = (process.env.DATABASE_DRIVER ?? '').toLowerCase();
    const sqlitePath = process.env.SQLITE_PATH ?? '/data/sub-convert.sqlite';

    const repo: IUrlRepository | null = driver === 'sqlite' ? new SqliteUrlRepository(sqlitePath) : null;

    const shortUrlEnabled = repo !== null;

    const bindings: Env = {
        BACKEND: process.env.BACKEND,
        DEFAULT_BACKEND: process.env.DEFAULT_BACKEND,
        CUSTOM_BACKEND: process.env.CUSTOM_BACKEND,
        LOCK_BACKEND: parseBool(process.env.LOCK_BACKEND),
        REMOTE_CONFIG: process.env.REMOTE_CONFIG,
        CHUNK_COUNT: process.env.CHUNK_COUNT,
        SHORT_URL_ENABLED: shortUrlEnabled
    };

    const app = createApp({ repo });

    const port = Number.parseInt(process.env.PORT ?? '3000', 10);
    const hostname = process.env.HOST ?? '0.0.0.0';

    serve(
        {
            fetch: (request: Request) => app.fetch(request, bindings),
            port,
            hostname
        },
        info => {
            console.log(`[sub-convert] listening on http://${info.address}:${info.port} (short_url=${shortUrlEnabled ? 'on' : 'off'})`);
        }
    );
}

bootstrap().catch(err => {
    console.error('[sub-convert] bootstrap failed', err);
    process.exit(1);
});
