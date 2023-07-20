import { join } from "std/path/mod.ts";
import { Context } from "oak";

export async function serveStaticFilesMiddleware(context: Context, next: () => Promise<unknown>) {
    try {
        if (!context.state.frontend) {
            throw new Error('frontend path not set');
        }
        
        if (context.request.url.pathname.startsWith('/api/')) {
            throw new Error('api path');
        }

        await context.send({
            root: join(Deno.cwd(), context.state.frontend || ''),
            path: context.request.url.pathname === '/' || !context.request.url.pathname ?
                'index.html' :
                context.request.url.pathname,
        });
    } catch (_) {
        await next()
    }
}
