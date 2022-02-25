import { Request, Router } from 'itty-router';
import { notifyAll } from '../logic/project/notify';
import { authFactory } from '../middleware/auth';
import { failure, success } from '../types/apiresponse';

export const notificationRouter = Router({ base: '/api/notify' });

export async function readBodyAs<T>(request: Request): Promise<Partial<T>> {
    const bodyPromise = request.text ? request.text() : Promise.resolve(undefined);
    return await bodyPromise.then((body: string /* | undefined*/) => JSON.parse(body)).catch(() => ({})) as Partial<T>;
}

notificationRouter.post('/', authFactory(SERVERPWD),
    async (request: Required<Request>, event?: FetchEvent): Promise<Response> => {
        const { title, message, icon = '', tags = [] } = await readBodyAs<{ title: string, message: string, icon?: string, tags?: Array<string> }>(request);

        if (!title || !message) {
            return failure({ type: 'missing_data', message: 'Missing title or message' }, { status: 400 });
        }

        if (!Array.isArray(tags)) {
            return failure({ type: 'invalid_data', message: 'Tags must be an array' }, { status: 400 });
        }

        const iconUrl = String(icon);

        try {
            iconUrl && new URL(iconUrl);
        } catch (e: unknown) {
            return failure({ type: 'invalid_data', message: 'icon is not a url' }, { status: 400 });
        }

        const data = JSON.stringify({
            body: String(message),
            icon: iconUrl,
            title: String(title),
            tags: tags.map((tag) => String(tag))
        });

        if (data.length > 1024) { // 1 kb
            return failure({ type: 'invalid_data', message: 'data too long' }, { status: 400 });
        }

        return await notifyAll(data)
            .then((messagePromise: Promise<unknown>) => event?.waitUntil(messagePromise) ?? messagePromise)
            .then(() => success<string>('notified'))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }));
    });
