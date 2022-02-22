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
        new URL(String(endpoint));
    } catch (e: unknown) {
        return false; // invalid endpoint, auth or key
    }

    const base64Regex = /^(?:[a-zA-Z0-9+/]{4})*(?:|(?:[a-zA-Z0-9+/]{3}=)|(?:[a-zA-Z0-9+/]{2}==)|(?:[a-zA-Z0-9+/]{1}===))$/;
    return Boolean(key.match(base64Regex) && auth.match(base64Regex));
}