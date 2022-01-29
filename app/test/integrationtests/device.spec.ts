import { handleApiRequest } from '../../src/index';
import { WebPushInfos } from '../../src/webpush/webpushinfos';
describe('device endpoints', () => {
    describe('create device', () => {
        test('successful create', async () => {
            const requestData: { web_push_data: WebPushInfos } = {
                web_push_data: {
                    endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
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
                    type: 'missing_data',
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
                        type: 'missing_data',
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
                        type: 'missing_data',
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
                        type: 'missing_data',
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
                        auth: 'auth aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
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
                        key: 'key aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
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
                        endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpointaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
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
});