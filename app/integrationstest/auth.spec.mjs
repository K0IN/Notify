import test from 'ava';
import { Miniflare, Request } from 'miniflare';

test.beforeEach((t) => {
    const mf = new Miniflare({
        buildCommand: undefined,
        kvNamespaces: ['NOTIFY_USERS'],
        kvPersist: false,
        envPath: './integrationstest/test2.env'
    });
    t.context = { mf };
});

test('test auth with no header', async (t) => {
    const { mf } = t.context;
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
        t.assert(json.successful == false, 'failed to check auth');
        t.assert(json.error, 'did not responed with error');
        t.assert(json.error.type == 'auth_required', 'did not respond with correct error type');
    }
});

test('test auth with wrong header', async (t) => {
    const { mf } = t.context;
    {
        const req = new Request('http://localhost/api/device/', {
            method: 'POST',
            body: `{
                "web_push_data": {
                    "auth": "auth",
                    "endpoint": "https://google.com",
                    "key": "key"
                }
            }`,
            headers: {
                'Authorization': 'Bearer wrong_password'
            } 
        });

        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        t.assert(json.successful == false, 'failed to check auth');
        t.assert(json.error, 'did not responed with error');
        t.assert(json.error.type == 'auth_required', 'did not respond with correct error type');
    }

});

test('test auth with correct header', async (t) => {
    const { mf } = t.context;
    {
        const req = new Request('http://localhost/api/device/', {
            method: 'POST',
            body: `{
                "web_push_data": {
                    "auth": "auth",
                    "endpoint": "https://google.com",
                    "key": "key"
                }
            }`,
            headers: {
                'Authorization': 'Bearer this_is_a_secret'
            }
        });

        const res = await mf.dispatchFetch(req);
        const json = await res.json();
        t.assert(json.successful, 'failed to check auth');
    }
});
