# Deploy Notify with docker

> docker run -p 8787:8787 -e VAPID_KEY=<vapidkey> -e SUB=mailto:admin@admin.com -e SENDKEY=mypassword k0in/notify

## Environment variables

| Name | Description | Default |
| --- | --- | --- |
| PORT | Port to listen | 8787 |
| VAPID_KEY | Vapid key for the app, [see generate](#generate-vapid-key) | undefined |
| SUB | Admin email in format "mailto:aa@bbb.ccc" | undefined |
| CORS | Enable cors, if your frontend is served on a different domain | false |
| FRONTEND | Path of the frontend files | static-site |
| SENDKEY | Key to send notifications | undefined |
| LOGINKEY | Key to login to the ui | undefined |

## Generate vapid key

> deno run -A --unstable --import-map https://raw.githubusercontent.com/K0IN/Notify/deno-port/app/backend/deno.json https://raw.githubusercontent.com/K0IN/Notify/deno-port/app/backend/main.ts generate
