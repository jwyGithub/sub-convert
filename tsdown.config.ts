import { defineConfig } from 'tsdown';

/**
 * 合并后的打包入口，统一由 tsdown（rolldown）产出两套构建：
 *
 * 1) Cloudflare Worker / Pages: dist/worker/_worker.js
 *    - 面向 Worker 运行时，platform=neutral，全依赖 bundle、产物自包含
 *    - 可直接 `wrangler pages deploy ./dist/worker` 或 CF Pages 直接上传
 * 2) Node.js / Docker: dist/node/server.mjs
 *    - 面向 Node 24 runtime，node_modules 保持 external（node:sqlite 由运行时提供）
 *
 * 运行方式：
 *   pnpm build         → 同时产出两套
 *   pnpm build:worker  → 仅打 CF 产物
 *   pnpm build:node    → 仅打 Node 产物
 */
export default defineConfig([
    {
        name: 'worker',
        entry: { _worker: 'src/adapters/cloudflare.ts' },
        format: ['esm'],
        platform: 'neutral',
        target: 'es2022',
        outDir: 'dist/worker',
        clean: true,
        dts: false,
        sourcemap: false,
        minify: true,
        // Worker 产物必须自包含：把 dependencies 里的包一并 bundle 进去
        deps: {
            alwaysBundle: [/.*/],
            onlyBundle: false
        }
    },
    {
        name: 'node',
        entry: { server: 'src/adapters/node.ts' },
        format: ['esm'],
        platform: 'node',
        target: 'node24',
        outDir: 'dist/node',
        clean: true,
        dts: false,
        sourcemap: false,
        minify: false,
        deps: {
            skipNodeModulesBundle: true
        }
    }
]);
