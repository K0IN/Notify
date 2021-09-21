import { getAssetFromKV, serveSinglePageApp } from "@cloudflare/kv-asset-handler";
import { Router, Request } from 'itty-router';
import { corsHeaders } from "./cors";
import { deviceRouter } from "./routes/device";
import { keysRouter } from "./routes/keys";
import { notificationRouter } from "./routes/notify";
import { failure } from "./types/apiresponse";

const apiRouter = Router({ base: "/api" });
apiRouter.all("/keys/*", keysRouter.handle);
apiRouter.all("/device/*", deviceRouter.handle);
apiRouter.all("/notify/*", notificationRouter.handle);

apiRouter.all('*', (request: Request) => failure<string>("method not found", { status: 404 }));

const errorHandler = (error: Error) => {
    console.error("global error handler catched", error);
    return failure<string>(error.message, { headers: CORS_ORIGIN ? corsHeaders : {} });
}

const handleRequest = async (event: FetchEvent): Promise<Response> => {
    const response: Response = await apiRouter.handle(event.request, event).catch(console.error);
    if (response) {
        if (CORS_ORIGIN) {
            return new Response(response.body, { headers: { ...response.headers, ...corsHeaders }, status: response.status });
        } else {
            return response;
        }
    }
    return (SERVE_FRONTEND && SERVE_FRONTEND != '') ? await getAssetFromKV(event, { mapRequestToAsset: serveSinglePageApp }) : new Response("not found", { status: 404 });
}

addEventListener('fetch', (event: FetchEvent) => event.respondWith(handleRequest(event).catch(errorHandler)));