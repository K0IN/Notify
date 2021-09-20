# Notify

A Simple way to send (offline) push messages (via a webhook) to every [device that supports web push](https://caniuse.com/push-api).
Hosted inside a `cloudflare worker` or `selfhost` (using miniflare).
You can even receive notifications if the app is closed or your offline(and back online again).
It comes with a offline installable pwa for all time access to your latest notifications.

![example of the app](https://i.imgur.com/h68KYqi.png)
![using on android](https://i.imgur.com/ArAAAO7.png)
![using on windows](https://i.imgur.com/U5v3GZl.png)

## Install

see [installation documentation](doc/install.md)

## How to send a notification

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://yourendpoint/api/notify

optional with a icon:

> curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World", "icon": "https://via.placeholder.com/150"}' https://yourendpoint/api/notify

optional with some tags:

> curl -X POST -H "Content-Type: application/json" -d '{"message": "test", "title": "1231234", "tag": ["test", "server"]}' https://yourendpoint/api/notify

if you have a server password defined you will also need to set the `Authorization` header: `bearer <server_password>`

for more info see [the documentation](doc/api.md)

## Todo list

  * [x] Init push the project
  * [x] Better documentation
  * [ ] Add tests
  * [ ] Write a proper README
  * [ ] Move the webpush code to a separate package
  * [ ] Beautify the frontend
  * [x] Docker image (automated build)
  * [ ] Add a url to a notification so it can be clicked
  * [ ] Add password protection to join
  * [ ] Filter notifications
  * [ ] Split frontend and backend into two
  * [x] create a slim docker image with just the compiled files
  
## 

## Credits

most of the webpush code is a port of [simple-push-demo](https://github.com/gauntface/simple-push-demo) by [gauntface](https://github.com/gauntface)
