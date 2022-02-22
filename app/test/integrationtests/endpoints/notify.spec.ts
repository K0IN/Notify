import { handleApiRequest } from '../../../src/index';

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
                title: randomString(512),
                message: randomString(512),
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
});
