import { serve } from "./mod.ts";

const values = Deno.env.toObject();
const port = values.PORT || 80;
const vapidKey = values.VAPID_KEY || 'eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoiUV92WlVXUExOUlFMRnU5QWRNaGRDQlFpY1FKamxYajVHZ2lwY19BS1E5USIsInkiOiJILXlDUF9hZ3FzRmpGMmgtZ2dNTTdVT1UxdktJN1JTcU1XSVhfZjBJekhnIiwiZCI6IjVXdzg1TnFxN09lY0pyaDN5MDl6a1JLWWR3TEhUVTVObjlNZUNqMkh6Y2MiLCJrZXlfb3BzIjpbInNpZ24iXSwiZXh0Ijp0cnVlfQ==';
const sub = values.SUB || 'mailto:example@example.com';
const cors = values.CORS || false;
const frontend = values.FRONTEND ?? 'static-site';
const sendkey = values.SENDKEY || undefined;
const loginkey = values.LOGINKEY || undefined;


await serve({
    port: Number(port),
    sub: sub,
    vapidKey: vapidKey,
    cors: cors,
    frontend: frontend,
    sendkey: sendkey,
    loginkey: loginkey,
})