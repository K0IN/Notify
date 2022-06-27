import { Router } from 'itty-router';
import { requireVapidKey } from '../middleware/vapidkey';
import { success } from '../types/apiresponse';
import type { JWK } from '../webpush/jwk';
import { b64ToUrlEncoded, exportPublicKeyPair } from '../webpush/util';

export const keysRouter = Router({ base: '/api/keys' });

keysRouter.get('/', requireVapidKey, (): Response => {    
    const vapidKeys: Readonly<JWK> = JSON.parse(VAPID_SERVER_KEY!);
    const publicKey: string = b64ToUrlEncoded(exportPublicKeyPair(vapidKeys));
    return success<string>(publicKey);
});
