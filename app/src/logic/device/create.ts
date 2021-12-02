import { compareStringSafe } from '../../crypto';
import { createDevice } from '../../databases/device';
import type { IDevice } from '../../types/database/device';
import { generateRandomId } from '../../webpush/util';
import { WebPushInfos } from '../../webpush/webpushinfos';

export async function create(webPushData: WebPushInfos, apiPassword?: string): Promise<IDevice> {        
    if (SERVERPWD) {
        if (!apiPassword) {
            throw new Error('apiPassword is required');
        }
        if (!compareStringSafe(apiPassword, SERVERPWD)) {
            throw new Error('apiPassword is invalid');
        }
    }
    const device: IDevice = {
        id: generateRandomId(),
        secret: generateRandomId(),
        pushData: { 
            auth: String(webPushData.auth), 
            endpoint: new URL(webPushData.endpoint).toString(), 
            key: String(webPushData.key) 
        }
    };
    await createDevice(device);
    return device;
}