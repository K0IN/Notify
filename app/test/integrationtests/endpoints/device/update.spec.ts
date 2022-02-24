import { handleApiRequest } from '../../../../src';
import { createDevice } from '../../../../src/logic/device/create';
import { WebPushInfos } from '../../../../src/webpush/webpushinfos';

describe('update device', () => {
    // todo add missing test cases
    test('successful update', async () => {
        const device = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA==', // test as base64
            auth: 'dGVzdA==' // test as base64
        });

        const newRequestData: { web_push_data: WebPushInfos } = {
            web_push_data: {
                endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                key: 'dGVzdA==', // test as base64
                auth: 'dGVzdA==' // test as base64
            }
        };

        const updateRequest = new Request(`https://localhost/api/device/${device.id}`, {
            method: 'PATCH',
            headers: { 'authorization': `Bearer ${device.secret}` },
            body: JSON.stringify({ ...newRequestData })
        });

        const getResponse = await handleApiRequest(updateRequest);

        expect(getResponse?.status).toBe(200);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: true
        });
    });

    test('invalid secret update', async () => {
        const dev = await createDevice({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA==',
            auth: 'dGVzdA=='
        });

        const newRequestData: { web_push_data: WebPushInfos } = {
            web_push_data: {
                endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                key: 'dGVzdA==',
                auth: 'dGVzdA=='
            }
        };

        const updateRequest = new Request(`https://localhost/api/device/${dev.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ ...newRequestData }),
            headers: { 'authorization': 'Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
        });

        const getResponse = await handleApiRequest(updateRequest);
        expect(getResponse?.status).toBe(401);
        const getBody = await getResponse?.json();
        expect(getBody).toMatchObject({
            successful: false
        });
    });
});