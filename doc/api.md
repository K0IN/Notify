# API Documentation

## Routes

All routes are prefixed with `/api`

---

## Notifications Endpoint

### Send a Notification to All Devices

**URL**: `/api/notify`

**Method**: `POST`

**Auth required**: Yes (only if the server password is set). Authentication
header must be `Bearer <serverpassword>`.

**Description**: Send a notification to all devices.

**Body**:

```json
{
  "title": "<title>",
  "message": "<message>",
  "icon": "<optional icon url>",
  "tags": ["<optional list of strings>"]
}
```

#### Success Response

**Code**: `200 OK`

**Content**:

```json
{
  "successful": true,
  "data": "notified"
}
```

---

## Keys Endpoint

### Get Vapid Keys

**URL**: `/api/keys`

**Method**: `GET`

**Auth required**: No

**Description**: Get the server Vapid key to create a client subscription.

#### Success Response

**Code**: `200 OK`

**Content**:

```json
{
  "successful": true,
  "data": "BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ"
}
```

---

## Device Endpoint

### Create a New Device

**URL**: `/api/device`

**Method**: `POST`

**Auth required**: No (only if the server password is set). Authentication header must be `Bearer <serverpassword>`.

**Description**: Create a new device and return the device ID with a secret that
can be used to delete or update it later.

**Body**:

```json
{
  "web_push_data": {
    "endpoint": "<endpoint url>",
    "key": "<base64 encoded subscription p256 key>",
    "auth": "<base64 encoded subscription auth>"
  }
}
```

#### Success Response

**Code**: `200 OK`

**Content**:

```json
{
  "successful": true,
  "data": {
    "id": "c968712190ec72e785160fe2a45b45a4",
    "secret": "bd907b2a5f9e571949aa92561fcb5694"
  }
}
```

### Check If a Device Exists

**URL**: `/api/device/<device_id>`

**Method**: `GET`

**Auth required**: No

**Description**: Check if a device exists.

#### Success Response

**Code**: `200 OK`

**Content**:

```json
{
  "successful": true,
  "data": true
}
```

### Delete a Device

**URL**: `/api/device/<device_id>`

**Method**: `DELETE`

**Auth required**: No

**Description**: Delete a device.

**Body**:

```json
{
  "secret": "<device secret>"
}
```

#### Success Response

**Code**: `200 OK`

**Content**:

```json
{
  "successful": true,
  "data": "device deleted"
}
```

