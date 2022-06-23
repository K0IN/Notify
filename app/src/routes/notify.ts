import { Request, Router } from 'itty-router';
import { notifyAll } from '../logic/project/notify';
import { authFactory } from '../middleware/auth';
import { failure, success } from '../types/apiresponse';
import { IWebPush, WebPushMessageSchema } from '../types/webpush';

export const notificationRouter = Router({ base: '/api/notify' });

export async function readBodyAs<T>(request: Request): Promise<Partial<T>> {
    const bodyPromise = request.text ? request.text() : Promise.resolve(undefined);
    return await bodyPromise.then((body: string /* | undefined*/) => JSON.parse(body)).catch(() => ({})) as Partial<T>;
}

notificationRouter.post('/', authFactory(SERVERPWD),
    async (request: Required<Request>, event?: FetchEvent): Promise<Response> => {
        const pushData = await readBodyAs<IWebPush>(request);
        const parseData = WebPushMessageSchema.safeParse(pushData);

        if (!parseData.success) {
            return failure({
                type: 'invalid_data',
                message: JSON.stringify(parseData.error.flatten())
            }, { status: 400 });
        } 
        
        const { message, title, icon, tags } = parseData.data;

        // this is the frontend expected type - encoded as string
        const messageData = JSON.stringify({ body: message, icon, title, tags });

        if (messageData.length > 1024) { // 1 kb
            return failure({ type: 'invalid_data', message: 'data too long' }, { status: 400 });
        }

        return await notifyAll(messageData)
            .then((messagePromise: Promise<unknown>) => event?.waitUntil(messagePromise) ?? messagePromise)
            .then(() => success<string>('notified'))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }));
    });
