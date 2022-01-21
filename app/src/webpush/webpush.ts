import type { JWK } from './jwk';
import { WebPushInfos, WebPushMessage, WebPushResult } from './webpushinfos';
import { generateAESGCMEncryptedMessage } from './message';
import { generateV2Headers } from './vapid';

export async function generateWebPushMessage(message: WebPushMessage,
    deviceData: WebPushInfos, applicationServerKeys: JWK): Promise<WebPushResult> {

    // those todos are about a future, with other encryption algorithms

    const [authHeaders, encryptedPayloadDetails] = await Promise.all([
        generateV2Headers(deviceData.endpoint, applicationServerKeys, message.sub),
        generateAESGCMEncryptedMessage(message.data, deviceData) // TODO: switch this according to supportedAlgorithms
    ]);
    const headers: { [headerName: string]: string } = { ...authHeaders };
    // TODO: set this accroding to the selected/supported Algorithm
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