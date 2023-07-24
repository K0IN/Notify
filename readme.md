# Introducing Notify: Your Awesome Offline Push Message Sender! 📲

Looking for a super-easy way to send push messages to your devices, even when you're offline?
Meet Notify - the open-source project that's got your back!
With Notify, you can send push messages via a webhook to any device that supports web push.
Whether you're using Docker, bare metal, or Deno Deploy, Notify's got you covered!

**Get Notified Anywhere, Anytime! 📲**

And that's not all! Notify comes with a cool offline installable PWA, ensuring you never miss any important notifications - even when you're on the go!

## Check Out the DEMO 🚀

Want to see Notify in action? No problem! We've set up a live demo instance on deno deploy. Try it out now! Just use this command to send a notification to all your devices:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World"}' https://notify-demo.deno.dev/api/notify
```

**Customize Your Notifications! ✨**

You're in control! Personalize your notifications with optional features like adding an icon:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Hello", "message":"World", "icon": "https://via.placeholder.com/150", "tags": ["test", "server"] }' https://notify-demo.deno.dev/api/notify
```

**Easy Installation - No Fuss! 🛠️**

Don't worry about complicated setups. The installation documentation is right here to help you get started with Notify in no time! 📚

👉 [Installation Documentation](doc/install.md)

## Ready to Get Notified? 🚀

Join our open-source community and take advantage of Notify's incredible features in your projects! It's time to level up your notification game!

## Credits to the Amazing Developers! 🙏

Huge shout-out to the talented folks who made this possible! We've built on the fantastic web push code from [gauntface](https://github.com/gauntface) and, not to forget, we use the [Google Icon Font](https://fonts.google.com/icons).
