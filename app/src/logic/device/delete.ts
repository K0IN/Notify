import { databaseDeleteDevice } from '../../databases/device';

export async function deleteDevice(deviceId: string): Promise<void> {
    await databaseDeleteDevice(deviceId);
}