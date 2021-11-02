import test from 'ava';
import { Miniflare, Request } from 'miniflare';

test.beforeEach((t) => {
    const mf = new Miniflare({
        buildCommand: undefined,
        kvNamespaces: ['NOTIFY_USERS'],
        kvPersist: false,
        envPath: './test.env'
    });
    t.context = { mf };
});

test('test url check for create device', async (t) => {
    const { mf } = t.context;
    {
        const req = new Request('http://localhost/api/device/', {
            method: 'POST',
            body: `{
                "web_push_data": {
                    "auth": "auth",
                    "endpoint": "endpoint",
                    "key": "key"
                }
            }` });
        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        t.assert(!json.successful, 'added device with invalid endpoint url');
    }
    {
        const req = new Request('http://localhost/api/device/', {
            method: 'POST',
            body: `{
                "web_push_data": {
                    "auth": "auth",
                    "endpoint": "https://google.com",
                    "key": "key"
                }
            }` });
        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        t.assert(json.successful, 'did not add device with valid endpoint url');
        const ns = await mf.getKVNamespace('NOTIFY_USERS');
        const storedData = JSON.parse(await ns.get(json.data.id));
        t.assert(storedData.id === json.data.id, 'stored id did not match sent id');
        t.assert(storedData.secret === json.data.secret, 'stored secret did not match sent secret');
    }
});

test('device livespan check', async (t) => {
    const { mf } = t.context;
    let deviceId = null;
    let deviceSecret = null;
    {
        const req = new Request('http://localhost/api/device/', {
            method: 'POST',
            body: `{
                "web_push_data": {
                    "auth": "auth",
                    "endpoint": "https://google.com",
                    "key": "key"
                }
            }` });
        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        deviceId = json.data.id;
        deviceSecret = json.data.secret;
        t.assert(json.data.id, 'device id not set');
    }
    {
        const req = new Request('http://localhost/api/device/' + deviceId);
        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        t.assert(json.successful, 'returned incorrect success status');
        t.assert(json.data, 'returned invalid device status - device exits');
    }
    {
        const req = new Request('http://localhost/api/device/' + deviceId, {
            method: 'DELETE',
            body: `{
                "secret": "${deviceSecret}"
            }`
        });
        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        t.assert(json.successful, 'returned incorrect success status');
    }
    {
        const req = new Request('http://localhost/api/device/' + deviceId);
        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        t.assert(json.successful, 'returned incorrect success status');
        t.assert(!json.data, 'returned invalid device status - device does not exit');
    }
});
