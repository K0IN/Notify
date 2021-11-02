# Deploy Notify to your cloudflare account

## Prerequisites

    * npm
    * node

Clone this Repository and set your work dir to `app`

> git clone https://github.com/K0IN/Notify.git

> cd app

## Step 1. Generate your kv namespace

create a namespace

> npx wrangler kv:namespace create "NOTIFY_USERS"

set the result of the command [wrangler file](/app/wrangler.toml) inside the `kv_namespaces` section.

example:

```toml
kv_namespaces = [
    { binding = "NOTIFY_USERS", id = "5df92082b8ea35e785920487a0136ce1" }
]
```

## Step 2. Generate your server keys and set it

go to your browser and run this [script](/helper/main.js) in your console (f12 -> console -> past the content of the script and hit enter)
it will print a random generated server key that will be used to send web notifications.
You will need to set the resulting string inside your secrets,

> wrangler secret put VAPID_SERVER_KEY "&lt;VAPID_SERVER_KEY&gt;"

## Step 3. Setup your settings

todo inside your wrangler setting set the setting lol

## Step 4. deploy to cloudflare

Deploy the app to cloudflare.

> cd src

> npx wrangler publish
