import { databaseUpdateDevice } from '../../databases/device.ts';
import type { WebPushInfos } from '../../webpush/webpushinfos.ts';

export async function updateDevice(id: string, secret: string, pushData: WebPushInfos): Promise<void> {  
    await databaseUpdateDevice({ id, secret, pushData });
}