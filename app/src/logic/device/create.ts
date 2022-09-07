import { databaseCreateDevice } from '../../databases/device';
import type { IDevice, IWebPushInfos } from '../../types/database/device';
import { generateRandomId } from '../../webpush/util';
import type { WebPushInfos } from '../../webpush/webpushinfos';

export async function createDevice(webPushData: WebPushInfos & IWebPushInfos): Promise<IDevice> {  
    const device: IDevice = {
        id: generateRandomId(),
        secret: generateRandomId(),
        pushData: webPushData
    };
    await databaseCreateDevice(device);
    return device;
}