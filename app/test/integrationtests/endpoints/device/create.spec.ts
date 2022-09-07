import { handleApiRequest } from '../../../../src';
import { WebPushInfos } from '../../../../src/webpush/webpushinfos';

// todo test password auth

describe('create device', () => {
    test('successful create', async () => {
        const req = new Request('https://localhost/api/device/', {
            method: 'POST',
            body: JSON.stringify({
                web_push_data: {
                    endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                    key: 'dGVzdA==', // test as base64
                    auth: 'dGVzdA==' // test as base64
                }
            })
        });

        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(200);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: true,
            data: {
                id: expect.stringMatching(/^[0-9a-f]{32}$/),
                secret: expect.stringMatching(/^[0-9a-f]{32}$/)
            }
        });
    });

    test('invalid json body', async () => {
        const req = new Request('https://localhost/api/device/', {
            method: 'POST',
            body: 'dwau2y17{}dwd'
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(400);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: false,
            error: {
                type: 'invalid_data',
                message: expect.any(String)
            }
        });
    });

    test('partial json body', async () => {
        {
            const requestData: { web_push_data: Partial<WebPushInfos> } = {
                web_push_data: {
                    endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                    auth: 'auth'
                }
            };
            const req = new Request('https://localhost/api/device/', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
            const res = await handleApiRequest(req);
            expect(res).toBeTruthy();
            expect(res?.status).toBe(400);
            const body = await res?.json();
            expect(body).toMatchObject({
                successful: false,
                error: {
                    type: 'invalid_data',
                    message: expect.any(String)
                }
            });
        }
        {
            const requestData: { web_push_data: Partial<WebPushInfos> } = {
                web_push_data: {
                    key: 'key',
                    auth: 'auth'
                }
            };
            const req = new Request('https://localhost/api/device/', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
            const res = await handleApiRequest(req);
            expect(res).toBeTruthy();
            expect(res?.status).toBe(400);
            const body = await res?.json();
            expect(body).toMatchObject({
                successful: false,
                error: {
                    type: 'invalid_data',
                    message: expect.any(String)
                }
            });
        }
        {
            const requestData: { web_push_data: Partial<WebPushInfos> } = {
                web_push_data: {
                    endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                    key: 'key'
                }
            };
            const req = new Request('https://localhost/api/device/', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
            const res = await handleApiRequest(req);
            expect(res).toBeTruthy();
            expect(res?.status).toBe(400);
            const body = await res?.json();
            expect(body).toMatchObject({
                successful: false,
                error: {
                    type: 'invalid_data',
                    message: expect.any(String)
                }
            });
        }
    });

    test('invalid endpoint url', async () => {
        const requestData: { web_push_data: Partial<WebPushInfos> } = {
            web_push_data: {
                endpoint: 'this is not a url',
                auth: 'auth',
                key: 'key'
            }
        };
        const req = new Request('https://localhost/api/device/', {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
        const res = await handleApiRequest(req);
        expect(res).toBeTruthy();
        expect(res?.status).toBe(400);
        const body = await res?.json();
        expect(body).toMatchObject({
            successful: false,
            error: {
                type: 'invalid_data',
                message: expect.any(String)
            }
        });
    });

    test('length checks', async () => {
        {
            const requestData: { web_push_data: Partial<WebPushInfos> } = {
                web_push_data: {
                    endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                    auth: 'auth aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    key: 'key'
                }
            };
            const req = new Request('https://localhost/api/device/', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
            const res = await handleApiRequest(req);
            expect(res).toBeTruthy();
            expect(res?.status).toBe(400);
            const body = await res?.json();
            expect(body).toMatchObject({
                successful: false,
                error: {
                    type: 'invalid_data',
                    message: expect.any(String)
                }
            });
        }
        {
            const requestData: { web_push_data: Partial<WebPushInfos> } = {
                web_push_data: {
                    endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
                    auth: 'auth ',
                    key: 'key aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                }
            };
            const req = new Request('https://localhost/api/device/', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
            const res = await handleApiRequest(req);
            expect(res).toBeTruthy();
            expect(res?.status).toBe(400);
            const body = await res?.json();
            expect(body).toMatchObject({
                successful: false,
                error: {
                    type: 'invalid_data',
                    message: expect.any(String)
                }
            });
        }
        {
            const requestData: { web_push_data: Partial<WebPushInfos> } = {
                web_push_data: {
                    endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    auth: 'auth ',
                    key: 'key'
                }
            };
            const req = new Request('https://localhost/api/device/', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
            const res = await handleApiRequest(req);
            expect(res).toBeTruthy();
            expect(res?.status).toBe(400);
            const body = await res?.json();
            expect(body).toMatchObject({
                successful: false,
                error: {
                    type: 'invalid_data',
                    message: expect.any(String)
                }
            });
        }
    });
});