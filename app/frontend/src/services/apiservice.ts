import { apiBase } from "../staticsettings";
import type { IApiResponse } from "../types/apiresponse";
import type { WebPushData } from "../types/webpushdata";

export const arraybuffer2base64 = (arraybuffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arraybuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export const getVapidData = async (): Promise<IApiResponse<string>> => {
    return await fetch(apiBase + "/keys").then(response => response.json());
}

export const createDevice = async (webPushData: WebPushData): Promise<IApiResponse<{ id: string, secret: string }>> => {
    return await fetch(apiBase + "/device", { method: "POST", body: JSON.stringify({ web_push_data: webPushData }) }).then(response => response.json());
}

export const deleteDevice = async (deviceId: string, secret: string): Promise<IApiResponse<string>> => {
    return await fetch(apiBase + "/device/" + deviceId, {
        method: "DELETE", body: JSON.stringify({
            secret
        })
    }).then(response => response.json());
}

export const checkIfDeviceExists = async (deviceId: string): Promise<IApiResponse<boolean>> => {
    return await fetch(apiBase + "/device/" + deviceId).then(response => response.json());
}