import { handleApiRequest } from '../../../../src';
import { createDevice } from '../../../../src/logic/device/create';

describe('delete device', () => {
    test('successful delete', async () => {
        const device = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'key',
            auth: 'auth'
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
    
    /*
    test('delete invalid id', async () => {            
        const deleteRequest = new Request('https://localhost/api/device/1', {
            method: 'DELETE',
            body: JSON.stringify({ secret: 'invalid secret'})
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
        const deleteRequest = new Request('https://localhost/api/device/12345678901234567890123456789012', {
            method: 'DELETE',
            body: JSON.stringify({ secret: 'invalid secret'})
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
    
    test('delete without secret', async () => {            
        const deleteRequest = new Request('https://localhost/api/device/12345678901234567890123456789012', {
            method: 'DELETE',
            body: JSON.stringify({})
        });
        const getResponse = await handleApiRequest(deleteRequest);
        expect(getResponse?.status).toBe(400);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: false,
            error: {
                type: 'missing_data',
                message: expect.any(String)
            }
        });
    });
    */
});