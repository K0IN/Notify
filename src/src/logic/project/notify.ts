import { deleteDeviceFromDatabase, getAllDevicesIDs, getDevice } from "../../databases/device";
import type { JWK } from "../../webpush/jwk";
import { generateWebPushMessage } from "../../webpush/webpush";
import { WebPushMessage, WebPushResult } from "../../webpush/webpushinfos";

export async function notifyAll(title: string, message: string, icon: string): Promise<Promise<void>> {

    if (!SUB || !VAPID_SERVER_KEY) {
        throw new Error("No Subject or vapid server key please set your secret / env var (see readme)");
    }
    
    const devices = await getAllDevicesIDs();
    
    console.log("notify devices", devices);
    
    const vapidKeys: Readonly<JWK> = JSON.parse(VAPID_SERVER_KEY);

    const webPushMessageInfo: WebPushMessage = {
        data: JSON.stringify({ body: message, icon, title }),
        urgency: "normal",
        sub: SUB,
        ttl: 60 * 24 * 7
    };
    console.log(webPushMessageInfo);
    const promises = devices.map(async (deviceId): Promise<void> => {
        const device = await getDevice(deviceId);
        if (!device.pushData) {
            throw new Error("Device has no push data");
        }
        const result = await generateWebPushMessage(webPushMessageInfo, device.pushData, vapidKeys);
        if (result == WebPushResult.NotSubscribed) {
            await deleteDeviceFromDatabase(deviceId);
        }
    });

    return Promise.allSettled(promises) as any;
}