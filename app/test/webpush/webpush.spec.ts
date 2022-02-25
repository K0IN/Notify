import { enableFetchMocks, disableFetchMocks } from 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';

import { JWK } from '../../src/webpush/jwk';
import { generateWebPushMessage } from '../../src/webpush/webpush';
import { WebPushInfos, WebPushMessage, WebPushResult } from '../../src/webpush/webpushinfos';

describe('test webpush functions', () => {
    beforeAll(enableFetchMocks);
    afterAll(disableFetchMocks);
    beforeEach(() => fetchMock.resetMocks());
    test('test successful web push', async () => {
        const message: WebPushMessage = {
            data: 'test',
            urgency: 'normal',
            sub: 'sub',
            ttl: 3600
        };
        const deviceData: WebPushInfos = {
            auth: '98pcIF7xNHHZZXfJy0NgHA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/cFE86J68Mik:APA91bHZzx_GeFlgMX-OP24OwkqpTSdTQC4bQvLpZXefFz9IaqCIgy27MiZs27cORkklnVLOYa6J6OyNLXHB-6dA4wCoBGMSsG3SbaS5OsCYvbj4FHkAkdkNcXhvfkL1wblxLgHIFUUB',
            key: 'BLldnypgxeYeHbtnzpqvSdcn7xKGgDtPTiPyy2ctFc5A/Oz+L0tUilPsm7g1SWNYylhPNtop+QyEGTAqf3U6hJc='
        };
        const applicationServerKeys: JWK = {
            'crv': 'P-256',
            'd': 'MM3IEY73Br5_Hdtfknab6QIXqCHXv7S5cZrlD3lrjuk',
            'ext': true,
            'key_ops': ['sign'],
            'kty': 'EC',
            'x': 'YNEmMB5QyQULW4WepHQvn5WWrBXpHGFB51eJ3oJj3k4',
            'y': 'NU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ'
        };

        fetchMock.mockResponseOnce(JSON.stringify({ data: 'ok' }), { status: 200 }); 
        const result = await generateWebPushMessage(message, deviceData, applicationServerKeys);
        expect(result).toBe(WebPushResult.Success);
        expect(fetchMock.mock.calls.length).toEqual(1); // one call 
        expect(fetchMock.mock.calls[0][0]).toEqual(deviceData.endpoint); // the call endpoint was the device endpoint
        expect(fetchMock.mock.calls[0][1]?.method).toEqual('POST'); // the call was a post request
        const header = fetchMock.mock.calls[0][1]?.headers as unknown as {[key: string]: string};
        expect(header['Content-Type']).toEqual('application/octet-stream'); // the call had a content type header
        const k = header['Authorization'].match(/k=([^,]+)/)?.[1];
        expect(k).toEqual('BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ');
        expect(header['Content-Encoding']).toEqual('aesgcm');
        expect(Number.parseInt(header['TTL'])).toEqual(message.ttl); // the call had a TTL header
        expect(header['Urgency']).toEqual(message.urgency); // the call had an urgency header
    });

    test('test failed web push', async () => {
        const message: WebPushMessage = {
            data: 'test',
            urgency: 'normal',
            sub: 'sub',
            ttl: 3600
        };
        const deviceData: WebPushInfos = {
            auth: '98pcIF7xNHHZZXfJy0NgHA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/cFE86J68Mik:APA91bHZzx_GeFlgMX-OP24OwkqpTSdTQC4bQvLpZXefFz9IaqCIgy27MiZs27cORkklnVLOYa6J6OyNLXHB-6dA4wCoBGMSsG3SbaS5OsCYvbj4FHkAkdkNcXhvfkL1wblxLgHIFUUB',
            key: 'BLldnypgxeYeHbtnzpqvSdcn7xKGgDtPTiPyy2ctFc5A/Oz+L0tUilPsm7g1SWNYylhPNtop+QyEGTAqf3U6hJc='
        };
        const applicationServerKeys: JWK = {
            'crv': 'P-256',
            'd': 'MM3IEY73Br5_Hdtfknab6QIXqCHXv7S5cZrlD3lrjuk',
            'ext': true,
            'key_ops': ['sign'],
            'kty': 'EC',
            'x': 'YNEmMB5QyQULW4WepHQvn5WWrBXpHGFB51eJ3oJj3k4',
            'y': 'NU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ'
        };

        fetchMock.mockResponseOnce(JSON.stringify({ data: 'user not found' }), { status: 404 }); 
        const result = await generateWebPushMessage(message, deviceData, applicationServerKeys);
        expect(result).toBe(WebPushResult.NotSubscribed);
        expect(fetchMock.mock.calls.length).toEqual(1); // one call 
        expect(fetchMock.mock.calls[0][0]).toEqual(deviceData.endpoint); // the call endpoint was the device endpoint
        expect(fetchMock.mock.calls[0][1]?.method).toEqual('POST'); // the call was a post request
        const header = fetchMock.mock.calls[0][1]?.headers as unknown as {[key: string]: string};
        expect(header['Content-Type']).toEqual('application/octet-stream'); // the call had a content type header
        const k = header['Authorization'].match(/k=([^,]+)/)?.[1];
        expect(k).toEqual('BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ');
        expect(header['Content-Encoding']).toEqual('aesgcm');
        expect(Number.parseInt(header['TTL'])).toEqual(message.ttl);
        expect(header['Urgency']).toEqual(message.urgency);
    });

    test('test not subscribed web push', async () => {
        const message: WebPushMessage = {
            data: 'test',
            urgency: 'normal',
            sub: 'sub',
            ttl: 3600
        };
        const deviceData: WebPushInfos = {
            auth: '98pcIF7xNHHZZXfJy0NgHA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/cFE86J68Mik:APA91bHZzx_GeFlgMX-OP24OwkqpTSdTQC4bQvLpZXefFz9IaqCIgy27MiZs27cORkklnVLOYa6J6OyNLXHB-6dA4wCoBGMSsG3SbaS5OsCYvbj4FHkAkdkNcXhvfkL1wblxLgHIFUUB',
            key: 'BLldnypgxeYeHbtnzpqvSdcn7xKGgDtPTiPyy2ctFc5A/Oz+L0tUilPsm7g1SWNYylhPNtop+QyEGTAqf3U6hJc='
        };
        const applicationServerKeys: JWK = {
            'crv': 'P-256',
            'd': 'MM3IEY73Br5_Hdtfknab6QIXqCHXv7S5cZrlD3lrjuk',
            'ext': true,
            'key_ops': ['sign'],
            'kty': 'EC',
            'x': 'YNEmMB5QyQULW4WepHQvn5WWrBXpHGFB51eJ3oJj3k4',
            'y': 'NU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ'
        };

        fetchMock.mockResponseOnce(JSON.stringify({ data: 'user not subscribed' }), { status: 410 }); 
        const result = await generateWebPushMessage(message, deviceData, applicationServerKeys);
        expect(result).toBe(WebPushResult.NotSubscribed);
        expect(fetchMock.mock.calls.length).toEqual(1); // one call 
        expect(fetchMock.mock.calls[0][0]).toEqual(deviceData.endpoint); // the call endpoint was the device endpoint
        expect(fetchMock.mock.calls[0][1]?.method).toEqual('POST'); // the call was a post request
        const header = fetchMock.mock.calls[0][1]?.headers as unknown as {[key: string]: string};
        expect(header['Content-Type']).toEqual('application/octet-stream'); // the call had a content type header
        const k = header['Authorization'].match(/k=([^,]+)/)?.[1];
        expect(k).toEqual('BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ');
        expect(header['Content-Encoding']).toEqual('aesgcm');
        expect(Number.parseInt(header['TTL'])).toEqual(message.ttl);
        expect(header['Urgency']).toEqual(message.urgency);
    });
});
