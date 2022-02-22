import { Request, Router } from 'itty-router';
import { checkDevice } from '../logic/device/check';
import { createDevice } from '../logic/device/create';
import { deleteDevice } from '../logic/device/delete';
import { updateDevice } from '../logic/device/update';
import { authFactory } from '../middleware/auth';
import { secretAuthFactory } from '../middleware/secret';
import { failure, success } from '../types/apiresponse';
import { headers } from '../types/headers';
import { validateSecret } from '../util/secrets';
import { validateWebPushData } from '../util/webpush';
import type { WebPushInfos } from '../webpush/webpushinfos';

export const deviceRouter = Router({ base: '/api/device' });

deviceRouter.post('/', authFactory(SERVERPWD),
    async (request: Request): Promise<Response> => {
        const { web_push_data } = await request.json?.()
            .catch(() => ({ web_push_data: {} })) as { web_push_data: Partial<WebPushInfos> };

        if (!validateWebPushData(web_push_data)) {
            return failure({ type: 'invalid_data', message: 'invalid web_push_data' }, { status: 400 });
        }

        const { endpoint, key, auth } = web_push_data;

        return await createDevice({
            auth: String(auth),
            endpoint: String(endpoint),
            key: String(key)
        })
            .then((device) => success<{ id: string, secret: string }>({ id: device.id, secret: device.secret }))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }));
    });


deviceRouter.get('/:device_id', secretAuthFactory('device_id'),
    async (request: Required<Request>): Promise<Response> => {
        const { device_id } = request.params as { device_id: string };       
        return await checkDevice(device_id)
            .then((exists) => success<boolean>(exists))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }));
    });

deviceRouter.patch('/:device_id', secretAuthFactory('device_id'),
    async (request: Required<Request>): Promise<Response> => {
        const { device_id } = request.params as { device_id: string };

        const { web_push_data } = await request.json?.().catch(() => ({ web_push_data: {} })) as { web_push_data: Partial<WebPushInfos>, secret: string };

        if (!validateWebPushData(web_push_data)) {
            return failure({ type: 'invalid_data', message: 'invalid web_push_data' }, { status: 400 });
        }

        const secret = (request as unknown as { headers: headers }).headers.get('authorization');

        const { endpoint, key, auth } = web_push_data;

        return await updateDevice(device_id, String(secret), {
            auth: String(auth),
            endpoint: String(endpoint),
            key: String(key)
        })
            .then(() => success<boolean>(true))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }));
    });


deviceRouter.delete('/:device_id', secretAuthFactory('device_id'),
    async (request: Required<Request>): Promise<Response> => {
        const { device_id } = request.params as { device_id: string };        
        return await deleteDevice(String(device_id))
            .then(() => success<string>('deleted'))
            .catch((error: Error) => failure({ type: 'internal_error', message: error.message }));
    });