import { dump } from 'js-yaml';
import { Confuse } from './core/confuse';
import { Restore } from './core/restore';
import { showPage } from './page/page';

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        try {
            const { pathname } = new URL(request.url);
            if (pathname === '/sub') {
                const confuse = new Confuse(env);
                await confuse.setSubUrls(request);
                const convertType = new URL(request.url).searchParams.get('target');

                if (!convertType) {
                    return new Response('Unsupported client type', { status: 400 });
                }

                const restore = new Restore(confuse);

                if (['clash', 'clashr'].includes(convertType)) {
                    const originConfig = await restore.getClashConfig();
                    return new Response(dump(originConfig, { indent: 2, lineWidth: 200 }), {
                        headers: new Headers({
                            'Content-Type': 'text/yaml; charset=UTF-8',
                            'Cache-Control': 'no-store'
                        })
                    });
                }

                if (convertType === 'singbox') {
                    const originConfig = await restore.getSingboxConfig();
                    return new Response(JSON.stringify(originConfig), {
                        headers: new Headers({
                            'Content-Type': 'text/plain; charset=UTF-8',
                            'Cache-Control': 'no-store'
                        })
                    });
                }

                return new Response('Unsupported client type, support list: clash, clashr', { status: 400 });
            }

            return showPage(request, env);
        } catch (error: any) {
            return new Response(error.message || error);
        }
    }
} satisfies ExportedHandler<Env>;
