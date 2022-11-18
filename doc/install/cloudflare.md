# Deploy Notify to your cloudflare account

## Prerequisites

* npm
* node

Clone this Repository and set your work dir to `app`

> git clone <https://github.com/K0IN/Notify.git>

> cd app

## Step 1. Generate your kv namespace

create a namespace

> npx wrangler kv:namespace create "NOTIFY_USERS"

set the result of the command inside your [wrangler file](/app/wrangler.toml) at the `kv_namespaces` section.

example:

```toml
kv_namespaces = [
    { binding = "NOTIFY_USERS", id = "5df92082b8ea35e785920487a0136ce1" }
]
```

## Step 2. Generate your server keys and set it

Go to your browser and run this [script](/helper/browser.js) in your console (f12 -> console -> past the content of the script and hit enter)
it will print a random generated server key that will be used to send web notifications.

OR

Use [deno script](/helper/deno.ts) to generate a server key.

> deno run ../helper/deno.ts

then you should get a output like this:

```json
{"kty":"EC","crv":"P-256","alg":"ES256","x":"zm5Dp4vU_VkfhRdfywhqhWGrrVD6C7tUPL67Kj3nBng","y":"CCGWT0EauI5Iejpl8KdLIP8MPmVSK3ahCXlzfCrNkB8","d":"8BaVQJrTXuwcWOkYdHtU349553XWzXWNEjJlSInfUwI","key_ops":["sign"],"ext":true}
```

You will need to set the resulting string inside your secrets,

> wrangler secret put VAPID_SERVER_KEY "&lt;VAPID_SERVER_KEY&gt;"

## Step 3. Setup your settings

These are environment variables that can be set inside your `wrangler.toml` file or in the (cloudflare) webinterface.
All of them need to be set to work.

* `SUB`: set this to the email of the person in charge for notifcations - this will be sent to the push server.
* `SERVERPWD`: the password to send notifications - this should be a secret.
* `AUTHPWD`: the password to access the webinterface - this should be a secret.
* `CORS_ORIGIN`: enables cors for the supplied domain(s) - empty if none.
* `SERVE_FRONTEND`: boolean to enable the frontend - empty if it should not be served.

for more information's on how to set env variables, see the [documentation](https://developers.cloudflare.com/workers/platform/environment-variables)
also all variables can be found [here]/app/src/globals.d.ts)

## Step 4. deploy to cloudflare

Deploy the app to cloudflare.

> cd src

> npx wrangler publish

## Step 5. Ready to go

you can now use the webhooks to send notifications to your users.
Add a device and send this request to the worker:

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://yourendpoint/api/notify

for a in depth explanation of the webhooks, see the [api documentation](../api.md).
