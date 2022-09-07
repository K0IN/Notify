import { databaseUpdateDevice } from '../../databases/device';
import type { IWebPushInfos } from '../../types/database/device';
import type { WebPushInfos } from '../../webpush/webpushinfos';

export async function updateDevice(id: string, secret: string, pushData: WebPushInfos & IWebPushInfos): Promise<void> {  
    await databaseUpdateDevice({ id, secret, pushData });
}