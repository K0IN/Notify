import { handleApiRequest } from '../../../../src';
import { WebPushInfos } from '../../../../src/webpush/webpushinfos';

describe('delete device', () => {
    test('successful delete', async () => {
        const requestData: { web_push_data: WebPushInfos } = {
            web_push_data: {
                endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                key: 'key',
                auth: 'auth'
            }
        };
        const createRequest = new Request('https://localhost/api/device/', {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
        const createResponse = await handleApiRequest(createRequest);
        expect(createResponse?.status).toBe(200);
        const body = await createResponse?.json();
        const deleteRequest = new Request(`https://localhost/api/device/${body.data.id}`, {
            method: 'DELETE',
            body: JSON.stringify({ secret: body.data.secret })
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
});
