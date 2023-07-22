import Denomander from "denomander";
import { serve } from "./mod.ts";
import { validateEmail, validatePort } from "./util/commandvalidator.ts";
import { notify } from "./client/mod.ts";

async function generateVapidKey() {
    const key = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    const serverKey = await window.crypto.subtle.exportKey("jwk", key.privateKey);
    const serverKeyString = JSON.stringify(serverKey, null, 0);
    const vapidKey = btoa(serverKeyString);
    return vapidKey;
}

export const program = new Denomander({
    app_name: "Notify",
    app_description: ``,
    app_version: "1.0.0"
});


program
    .command('run', 'Run the server')
    .requiredOption("--vapidkey", `vapid key, you can use notify generate to generate a new one - warning a new key means that clients need to subscribe to it again!`)
    .requiredOption("--sub", `Set the vapid subscription information (email of the owner of the site)`, validateEmail)
    // .option("-s --store", `Store messages, so clients can request past messages that might be lost when device is not online for a long time.`, Boolean)
    .option("-c --cors", `Enable CORS`, Boolean)
    .option("-f --frontend", `if set the frontend will be served (this needs to point to the build directory of the frontend)`, undefined, './frontend/build')
    .option("--sendkey", `Set the api key (for sending a new request)`, String)
    .option("--loginkey", `Set the api key (for login into the ui)`, String)
    .option("-p --port", `Set the api url (for this request)`, validatePort, 8787)
    .action(async (ctx: Denomander) =>
        await serve({
            port: ctx.port,
            sub: ctx.sub,
            vapidKey: ctx.vapidkey,
            cors: ctx.cors,
            frontend: ctx.frontend,
            sendkey: ctx.sendkey,
            loginkey: ctx.loginkey,
        }));


program.
    command('generate', 'Generate a new vapid key')
    .action(async () => {
        const vapidKey = await generateVapidKey();
        console.log(vapidKey);
    });

program.
    command('notify', 'Send a test notification to all clients')
    .requiredOption("-t --title", `Set the title of the notification`, String)
    .requiredOption("-m --message", `Set the body of the notification`, String)
    .option("-i --icon", `Set the icon of the notification`, String)
    .option("-t --tags", `Comma separated list of all tags`, String)
    .option("-r --remote", `Set the remote url of the notification`, String, 'http://localhost:8787')
    .option("-k --key", `Set the api key (for this request)`, String)
    .action(async (ctx: Denomander) => {
        await notify(ctx.remote, {
            title: ctx.title,
            message: ctx.message,
            iconUrl: ctx.icon,
            tags: ctx.tags ? ctx.tags.split(',') : [],
        }, ctx.key);
        console.log('Notification sent');
    });


program.
    command('demo', 'Run demo instance, also useful for testing')
    .action(async () => {
        const vapidKey = 'eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoiUV92WlVXUExOUlFMRnU5QWRNaGRDQlFpY1FKamxYajVHZ2lwY19BS1E5USIsInkiOiJILXlDUF9hZ3FzRmpGMmgtZ2dNTTdVT1UxdktJN1JTcU1XSVhfZjBJekhnIiwiZCI6IjVXdzg1TnFxN09lY0pyaDN5MDl6a1JLWWR3TEhUVTVObjlNZUNqMkh6Y2MiLCJrZXlfb3BzIjpbInNpZ24iXSwiZXh0Ijp0cnVlfQ==';
        const sub = 'example@example.com';
        const port = 8787;
        await serve({
            port,
            sub,
            vapidKey,
            cors: false,
            frontend: 'static-site',
        });
    });

await program.parse(Deno.args);
