import { Router } from 'itty-router';
import { success } from '../types/apiresponse';
import type { JWK } from '../webpush/jwk';
import { b64ToUrlEncoded, exportPublicKeyPair } from '../webpush/util';

export const keysRouter = Router({ base: '/api/keys' });

keysRouter.get('/', (): Response => {
    if (!VAPID_SERVER_KEY) {
        throw new Error('VAPID_SERVER_KEY not set (please set your env)');
    }
    const vapidKeys: Readonly<JWK> = JSON.parse(VAPID_SERVER_KEY);
    const publicKey: string = b64ToUrlEncoded(exportPublicKeyPair(vapidKeys));
    return success<string>(publicKey);
});

keysRouter.get('/auth', (): Response => success<boolean>(Boolean(AUTHPWD)));