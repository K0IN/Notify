# Wrangler

## Secrets

### VAPID_SERVER_KEY

This key is used to sign the web push messages, so it is important to keep it secret.
Generate it with [helper/browser.js](../helper/browser.js) or [helper/deno.ts](../helper/deno.ts) file.
Also if you get stuck please refer to the [install guide](./install.md) for help.

### SERVERPWD

This is the password for the (send push) webhook endpoint you will need to set your Authentication header to `bearer <SERVERPWD>`

default: "" (empty) -> no password set

### AUTHPWD

This is the password that will be used to authenticate the user inside the web interface.

default: "" (empty) -> no password set

## Env Variables

### SUB

this will be send to the push service. The 'subscriber'is the primary contact email for this subscription.

### CORS_ORIGIN

adds a cors header to the response so you can run the frontend on a different domain

(note: the webhook endpoint has always cors origin *)

### SERVE_FRONTEND

set to true if the frontend should be served else set it to empty string to disable it
