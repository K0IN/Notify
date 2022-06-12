import type { JWK } from './jwk';
import { WebPushInfos, WebPushMessage, WebPushResult } from './webpushinfos';
import { generateAESGCMEncryptedMessage } from './message';
import { generateV2Headers } from './vapid';
import { toBinary } from './util';

export async function generateWebPushMessage(message: WebPushMessage,
    deviceData: WebPushInfos, applicationServerKeys: JWK): Promise<WebPushResult> {
    
    const binString = toBinary(message.data);
    const dataB64 = btoa(binString);

    const [authHeaders, encryptedPayloadDetails] = await Promise.all([
        generateV2Headers(deviceData.endpoint, applicationServerKeys, message.sub),
        generateAESGCMEncryptedMessage(dataB64, deviceData) // TODO: switch this according to supportedAlgorithms
    ]);

    const headers: { [headerName: string]: string } = { ...authHeaders };
    // TODO: set this according to the selected/supported Algorithm
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

    switch (res.status) {
        case 200: // http ok
        case 201: // http created 
        case 204: // http no content
            return WebPushResult.Success;

        case 400: // http bad request
        case 401: // http unauthorized
        case 404: // http not found
        case 410: // http gone
            return WebPushResult.NotSubscribed;
    }

    console.error(`Web Push error: ${res.status} body: ${await res.text()}`);
    return WebPushResult.Error;
}