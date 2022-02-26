import { handleApiRequest } from '../../../../src';
import { createDevice } from '../../../../src/logic/device/create';

describe('check if device exists', () => {
    test('successful get', async () => {
        // create a test device
        const device = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA==', // test as base64
            auth: 'dGVzdA==' // test as base64
        });

        const getRequest = new Request(`https://localhost/api/device/${device.id}`, {
            headers: {
                'authorization': `Bearer ${device.secret}`
            }
        });

        const getResponse = await handleApiRequest(getRequest);
        expect(getResponse?.status).toBe(200);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: true,
            data: true
        });
    });

    test('get invalid id', async () => {
        const getRequest = new Request('https://localhost/api/device/1', {
            headers: {
                'authorization': 'Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            }
        });
        const getResponse = await handleApiRequest(getRequest);
        expect(getResponse?.status).toBe(400);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: false,
            error: {
                type: 'invalid_data',
                message: expect.any(String)
            }
        });
    });

    test('get invalid device', async () => {
        const device = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA==', // test as base64
            auth: 'dGVzdA==' // test as base64
        });

        const getRequest = new Request(`https://localhost/api/device/${device.id}`, {
            headers: {
                'authorization': 'Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            }
        });
        const getResponse = await handleApiRequest(getRequest);
        expect(getResponse?.status).toBe(401);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: false,
            error: {
                type: 'auth_required',
                message: expect.any(String)
            }
        });
    });
});
