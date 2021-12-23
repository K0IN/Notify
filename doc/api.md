# API DOC

## Routes

All routes are prefixed with `/api`

## keys endpoint

### get vapid keys

**URL** : `/api/keys`

**Method** : `GET`

**Auth required** : No

**Description** : get the server vapid key to create a client subscription

#### Success Responses

**Code** : `200 OK`

**Content** :

```json
{"successful":true,"data":"BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ"}
```

## device endpoint

### create a new device

**URL** : `/api/device`

**Method** : `POST`

**Auth required** : no (only if the serverpassword is set) Authentication header must be `Bearer <serverpassword>`

**Description** : create a new device and return the device id with a secret that can be used to delete it later

**Body** :

```json
{
    "web_push_data":{
        "endpoint":"<endpoint url>",
        "key":"<base64 encoded subscription p256 key>",
        "auth":"<base64 encoded subscription auth>"
    }
}
```

#### Success Responses

**Code** : `200 OK`

**Content** :

```json
{"successful":true,"data":{"id":"c968712190ec72e785160fe2a45b45a4","secret":"bd907b2a5f9e571949aa92561fcb5694"}}
```

### Check if a device exists

**URL** : `/api/device/<device_id>`

**Method** : `GET`

**Auth required** : No

**Description** : check if a device exists

#### Success Responses

**Code** : `200 OK`

**Content** :

```json
{"successful":true,"data":true} 
```

### Delete a device

**URL** : `/api/device/<device_id>`

**Method** : `DELETE`

**Auth required** : No

**Description** : delete a device

**Body** :

```json
{
    "secret":"<device secret>"
}
```

#### Success Responses

**Code** : `200 OK`

**Content** :

```json
{"successful":true,"data":"device deleted"} 
```

## Notifications endpoint

### Send a notification to all devices

**URL** : `/api/notify`

**Method** : `POST`

**Auth required** : yes (only if the serverpassword is set) Authentication header must be `Bearer <serverpassword>`

**Description** : send a notification to all devices

**Body** :

```json
{
    "title":"<title>",
    "message":"<message>",
    "icon":"<optional icon url>",
    "tags": [<optional list of strings>]
}
```

#### Success Responses

**Code** : `200 OK`

**Content** :

```json
{"successful":true,"data":"notified"}
```