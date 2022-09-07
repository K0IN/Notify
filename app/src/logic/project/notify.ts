import { databaseGetAllDeviceIDs, databaseGetDevice } from '../../databases/device';
import { validateWebPushData } from '../../util/webpush';
import type { JWK } from '../../webpush/jwk';
import { generateWebPushMessage } from '../../webpush/webpush';
import { WebPushMessage, WebPushResult } from '../../webpush/webpushinfos';
import { deleteDevice } from '../device/delete';

export async function notifyAll(data: string): Promise<Promise<unknown>> {
    if (!SUB || !VAPID_SERVER_KEY) {
        throw new Error('No Subject or vapid server key please set your secret / env var (see readme)');
    }

    const vapidKeys: Readonly<JWK> = JSON.parse(VAPID_SERVER_KEY);

    const webPushMessageInfo: WebPushMessage = {
        data: String(data),
        urgency: 'normal',
        sub: SUB,
        ttl: 60 * 24 * 7
    };

    const deviceIds = await databaseGetAllDeviceIDs();
    
    const promises = deviceIds.map(async (deviceId): Promise<WebPushResult> => {
        const device = await databaseGetDevice(deviceId);
        if (!device || !validateWebPushData(device.pushData)) {
            await deleteDevice(deviceId);
            return WebPushResult.NotSubscribed;
        }
        const result = await generateWebPushMessage(webPushMessageInfo, device.pushData, vapidKeys);
        if (result === WebPushResult.NotSubscribed) {
            await deleteDevice(deviceId);
            return WebPushResult.NotSubscribed;
        }
        return result;
    });

    return Promise.allSettled(promises) as unknown as Promise<unknown>;
}