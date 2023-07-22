import type { IDevice } from '../types/database/device.ts';

export async function databaseCreateDevice(device: Readonly<IDevice>): Promise<void> {
    const kv = await Deno.openKv();
    await kv.set(["device", device.id], JSON.stringify(device));
}

export async function databaseUpdateDevice(device: Readonly<IDevice>): Promise<void> {
    await databaseCreateDevice(device);
}

export async function databaseDeleteDevice(deviceId: string): Promise<void> {
    const kv = await Deno.openKv();
    await kv.delete(["device", deviceId]);
}

export async function databaseGetDevice(deviceId: string): Promise<IDevice> {
    const kv = await Deno.openKv();
    const device = await kv.get(["device", deviceId]);
    if (!device || !device.value) {
        throw new Error(`Device with id ${deviceId} not found`);
    }
    return JSON.parse(device.value as string) as IDevice;
}

export async function databaseGetAllDeviceIDs(): Promise<string[]> {
    const kv = await Deno.openKv();
    const allDevices = [];
    const entries = kv.list({ prefix: ["device"] });
    for await (const entry of entries) {
        allDevices.push(String(entry.key[1]));
    }
    return allDevices;
}