import { apiBase } from '../staticsettings';
import { parseResponse } from '../types/apiresponse';
import type { Device } from '../types/localdevice';
import type { WebPushData } from '../types/webpushdata';

export async function getVapidData(): Promise<string> {
    const fetchPromise = await fetch(`${apiBase}/keys`).then(r => r.json());
    return parseResponse<string>(fetchPromise);
}

export async function createDevice(webPushData: WebPushData, registerToken?: string): Promise<Device> {
    const fetchPromise = await fetch(`${apiBase}/device`, {
        method: 'POST',
        body: JSON.stringify({
            web_push_data: webPushData
        }),
        headers: registerToken ? {
            'Authorization': `Bearer ${registerToken}`
        } : undefined
    }).then(r => r.json());
    return parseResponse<Device>(fetchPromise);
}

export async function checkIfDeviceExists(deviceId: string): Promise<boolean> {
    const fetchPromise = await fetch(`${apiBase}/device/${deviceId}`).then(r => r.json());
    return parseResponse<boolean>(fetchPromise);
}