import { handleApiRequest } from '../../../../src';
import { createDevice } from '../../../../src/logic/device/create';

describe('delete device', () => {
    test('successful delete', async () => {
        const device = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA==', // test as base64
            auth: 'dGVzdA==' // test as base64
        });

        const deleteRequest = new Request(`https://localhost/api/device/${device.id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${device.secret}`
            }
        });

        const getResponse = await handleApiRequest(deleteRequest);
        expect(getResponse?.status).toBe(200);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: true,
            data: 'deleted'
        });
    });


    test('delete invalid id', async () => {
        const deleteRequest = new Request('https://localhost/api/device/1', {
            method: 'DELETE',
            headers: {
                'authorization': 'Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            }
        });
        const getResponse = await handleApiRequest(deleteRequest);
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

    test('delete invalid secret', async () => {
        const device = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA==', // test as base64
            auth: 'dGVzdA==' // test as base64
        });
        {
            const deleteRequest = new Request(`https://localhost/api/device/${device.id}`, {
                method: 'DELETE',
                headers: {
                    'authorization': 'Bearer invalid secret'
                }
            });
    
            const getResponse = await handleApiRequest(deleteRequest);
            expect(getResponse?.status).toBe(401);
            const getBody = await getResponse?.json();
            expect(getBody).toMatchObject({
                successful: false,
                error: {
                    type: 'auth_required',
                    message: expect.any(String)
                }
            });
        }
        {
            const deleteRequest = new Request(`https://localhost/api/device/${device.id}`, {
                method: 'DELETE',
                headers: {
                    'authorization': 'Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                }
            });
    
            const getResponse = await handleApiRequest(deleteRequest);
            expect(getResponse?.status).toBe(401);
            const getBody = await getResponse?.json();
            expect(getBody).toMatchObject({
                successful: false,
                error: {
                    type: 'auth_required',
                    message: expect.any(String)
                }
            });
        }
    });

    test('delete without secret', async () => {
        const deleteRequest = new Request('https://localhost/api/device/12345678901234567890123456789012', {
            method: 'DELETE'
        });
        const getResponse = await handleApiRequest(deleteRequest);
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
