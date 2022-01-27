import { deleteDeviceFromDatabase, getAllDevicesIDs, getDevice } from '../../databases/device';
import type { JWK } from '../../webpush/jwk';
import { generateWebPushMessage } from '../../webpush/webpush';
import { WebPushMessage, WebPushResult } from '../../webpush/webpushinfos';


export async function notifyAll(data: string): Promise<Promise<void>> {
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

    const deviceIds = await getAllDevicesIDs();
    const promises = deviceIds.map(async (deviceId): Promise<WebPushResult> => {
        const device = await getDevice(deviceId);
        if (!device || !device.pushData) {
            return WebPushResult.NotSubscribed;
        }
        const result = await generateWebPushMessage(webPushMessageInfo, device.pushData, vapidKeys);
        if (result === WebPushResult.NotSubscribed) {
            await deleteDeviceFromDatabase(deviceId);
        }
        return result;
    });

    return Promise.all(promises) as unknown as Promise<void>;
}