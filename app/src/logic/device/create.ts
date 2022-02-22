import { databaseCreateDevice } from '../../databases/device';
import type { IDevice } from '../../types/database/device';
import { generateRandomId } from '../../webpush/util';
import { WebPushInfos } from '../../webpush/webpushinfos';

export async function createDevice(webPushData: WebPushInfos): Promise<IDevice> {  
    const device: IDevice = {
        id: generateRandomId(),
        secret: generateRandomId(),
        pushData: webPushData
    };
    await databaseCreateDevice(device);
    return device;
}