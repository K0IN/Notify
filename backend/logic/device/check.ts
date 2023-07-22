import { databaseGetDevice } from '../../databases/device.ts';

export async function checkDevice(deviceId: string): Promise<boolean> {    
    return await databaseGetDevice(deviceId).then(() => true).catch(() => false);
}