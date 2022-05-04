# Notify

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/K0IN/Notify.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/K0IN/Notify/context:javascript)

A Simple way to send (offline) push messages (via a webhook) to every [device that supports web push](https://caniuse.com/push-api).
Hosted inside a `cloudflare worker` or `selfhost` (using miniflare).
You can even receive notifications if the app is closed or your offline(and back online again).
It comes with a offline installable pwa for all time access to your latest notifications.

## DEMO

There is a [demo instance](https://notify_app-demo.thisk0in.workers.dev/) hosted on cloudflare workers.
You can send a notification to all your devices using this command (note you should unsubscribe from the demo instance to avoid spamming):

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://notify_app-demo.thisk0in.workers.dev/api/notify

![example of the app](https://i.imgur.com/y32ro73.png)
![using on android](https://i.imgur.com/ArAAAO7.png)
![using on windows](https://i.imgur.com/U5v3GZl.png)

## Install

See [installation documentation](doc/install.md)

## How to send a notification

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://yourendpoint/api/notify

optional with a icon:

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World", "icon": "https://via.placeholder.com/150"}' https://yourendpoint/api/notify

optional with some tags:

> curl -X POST -H "Content-Type: application/json" -d '{"message": "test", "title": "1231234", "tags": ["test", "server"]}' https://yourendpoint/api/notify

if you have a server password defined you will also need to set the `Authorization` header to: `bearer <server_password>`

for more info see [the documentation](doc/api.md)

## Credits

most of the webpush code is a port of [simple-push-demo](https://github.com/gauntface/simple-push-demo) by [gauntface](https://github.com/gauntface) and icons from [google icon](https://fonts.google.com/icons) font.
