import { Request, Router } from "itty-router";
import { corsHeaders } from "../cors";
import { notifyAll } from "../logic/project/notify";
import { failure, success } from "../types/apiresponse";
import { notifyDevice } from "../logic/device/notify";
import { compareStringSafe } from "../crypto";

export const notificationRouter = Router({ base: "/api/notify" });

function auth(req: Request) {
    if (SERVERPWD && SERVERPWD !== "") {        
        const header = (req as any).headers.get("authorization");
        if (!header) {
            return failure<string>("No authorization header (please provide a authorization with a bearer token)", {status: 401});
        }
        const tokenMatch = /^[B|b]earer (.*)$/.exec(header);        
        if (!tokenMatch || !tokenMatch[1] || !compareStringSafe(tokenMatch[1], SERVERPWD)) {
            return failure<string>("Invalid authorization", {status: 401});
        }
    }    
}

export async function readBodyAs<T>(request: Request): Promise<Partial<T>> {    
    const body = request.text ? await request.text() : undefined;
    try {
        return JSON.parse(body);
    } catch (e) {
        return {} as T;
    }
}

notificationRouter.post("/", auth,
    async (request: Required<Request>, event: FetchEvent): Promise<Response> => {
        const { title, message, icon } = await readBodyAs<{ title: string, message: string, icon: string }>(request);
        if (!title || !message) {
            return failure<string>("Missing title or message", {status: 400});
        }
        return await notifyAll(String(title), String(message), String(icon))
            .then(messagePromise=>event.waitUntil(messagePromise))      
            .then(() => success<string>("notified", { headers: corsHeaders }))
            .catch((error: Error) => failure<string>(error.message, { headers: corsHeaders }));
    });

notificationRouter.post('/:device_id', auth,
    async (request: Required<Request>, event: FetchEvent): Promise<Response> => {
        const { device_id } = request.params as { device_id: string };
        const { title, message, icon } = await readBodyAs<{ title: string, message: string, icon: string }>(request);
        if (!title || !message) {
            return failure<string>("Missing title or message", {status: 400});
        }
        return await notifyDevice(String(title), String(device_id), String(message), String(icon))
            .then((deletionPromise) => event.waitUntil(deletionPromise))
            .then((device) => success<string>("device deleted", { headers: corsHeaders }))
            .catch((error: Error) => failure<string>(error.message, { headers: corsHeaders }));
    });
