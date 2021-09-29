import { apiBase } from '../staticsettings';
import type { IApiResponse } from '../types/apiresponse';
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

function parseResponse<T>(promise: Promise<IApiResponse<T>>): Promise<T> {
    return promise.then((response: IApiResponse<T>) => {
        if (!response.successful) {
            throw new Error(response.error);
        }
        return response.data as T;
    });
}

export function getVapidData(): Promise<string> {
    const fetchPromise = fetch(`${apiBase}/keys`).then(r => r.json());
    return parseResponse<string>(fetchPromise);
}

export function createDevice(webPushData: WebPushData): Promise<Device> {
    const fetchPromise = fetch(`${apiBase}/device`, {
        method: 'POST',
        body: JSON.stringify({
            web_push_data: webPushData
        })
    }).then(r => r.json());
    return parseResponse<Device>(fetchPromise);
}

export function checkIfDeviceExists(deviceId: string): Promise<boolean> {
    const fetchPromise = fetch(`${apiBase}/device/${deviceId}`).then(r => r.json());
    return parseResponse<boolean>(fetchPromise);
}
