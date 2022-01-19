import { Request, Router } from 'itty-router';
import { corsHeaders } from '../cors';
import { notifyAll } from '../logic/project/notify';
import { authFactory } from '../middleware/auth';
import { failure, success } from '../types/apiresponse';

export const notificationRouter = Router({ base: '/api/notify' });

export async function readBodyAs<T>(request: Request): Promise<Partial<T>> {
    const bodyPromise = request.text ? request.text() : Promise.resolve(undefined);
    return await bodyPromise.then((body: string /* | undefined*/) => JSON.parse(body)).catch(() => ({})) as Partial<T>;
}

notificationRouter.post('/', authFactory(SERVERPWD),
    async (request: Required<Request>, event: FetchEvent): Promise<Response> => {
        const { title, message, icon = '', tags = [] } = await readBodyAs<{ title: string, message: string, icon?: string, tags?: Array<string> }>(request);
        if (!title || !message) {
            return failure({ type: 'missing_data', message: 'Missing title or message' }, { status: 400 });
        }
        return await notifyAll(String(title), String(message), (tags).map(e => String(e)), String(icon))
            .then((messagePromise: Promise<void>) => event.waitUntil(messagePromise))
            .then(() => success<string>('notified', { headers: corsHeaders }))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }, { headers: corsHeaders }));
    });
