import { Request, Router } from 'itty-router';
import { checkDevice } from '../logic/device/check';
import { create } from '../logic/device/create';
import { deleteDevice } from '../logic/device/delete';
import { failure, success } from '../types/apiresponse';
import type { WebPushInfos } from '../webpush/webpushinfos';

export const deviceRouter = Router({ base: '/api/device' });

deviceRouter.post('/',
    async (request: Request): Promise<Response> => {
        if (!request.json) {
            return failure<string>('body not set');
        }
        const { web_push_data } = await request.json() as { secret: string, web_push_data: WebPushInfos };
        return await create({
            auth: String(web_push_data.auth),
            endpoint: String(web_push_data.endpoint),
            key: String(web_push_data.key)
        })
            .then((device) => success<{ id: string, secret: string }>({ id: device.id, secret: device.secret }))
            .catch((error: Error) => failure<string>(error.message));
    });


deviceRouter.get('/:device_id',
    async (request: Required<Request>): Promise<Response> => {
        const { device_id } = request.params as { device_id: string };
        return await checkDevice(String(device_id))
            .then((exists) => success<boolean>(exists))
            .catch((error: Error) => failure<string>(error.message));
    });

deviceRouter.delete('/:device_id',
    async (request: Required<Request>, event: FetchEvent): Promise<Response> => {
        const { device_id } = request.params as { device_id: string };
        const { secret } = await request.json() as { secret: string };
        return await deleteDevice(String(device_id), String(secret))
            .then((deletionPromise) => event.waitUntil(deletionPromise))
            .then(() => success<string>('device deleted'))
            .catch((error: Error) => failure<string>(error.message));
    });


