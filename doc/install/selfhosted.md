# Deploy Notify with docker

[see this exmaple](../example/readme.md)

## Prerequisites

* docker

## Step 1. Generate your server keys and set it

go to your browser and run this [script](/helper/main.js) in your console (f12 -> console -> past the content of the script and hit enter)
it will print a random generated server key that will be used to send web notifications.
You will need to set the resulting string inside your secrets,

## Step 2. Setup your settings

These are environment variables that can be set inside your `wrangler.toml` file or create your [own env file](https://miniflare.dev/variables-secrets.html).
All of them need to be set to work.

* `SUB`: set this to the email of the person in charge for notifcations - this will be sent to the push server.
* `SERVERPWD`: the password to send notifications - this should be a secret.
* `CORS_ORIGIN`: enables cors for the supplied domain(s) - empty if none.
* `SERVE_FRONTEND`: boolean to enable the frontend - empty if it should not be served.
* `VAPID_SERVER_KEY` set the secret to the value of the server key.

for more information's on  all variables can be found [here]/app/src/globals.d.ts)
Example of a env [file](../../app/integrationstest/test.env)

## Step 3. start the container

Deploy run the container with your mapped env file (or use parameters).

> docker run -p 8787:8787 -v ${pwd}/app.env:/usr/app/app.env -v ${pwd}/persistance:/usr/app/data ghcr.io/k0in/notify:main

## Step 5. Ready to go

you can now use the webhooks to send notifications to your users.
Add a device and send this request to the worker:

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://yourendpoint/api/notify

for a in depth explanation of the webhooks, see the [api documentation](../api.md).
If you want to use notify on a other host than localhost you must serve it with https, you can put it behind a reverse proxy like nginx or traefik or have a look at the [miniflare docs](https://miniflare.dev/cli.html#script-requirement)
