import { createDevice } from "../../databases/device";
import type { IDevice } from "../../types/database/device";
import { generateRandomId } from "../../webpush/util";
import { WebPushInfos } from "../../webpush/webpushinfos";

export async function create(webPushData: WebPushInfos): Promise<IDevice> {
    const device: IDevice = {
        id: generateRandomId(),
        secret: generateRandomId(),
        pushData: { 
            auth: String(webPushData.auth), 
            endpoint: String(webPushData.endpoint), 
            key: String(webPushData.key) 
        }
    };
    await createDevice(device);
    return device;
}