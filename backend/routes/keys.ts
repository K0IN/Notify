import { Router } from "oak";
import { success } from "../types/apiresponse.ts";
import { JWK } from "../webpush/jwk.ts";
import { b64ToUrlEncoded, exportPublicKeyPair } from "../webpush/util.ts";
import { toReturn } from "../util/oakreturn.ts";

export const keysRouter = new Router({ prefix: '/keys' });

keysRouter.get('/', toReturn((context) => {
    const vapid = atob(context.app.state.vapidKey);
    const vapidKeys: Readonly<JWK> = JSON.parse(vapid);
    const publicKey: string = b64ToUrlEncoded(exportPublicKeyPair(vapidKeys));
    return Promise.resolve(success(publicKey));
}));


keysRouter.get('/auth', toReturn((context) => {
    // todo check if auth is enabled
    const loginkey = context.app.state.loginkey;
    return Promise.resolve(success(Boolean(loginkey)));
}));