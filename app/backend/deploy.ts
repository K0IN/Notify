import { serve } from "./server.ts";

// todo read this from env!

const port = 80;
const vapidKey = 'eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoiUV92WlVXUExOUlFMRnU5QWRNaGRDQlFpY1FKamxYajVHZ2lwY19BS1E5USIsInkiOiJILXlDUF9hZ3FzRmpGMmgtZ2dNTTdVT1UxdktJN1JTcU1XSVhfZjBJekhnIiwiZCI6IjVXdzg1TnFxN09lY0pyaDN5MDl6a1JLWWR3TEhUVTVObjlNZUNqMkh6Y2MiLCJrZXlfb3BzIjpbInNpZ24iXSwiZXh0Ijp0cnVlfQ==';
const sub = 'mailto:example@example.com';
const cors = false;
const frontend = 'build';
const sendkey = undefined;
const loginkey = undefined;


await serve({
    port: port,
    sub: sub,
    vapidKey: vapidKey,
    cors: cors,
    frontend: frontend,
    sendkey: sendkey,
    loginkey: loginkey,
})