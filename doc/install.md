# Install

## 1. Build the frontend

Go into the frontend directory and run `npm install` and `npm run build`.
Now copy the build folder to the root of the backend.

## 2. Generate your kv namespace

use wrangler to create your namespace.

> npx wrangler kv:namespace create "NOTIFY_USERS"

and set the id inside the wrangler.toml file.

## 2. Get your sever key

go to your browser and run this script in your console: [script](../helper/main.js)
it will print a random generated server key that will be used to send web notifications.
You will need to set the resulting string inside your secrets (for that see miniflare secrets or cloudflare secrets)

## 2. Deploy the application

Take a look at the wrangler.toml file and set the secrets and variables as you need them.
first you should install the dependencies:

> cd src && npm install

also install the dependencies of the frontend:

> cd src/frontend && npm install

### Deploy to: your cloudflare account

> cd src
> npx wrangler login
> npx wrangler publish

### Deploy to: locally with Miniflare

> npx miniflare src/dist/worker.js --kv-persist --wrangler-config wrangler.toml

if you use secrets make sure to pass them like so: --binding KEY1=value1
[see miniflare documentation](https://miniflare.dev/variables-secrets.html)

### Deploy to: docker (with miniflare)

> docker run -p 8787:8787 ghcr.io/k0in/notify:main
