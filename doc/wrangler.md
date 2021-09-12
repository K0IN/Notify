# Wrangler

## Secrets

### VAPID_SERVER_KEY

this is the vapid key for the server, generate it with [helper/main.js](../helper/main.js) file

### SERVERPWD

this is the password for the (send push) webhook endpoint you will need to set your Authentication header to `bearer <SERVERPWD>`

default: "" (empty) -> no password set

## Variables

### SUB

this will be send to the push service. The 'subscriber'is the primary contact email for this subscription.

### CORS_ORIGIN

adds a cors header to the response so you can run the frontend on a different domain

(note: the webhook endpoint has always cors origin *)

### SERVE_FRONTEND

set to true if the frontend should be served else set it to empty string to disable it
