import { Router } from "oak";
import { failure, success } from "../types/apiresponse.ts";
import { WebPushInfosSchema } from "../webpush/webpushinfos.ts";
import { createDevice } from "../logic/device/create.ts";
import { checkDevice } from "../logic/device/check.ts";
import { updateDevice } from "../logic/device/update.ts";
import { deleteDevice } from "../logic/device/delete.ts";
import { toReturn } from "../util/oakreturn.ts";
import { validateDeviceSecret, validateUserLoginKey } from "../middleware/auth.ts";

export const deviceRouter = new Router({ prefix: '/device' });

deviceRouter.post('/', validateUserLoginKey, // todo
    toReturn(async (context): Promise<Response> => {
        const body = context.request.body({ type: 'json' });
        const formData = await body.value;

        const { web_push_data: SubscriptionData } = formData;

        const parsed = WebPushInfosSchema.safeParse(SubscriptionData);
        if (!parsed.success) {
            return failure({ type: 'invalid_data', message: 'invalid web_push_data' }, { status: 400 })
        }

        try {
            const device = await createDevice(parsed.data);
            return success({ id: device.id, secret: device.secret })
        } catch (error) {
            return failure({ type: 'internal_error', message: error.message })
        }
    }));


deviceRouter.get('/:device_id', validateDeviceSecret,
    toReturn(async (context): Promise<Response> => {
        const { device_id } = context.params as { device_id: string };
        if (await checkDevice(device_id)) {
            return success({ exists: true });
        }
        return failure({ type: 'not_found', message: 'device not found' }, { status: 404 });
    }));


deviceRouter.patch('/:device_id', validateDeviceSecret,
    toReturn(async (context): Promise<Response> => {
        const { device_id } = context.params as { device_id: string };
        const body = context.request.body({ type: 'json' });
        const { web_push_data: SubscriptionData } = await body.value;

        const parsed = WebPushInfosSchema.safeParse(SubscriptionData);
        if (!parsed.success) {
            return failure({ type: 'invalid_data', message: 'invalid web_push_data' }, { status: 400 });
        }

        const secret = context.request.headers.get('authorization');

        try {
            await updateDevice(device_id, String(secret), parsed.data)
            return success(true);
        } catch (error) {
            return failure({ type: 'internal_error', message: error.message })
        }
    }));


deviceRouter.delete('/:device_id', validateDeviceSecret,
    toReturn(async (context): Promise<Response> => {
        const { device_id } = context.params as { device_id: string };
        try {
            await deleteDevice(device_id);
            return success(true);
        }
        catch (error) {
            return failure({ type: 'internal_error', message: error.message })
        }
    }));
