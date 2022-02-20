import { compareStringSafe } from '../../crypto';
import { createDevice, deleteDeviceFromDatabase, getDevice } from '../../databases/device';
import type { IDevice } from '../../types/database/device';
import { WebPushInfos } from '../../webpush/webpushinfos';

export async function update(id: string, secret: string, pushData: WebPushInfos): Promise<IDevice> {  
    const device = await getDevice(id);    
    if (!compareStringSafe(device.secret, secret)) {
        throw new Error('Invalid secret');
    }
    await deleteDeviceFromDatabase(id);
    await createDevice({ id, secret, pushData });
    return device;
}