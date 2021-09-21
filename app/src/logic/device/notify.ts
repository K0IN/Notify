import { compareStringSafe } from "../../crypto";
import { deleteDeviceFromDatabase, getDevice } from "../../databases/device";
import type { JWK } from "../../webpush/jwk";
import { generateWebPushMessage } from "../../webpush/webpush";
import { WebPushMessage, WebPushResult } from "../../webpush/webpushinfos";

export async function notifyDevice(title: string, deviceId: string, message: string, icon?: string): Promise<Promise<void>> {
    const device = await getDevice(deviceId);
    if (!SUB || !VAPID_SERVER_KEY) {
        throw new Error("No Subject or vapid server key please set your secret / env var (see readme)");
    }
    const webPushMessageInfo: WebPushMessage = {
        data: JSON.stringify({ title, body: message, icon }),
        urgency: "normal",
        sub: SUB,
        ttl: 60 * 24 * 7
    };
    const vapidKeys: Readonly<JWK> = JSON.parse(VAPID_SERVER_KEY);
    return (async () => {
        const response = await generateWebPushMessage(webPushMessageInfo, device.pushData, vapidKeys);
        if ( response == WebPushResult.NotSubscribed) {
            await deleteDeviceFromDatabase(deviceId);
        }
    })();
}