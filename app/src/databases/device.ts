import type { IDevice } from '../types/database/device';

export async function databaseCreateDevice(device: Readonly<IDevice>): Promise<void> {
    const deviceData = await NOTIFY_USERS.get(device.id);
    if (deviceData) {
        throw new Error('Device already exists');
    }
    await NOTIFY_USERS.put(device.id, JSON.stringify(device));
}

export async function databaseUpdateDevice(device: Readonly<IDevice>): Promise<void> {
    await NOTIFY_USERS.put(device.id, JSON.stringify(device));
}

export async function databaseDeleteDevice(deviceId: string): Promise<void> {
    await NOTIFY_USERS.delete(deviceId);
}

export async function databaseGetDevice(deviceId: string): Promise<IDevice> {
    const device = await NOTIFY_USERS.get<IDevice>(deviceId, { type: 'json' });
    if (!device) {
        throw new Error('Device not found');
    }
    return device;
}

export async function databaseGetAllDeviceIDs(): Promise<string[]> {
    const devices: string[] = [];
    let cursor: string | null = null;
    let data;
    do {
        data = await NOTIFY_USERS.list(cursor ? { cursor } : undefined);
        devices.push(...data.keys.map((entry) => entry.name));
        cursor = data.cursor as string;
    } while (!data.list_complete);
    return devices;
}