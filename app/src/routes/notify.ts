import { Request, Router } from 'itty-router';
import { notifyAll } from '../logic/project/notify';
import { authFactory } from '../middleware/auth';
import { failure, success } from '../types/apiresponse';
import { MessageValidator } from '../types/message';
export const notificationRouter = Router({ base: '/api/notify' });

export async function readBodyAs<T>(request: Request): Promise<Partial<T>> {
    const bodyPromise = request.text ? request.text() : Promise.resolve(undefined);
    return await bodyPromise.then((body: string /* | undefined*/) => JSON.parse(body)).catch(() => ({})) as Partial<T>;
}

notificationRouter.post('/', authFactory(SERVERPWD ?? AUTHPWD), // if no Server password is set, use the user password
    async (request: Required<Request>, event?: FetchEvent): Promise<Response> => {
        const rawMessage = await readBodyAs<{ title: string, message: string, icon?: string, tags?: Array<string> }>(request);

        const parsed = MessageValidator.safeParse(rawMessage);

        if (!parsed.success) {
            return failure({ type: 'invalid_data', message: 'invalid message' }, { status: 400 });
        }

        const stringData = JSON.stringify(parsed.data);

        if (stringData.length > 2048) { // 2 kb
            return failure({ type: 'invalid_data', message: 'data too long' }, { status: 400 });
        }

        return await notifyAll(stringData)
            .then((messagePromise: Promise<unknown>) => event?.waitUntil(messagePromise) ?? messagePromise)
            .then(() => success<string>('notified'))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }));
    });
