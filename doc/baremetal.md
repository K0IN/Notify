# Run Notify baremetal

## Prerequisites

* nodejs
* npm
* deno

## Build

1. Install frontend dependencies, open app/frontend and run `npm install`
2. Build frontend, run `npm run build`
3. Create a deploy folder `mkdir deploy`
4. Copy the backend into a new folder `cp -r ./app/backend/* deploy`
5. Copy the frontend build into the backend folder `cp -r ./app/frontend/build ./deploy/static-site`
6. Go into the deploy folder `cd deploy` and start the app see [run](#run)

### Run

* `--port` Port to listen on, default: 8080
* `--vapidkey` Vapid key for your app (can be generated with `main.ts generate`)
* `--sub` Email of the admin user must start with `mailto:`
* `--cors` Enable CORS - if you use the frontend on a different domain
* `--frontend` Path to the frontend build directory
* `--sendkey` Set the api key (for sending a new request)
* `--loginkey` Set the api key (for login into the ui)

Example run:

```bash
deno run --allow-net --allow-read --allow-write --unstable ./deploy/main.ts run --port 8080 --vapidkey <vapidkey> --sub mailto:admin@admin.com --frontend ./static-site --sendkey <sendkey>
```

### Generate Vapid key

```bash
deno run --allow-net --allow-read --allow-write --unstable ./deploy/main.ts generate
```

### Send a notification (using the cli)

* `--remote` Set the remote url of the notification
* `--key` Set the api key (for this request)
* `--title` Set the title of the notification
* `--message` Set the body of the notification
* `--icon` Set the icon of the notification (optional)
* `--tags` Comma separated list of all tags (optional)

```bash
deno run --allow-net --allow-read --allow-write --unstable ./deploy/main.ts notify --remote http://localhost:8080/api/notify --key <sendkey> --title "Hello World" --message "This is a test notification" --icon "https://picsum.photos/200/300" --tags "test,notification"
```

Example: `deno run -A --unstable .\main.ts notify -r  https://notify-demo.deno.dev/api/notify -t test -m world`

## Compile to binary

You can compile the app to a single binary using deno compile

```bash
deno compile --allow-net --allow-read --allow-write --allow-env --unstable --output ./deploy/notify ./deploy/main.ts
```

then you can youse the executable as follows:

```bash
./deploy/notify run --port 8080 --vapidkey <vapidkey> --sub mailto:admin@admin.com
```
