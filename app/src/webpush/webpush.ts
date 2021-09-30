import type { JWK } from './jwk';
import { WebPushInfos, WebPushMessage, WebPushResult } from './webpushinfos';
import { generateEncryptedMessage } from './message';
import { generateV2Headers } from './vapid';

export async function generateWebPushMessage(message: WebPushMessage, 
    deviceData: Partial<WebPushInfos>, applicationServerKeys: JWK): Promise<WebPushResult> {

    if (!deviceData.endpoint || !deviceData.key || !deviceData.auth) {
        return WebPushResult.NoDataProvided;
    }

    const headers = await generateV2Headers(deviceData.endpoint, applicationServerKeys, message.sub);
    const encryptedPayloadDetails = await generateEncryptedMessage(message.data, deviceData as Required<WebPushInfos>, applicationServerKeys);

    headers['Encryption'] = `salt=${encryptedPayloadDetails.salt}`;
    headers['Crypto-Key'] = `dh=${encryptedPayloadDetails.publicServerKey}`;
    headers['Content-Encoding'] = 'aesgcm';
    headers['Content-Type'] = 'application/octet-stream';

    // setup message headers
    headers['TTL'] = `${message.ttl}`;
    headers['Urgency'] = `${message.urgency}`;

    const res = await fetch(deviceData.endpoint, {
        method: 'POST', headers, body: encryptedPayloadDetails.cipherText
    });

    if (res.status === 410) {
        return WebPushResult.NotSubscribed;
    }

    if (res.status != 200 && res.status != 201) {
        console.error(`Web Push error: ${res.status} body: ${await res.text()}`);
        return WebPushResult.Error;
    }

    return WebPushResult.Success;
}