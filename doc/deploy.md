# Deploy to Deno Deploy

## Prerequisites

* nodejs
* npm
* deno
* [deployctl](https://deno.com/deploy/docs/deployctl)
* Deno deploy KV access!

## Deploy

Hint: If you are really lazy we provide precompiled deploy packages in the branch `deno-deploy-data`

1. Build the app with and frontend, we provide a [makefile](/Makefile) for this. Just run `make deploy` and it will automatically create a deployable bundle. If you don't have make installed, you can also build the deploy package yourself [see build manual](#build-manual).
2. Create a new empty project on [deno.com/deploy](https://dash.deno.com/new) and copy the project id.
3. Get your deploy token inside the deno webui and run this command inside your deploy folder: `deployctl deploy --token <token> --project=<project name> ./deploy/deploy.ts"`

## Build manual

1. Install frontend dependencies, open app/frontend and run `npm install`
2. Build frontend, run `npm run build`
3. Create a deploy folder `mkdir deploy`
4. Copy the backend into a new folder `cp -r ./app/backend/* deploy`
5. Copy the frontend build into the backend folder `cp -r ./app/frontend/build ./deploy/static-site`

## Set the following environment variables in the webui

| Name | Description | Default |
| --- | --- | --- |
| PORT | Port to listen | 8787 |
| VAPID_KEY | Vapid key for the app, [see generate](#generate-vapid-key) | undefined |
| SUB | Admin email in format "mailto:aa@bbb.ccc" | undefined |
| CORS | Enable cors, if your frontend is served on a different domain | false |
| SENDKEY | Key to send notifications | undefined |
| LOGINKEY | Key to login to the ui | undefined |

### Generate Vapid key

```bash
deno run --allow-net --allow-read --allow-write --unstable ./deploy/main.ts generate
```

or if you do not want to checkout this repository you can use the following command:

```bash
deno run -A --unstable --import-map https://raw.githubusercontent.com/K0IN/Notify/deno-port/app/backend/deno.json https://raw.githubusercontent.com/K0IN/Notify/deno-port/app/backend/main.ts generate
```