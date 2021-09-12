# Notify

A Simple way to send push messages (via a webhook) to every device that supports web push.
Hosted inside a `cloudflare worker` or `selfhost` (using miniflare).

## Install

see [installation documentation](doc/install.md)

## How to send a notification

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://yourendpoint/api/notify

optional with a icon:

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World", "icon": "https://via.placeholder.com/150"}' https://yourendpoint/api/notify

if you have a server password defined you will also need to set the `Authorization` header: `bearer <server_password>`

for more info see [the documentation](doc/api.md)

## Todo list

  * [x] Init push the project
  * [x] Better documentation
  * [ ] Add tests
  * [ ] Write a proper README
  * [ ] Move the webpush code to a separate package
  * [ ] Beautify the frontend
  * [ ] Docker image (automated build)
  * [ ] Add a url to a notification so it can be clicked
  * [ ] Add password protection to join

## Credits

most of the webpush code is a port of [simple-push-demo](https://github.com/gauntface/simple-push-demo) by [gauntface](https://github.com/gauntface)
