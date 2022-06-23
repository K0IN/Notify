import { Request, Router } from 'itty-router';
import { checkDevice, createDevice, deleteDevice, updateDevice } from '../logic/device';
import { authFactory } from '../middleware/auth';
import { secretAuthFactory } from '../middleware/secret';
import { failure, success } from '../types/apiresponse';
import { WebPushInfosSchema } from '../types/database/device';
import { headers } from '../util/headers';
import type { WebPushInfos } from '../webpush/webpushinfos';

export const deviceRouter = Router({ base: '/api/device' });

deviceRouter.post('/', authFactory(SERVERPWD),
    async (request: Request): Promise<Response> => {
        const pushData = await request.json?.().catch(() => undefined) as { web_push_data: Partial<WebPushInfos> } | undefined;
        const parsed = WebPushInfosSchema.safeParse(pushData?.web_push_data);
        if (!parsed.success) {
            return failure({ type: 'invalid_data', message: 'invalid web_push_data' }, { status: 400 });
        }
        return await createDevice(parsed.data)
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
        const pushData = await request.json?.().catch(() => undefined) as { web_push_data: Partial<WebPushInfos>, secret: string } | undefined;
        const parsed = WebPushInfosSchema.safeParse(pushData?.web_push_data);
        if (!parsed.success) {
            return failure({ type: 'invalid_data', message: 'invalid web_push_data' }, { status: 400 });
        }     
        const secret = (request as unknown as { headers: headers }).headers.get('authorization');
        return await updateDevice(device_id, String(secret), parsed.data)
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