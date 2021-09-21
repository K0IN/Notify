# Install

## Run in Cloudflare

### 1. Generate your kv namespace

use wrangler to create your namespace.

> npx wrangler kv:namespace create "NOTIFY_USERS"

and set the id inside the wrangler.toml file.

### 2. Set your env variables and secrets in wrangler.toml

[how to create the server key](#server-key)
also see [wrangler file at vars](/src/wrangler.toml) for more details.

### 3. Publish the worker using wrangler

> cd src
> npx wrangler publish

## Run in miniflare

### 1. Set your env variables and secrets in wrangler.toml

[how to create the server key](#server-key)

if you use secrets make sure to pass them like so: --binding KEY1=value1

[see miniflare documentation](https://miniflare.dev/variables-secrets.html)

### 2. Run miniflare

> npx miniflare src/dist/worker.js --kv-persist --wrangler-config wrangler.toml

## Run in miniflare with docker (beta better documentation coming soon)

see above steps on [run in miniflare](#run-in-miniflare)

### Deploy to: docker (with miniflare)

(with env file in current dir / or use --binding KEY1=value1 see [miniflare](#Run in miniflare))

example of disable frontend using parameters

> docker run -p 8787:8787 test --binding SERVE_FRONTEND=

or use env file ([see miniflare documentation](https://miniflare.dev/variables-secrets.html))

> docker run -p 8787:8787 -v ${pwd}/env:/usr/app/.env -v ${pwd}/persistance:/usr/app/data ghcr.io/k0in/notify:main

you can also save your persistent data in a volume

> /usr/app/data

## server-key

go to your browser and run this script in your console: [script](../helper/main.js)
it will print a random generated server key that will be used to send web notifications.
You will need to set the resulting string inside your secrets (for that see miniflare secrets or cloudflare secrets)
