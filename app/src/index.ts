import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler';
import { Router } from 'itty-router';
import { corsHeaders } from './cors';
import { deviceRouter } from './routes/device';
import { keysRouter } from './routes/keys';
import { notificationRouter } from './routes/notify';
import { failure } from './types/apiresponse';

const apiRouter = Router({ base: '/api' });
apiRouter.all('/keys/*', keysRouter.handle);
apiRouter.all('/device/*', deviceRouter.handle);
apiRouter.all('/notify/*', notificationRouter.handle);
apiRouter.all('*', () => failure({ type: 'not_found', message: 'method not found' }, { status: 404 }));

const errorHandler = (error: Error) => {
    console.error('global error handler catched', error);
    return failure({ type: 'internal_error', message: error.message }, { headers: CORS_ORIGIN ? corsHeaders : {} });
};

export const handleApiRequest = async (request: Request): Promise<Response | undefined> => {
    const response: Response | undefined = await apiRouter.handle(request).catch((error: Error) => errorHandler(error));
    return response ? (
        CORS_ORIGIN ?
            new Response(response.body, { headers: { ...response.headers, ...corsHeaders }, status: response.status }) :
            response
    ) : undefined;
};

const handleRequest = async (event: FetchEvent): Promise<Response> => {
    const res = await handleApiRequest(event.request);
    return res ?? ((SERVE_FRONTEND && SERVE_FRONTEND != '') ?
        await getAssetFromKV(event, { mapRequestToAsset: serveSinglePageApp }) :
        new Response('not found', { status: 404 }));
};

addEventListener('fetch', (event: FetchEvent) => event.respondWith(handleRequest(event).catch(errorHandler)));