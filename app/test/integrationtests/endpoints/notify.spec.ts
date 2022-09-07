import { databaseGetDevice } from '../../../src/databases/device';
import { handleApiRequest } from '../../../src/index';
import { createDevice } from '../../../src/logic/device';

describe('device endpoints', () => {

    test('send minimal(title, message) notification', async () => {
        const req = new Request('https://localhos/api/notify/', {
            method: 'POST',
            body: JSON.stringify({
                title: 'title',
                message: 'message',
            })
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(200);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: true,
            data: 'notified'
        });
    });

    test('send invalid icon notification', async () => {
        const req = new Request('https://localhos/api/notify/', {
            method: 'POST',
            body: JSON.stringify({
                title: 'title',
                message: 'message',
                icon: 'invalid'
            })
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(400);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: false,
            error: {
                type: 'invalid_data'
            }
        });
    });

    test('send too much data notification', async () => {
        const randomString = (length: number) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        const req = new Request('https://localhos/api/notify/', {
            method: 'POST',
            body: JSON.stringify({
                title: randomString(1024),
                message: randomString(1024),
                icon: 'https://example.com/icon.png',
            })
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(400);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: false,
            error: {
                type: 'invalid_data'
            }
        });
    });

    test('send invalid tags notification', async () => {
        const req = new Request('https://localhos/api/notify/', {
            method: 'POST',
            body: JSON.stringify({
                title: 'title',
                message: 'message',
                icon: 'https://example.com/icon.png',
                tags: 'ya boy'
            })
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(400);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: false,
            error: {
                type: 'invalid_data'
            }
        });
    });

    test('send invalid device notification', async () => {
        const { id } = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/dF41Z5_jfxM:APA91bEEzcWhppN8dpqyWUoHRZqh6IRZ0v1EJUg_KKixTt2C1E-_iQvxv1kdHWdPPg7rnxqZKwSk5TDsTw2EXlVSnhVfMMDS188JiZ66UD5W-40VvzQsAD1aSu5HlkJt3gUm_SYfbfmA',
            key: 'BJOhiNYL5tPXZanW7c1dY+lrQIgM49hPnC24NF8Db2y45ZrYX6bin1ia1avgmK2qUSDTO5jCvCX6tGC+pPOKYEY=',
            auth: 'UoPyptmL7Iuu1yp7RZJp4A=="'
        });

        const req = new Request('https://localhos/api/notify/', {
            method: 'POST',
            body: JSON.stringify({
                title: 'title',
                message: 'message',
            })
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(200);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: true,
            data: 'notified'
        });

        await new Promise(resolve => setTimeout(resolve, 1_000));
        await expect(async () => {
            await databaseGetDevice(id);
        })
            .rejects
            .toThrow('Device not found');
    });

    test('send invalid device data notification', async () => {
        const { id } = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA==', // test as base64
            auth: 'UoPyptmL7Iuu1yp7RZJp4A=="' // test as base64
        });

        const req = new Request('https://localhos/api/notify/', {
            method: 'POST',
            body: JSON.stringify({
                title: 'title',
                message: 'message',
            })
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(200);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: true,
            data: 'notified'
        });

        await new Promise(resolve => setTimeout(resolve, 1_000));
        await expect(async () => {
            await databaseGetDevice(id);
        })
            .rejects
            .toThrow('Device not found');
    });

    // this should be a edge case - but i just want to make sure it works
    test('send remove device data notification', async () => {
        const { id } = await createDevice(null as any); // empty device - this should not happen

        const req = new Request('https://localhos/api/notify/', {
            method: 'POST',
            body: JSON.stringify({
                title: 'title',
                message: 'message',
            })
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(200);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: true,
            data: 'notified'
        });

        await new Promise(resolve => setTimeout(resolve, 1_000));

        await expect(async () => {
            await databaseGetDevice(id);
        })
            .rejects
            .toThrow('Device not found');

    });
});
