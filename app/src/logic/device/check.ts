import { getDevice } from '../../databases/device';

export async function checkDevice(deviceId: string): Promise<boolean> {    
    return await getDevice(deviceId).then(() => true).catch(() => false);
}