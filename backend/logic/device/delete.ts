import { databaseDeleteDevice } from '../../databases/device.ts';

export async function deleteDevice(deviceId: string): Promise<void> {
    await databaseDeleteDevice(deviceId);
}