import { databaseGetAllDeviceIDs, databaseGetDevice } from '../../databases/device.ts';
import type { JWK } from '../../webpush/jwk.ts';
import { sendWebPushMessage } from '../../webpush/webpush.ts';
import { WebPushMessage, WebPushResult } from '../../webpush/webpushinfos.ts';
import { deleteDevice } from '../device/delete.ts';

export async function notifyAll(vapidKey: string, sub: string, data: string): Promise<Promise<unknown>> {
    const vapidKeys: Readonly<JWK> = JSON.parse(vapidKey);
    const webPushMessageInfo: WebPushMessage = {
        data: String(data),
        urgency: 'normal',
        sub: sub,
        ttl: 60 * 24 * 7
    };

    const deviceIds = await databaseGetAllDeviceIDs();
    const promises = deviceIds.map(async (deviceId): Promise<WebPushResult> => {
        const device = await databaseGetDevice(deviceId);
        const result = await sendWebPushMessage(webPushMessageInfo, device.pushData, vapidKeys);
        // todo maybe we want to keep the device but delete its subscription data
        // so it can update later again (with its secret)
        if (result === WebPushResult.NotSubscribed) {
            await deleteDevice(deviceId);
            return WebPushResult.NotSubscribed;
        }
        return result;
    });

    return Promise.allSettled(promises) as unknown as Promise<unknown>;
}