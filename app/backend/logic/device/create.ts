import { databaseCreateDevice } from "../../databases/device.ts";
import { IDevice } from "../../types/database/device.ts";
import { generateRandomId } from "../../webpush/util.ts";
import { WebPushInfos } from "../../webpush/webpushinfos.ts";

export async function createDevice(webPushData: WebPushInfos): Promise<IDevice> {  
    const device: IDevice = {
        id: generateRandomId(),
        secret: generateRandomId(),
        pushData: webPushData
    };
    await databaseCreateDevice(device);
    return device;
}