import { databaseUpdateDevice } from '../../databases/device';
import { WebPushInfos } from '../../webpush/webpushinfos';

export async function updateDevice(id: string, secret: string, pushData: WebPushInfos): Promise<void> {  
    await databaseUpdateDevice({ id, secret, pushData });
}