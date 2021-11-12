import { apiBase } from '../staticsettings';
import type { IApiResponse, SuccessResponse } from '../types/apiresponse';
import type { Device } from '../types/localdevice';
import type { WebPushData } from '../types/webpushdata';

export const arraybuffer2base64 = (arraybuffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arraybuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function isSuccess<T>(response: IApiResponse<T, unknown>): response is SuccessResponse<T> {
    return response.successful;
}

function parseResponse<T>(response: IApiResponse<T, string>): T {
    if (isSuccess(response)) {
        return response.data;
    }
    throw new Error(response.error);
}

export async function getVapidData(): Promise<string> {
    const fetchPromise = await fetch(`${apiBase}/keys`).then(r => r.json());
    return parseResponse<string>(fetchPromise);
}

export async function createDevice(webPushData: WebPushData): Promise<Device> {
    const fetchPromise = await fetch(`${apiBase}/device`, {
        method: 'POST',
        body: JSON.stringify({
            web_push_data: webPushData
        })
    }).then(r => r.json());
    return parseResponse<Device>(fetchPromise);
}

export async function checkIfDeviceExists(deviceId: string): Promise<boolean> {
    const fetchPromise = await fetch(`${apiBase}/device/${deviceId}`).then(r => r.json());
    return parseResponse<boolean>(fetchPromise);
}
