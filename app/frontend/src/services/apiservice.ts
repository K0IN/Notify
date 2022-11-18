import { APIBASE } from '../staticsettings';
import type { IApiResponse } from '../types/apiresponse';
import type { Device } from '../types/localdevice';
import type { WebPushData } from '../types/webpushdata';

export async function isPasswordProtected(): Promise<IApiResponse<boolean>> {
    return await fetch(`${APIBASE}/keys/auth`).then(r => r.json());
}

export async function getVapidData(): Promise<IApiResponse<string>> {
    return await fetch(`${APIBASE}/keys`).then(r => r.json());
}

export async function createDevice(webPushData: WebPushData, registerToken?: string): Promise<[number, IApiResponse<Device>]> {
    const res = await fetch(`${APIBASE}/device`, {
        method: 'POST',
        body: JSON.stringify({
            web_push_data: webPushData
        }),
        headers: registerToken ? {
            'Authorization': `Bearer ${registerToken}`
        } : undefined
    });
    return [res.status, await res.json()];
}

export async function checkIfDeviceExists(deviceId: string, secret: string): Promise<IApiResponse<boolean>> {
    return await fetch(`${APIBASE}/device/${deviceId}`, {
        headers: {
            'Authorization': `Bearer ${secret}`
        }
    }).then(r => r.json());
}

export async function deleteDevice(deviceId: string, secret: string): Promise<IApiResponse<string>> {
    return await fetch(`${APIBASE}/device/${deviceId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${secret}`
        }
    }).then(r => r.json());
}

export async function updateDevice(deviceId: string, secret: string, webPushData: WebPushData): Promise<IApiResponse> {
    const res = await fetch(`${APIBASE}/device/${deviceId}`, {
        method: 'PATCH',
        body: JSON.stringify({ web_push_data: webPushData }),
        headers: {
            'Authorization': `Bearer ${secret}`
        }
    });
    return await res.json();
}