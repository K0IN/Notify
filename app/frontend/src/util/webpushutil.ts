import type { ExtendedSubscription, ExtractedWebPushData, WebPushData } from "../types/webpushdata";
import { arraybuffer2base64String } from "./arraybufferutil";

export function getWebPushData(sub: ExtendedSubscription): ExtractedWebPushData {
    const { endpoint, expirationTime } = sub;
    const key = sub.getKey('p256dh');
    const auth = sub.getKey('auth');
    if (!key || !auth) {
        throw new Error('Could not get subscription data');
    }
    return { endpoint, key, auth, expirationTime };
}

export function encodeWebPushData(data: ExtractedWebPushData): WebPushData {
    return {
        endpoint: data.endpoint,
        key: arraybuffer2base64String(data.key),
        auth: arraybuffer2base64String(data.auth)
    };
}