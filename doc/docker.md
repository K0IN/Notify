# Deploy Notify with docker

just want to see a example see a [example](../example/readme.md)?

## Prerequisites

* docker

## Step 1. Generate your server keys and set it

There are two ways to generate your server keys.

Go to your browser and run this [script](/helper/browser.js) in your console (f12 -> console -> past the content of the script and hit enter)
it will print a random generated server key that will be used to send web notifications.

OR

Use [deno script](/helper/deno.ts) to generate a server key.

> deno run ../helper/deno.ts

then you should get a output like this:

```json
{"kty":"EC","crv":"P-256","alg":"ES256","x":"zm5Dp4vU_VkfhRdfywhqhWGrrVD6C7tUPL67Kj3nBng","y":"CCGWT0EauI5Iejpl8KdLIP8MPmVSK3ahCXlzfCrNkB8","d":"8BaVQJrTXuwcWOkYdHtU349553XWzXWNEjJlSInfUwI","key_ops":["sign"],"ext":true}
```

You will need to set the resulting string inside your secrets (see below) VAPID_SERVER_KEY.

## Step 2. Setup your settings

You can either set the environments variables directly or use a docker env_file.
Example of a docker [env_file](../../app/integrationstest/test.env).

These are environment variables that can be set inside your `wrangler.toml` file or create your [own env file](https://miniflare.dev/variables-secrets.html).
All of them need to be set to work.

* `SUB`: set this to the email of the person in charge for notifcations - this will be sent to the push server.
* `SERVERPWD`: the password to send notifications - this should be a secret.
* `AUTHPWD`: the password to access the webinterface - this should be a secret.
* `CORS_ORIGIN`: enables cors for the supplied domain(s) - empty if none.
* `SERVE_FRONTEND`: boolean to enable the frontend - empty if it should not be served.
* `VAPID_SERVER_KEY` set the secret to the value of the server key.

for more information's on  all variables can be found [here]/app/src/globals.d.ts)

## Step 3. start the container

Deploy run the container with your mapped env file (or use parameters).

> docker run -p 8787:8787 -v ${pwd}/app.env:/usr/app/app.env -v ${pwd}/persistance:/usr/app/data ghcr.io/k0in/notify:main

## Step 5. Ready to go

you can now use the webhooks to send notifications to your users.
Add a device and send this request to the worker:

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://yourendpoint/api/notify

for a in depth explanation of the webhooks, see the [api documentation](../api.md).
If you want to use notify on a other host than localhost you must serve it with https, you can put it behind a reverse proxy like nginx or traefik or have a look at the [miniflare docs](https://miniflare.dev/cli.html#script-requirement)
