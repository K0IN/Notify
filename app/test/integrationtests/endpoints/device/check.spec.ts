import { handleApiRequest } from '../../../../src';
import { WebPushInfos } from '../../../../src/webpush/webpushinfos';

describe('get device', () => {
    test('successful get', async () => {
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
        const getRequest = new Request(`https://localhost/api/device/${body.data.id}`);
        const getResponse = await handleApiRequest(getRequest);
        expect(getResponse?.status).toBe(200);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: true,
            data: true
        });
    });
    test('get invalid id', async () => {
        const getRequest = new Request('https://localhost/api/device/1');
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
        const getRequest = new Request('https://localhost/api/device/12345678901234567890123456789012');
        const getResponse = await handleApiRequest(getRequest);
        expect(getResponse?.status).toBe(200);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: true,
            data: false
        });
    });
});
