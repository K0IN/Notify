import { apiBase } from '../staticsettings';
import type { IApiResponse } from '../types/apiresponse';
import type { Device } from '../types/localdevice';
import type { WebPushData } from '../types/webpushdata';

export async function getVapidData(): Promise<IApiResponse<string>> {
    return await fetch(`${apiBase}/keys`).then(r => r.json());
}

export async function createDevice(webPushData: WebPushData, registerToken?: string): Promise<IApiResponse<Device>> {
    return await fetch(`${apiBase}/device`, {
        method: 'POST',
        body: JSON.stringify({
            web_push_data: webPushData
        }),
        headers: registerToken ? {
            'Authorization': `Bearer ${registerToken}`
        } : undefined
    }).then(r => r.json());
}

export async function checkIfDeviceExists(deviceId: string): Promise<IApiResponse<boolean>> {
    return await fetch(`${apiBase}/device/${deviceId}`).then(r => r.json());
}