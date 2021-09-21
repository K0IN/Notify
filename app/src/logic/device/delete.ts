import { compareStringSafe } from "../../crypto";
import { deleteDeviceFromDatabase, getDevice } from "../../databases/device";

export async function deleteDevice(deviceId: string, deviceSecret?: string): Promise<void> {
    if (!deviceSecret) {
        throw new Error("deviceSecret is required");
    }
    const device = await getDevice(deviceId);
    if (!compareStringSafe(device.secret, deviceSecret)) {
        throw new Error("Invalid secret");
    }
    await deleteDeviceFromDatabase(deviceId);
}