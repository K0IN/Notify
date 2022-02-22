import { WebPushInfos } from '../webpush/webpushinfos';

export function validateWebPushData(data?: Partial<WebPushInfos>): data is Required<WebPushInfos> {
    const { endpoint, key, auth } = data ?? {};

    if (!endpoint || !key || !auth) {
        return false; // missing data
    }

    if (String(endpoint).length > 1024
        || String(key).length > 256
        || String(auth).length > 64) {
        return false; // web_push_data member too long
    }

    try {
        atob(String(key));
        atob(String(auth));
        new URL(String(endpoint));
    } catch (e: unknown) {
        return false; // invalid endpoint, auth or key
    }

    return true;
}