import { generateV1Headers, generateV2Headers } from '../../src/webpush/vapid';

describe('test vapid header generation functions', () => {
    let dateNowSpy: any = null;
    beforeAll(() => dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000));
    afterAll(() => dateNowSpy.mockRestore());

    test('generateV1Headers', async () => {
        const vapidKeys = { 'crv': 'P-256', 'd': 'MM3IEY73Br5_Hdtfknab6QIXqCHXv7S5cZrlD3lrjuk', 'ext': true, 'key_ops': ['sign'], 'kty': 'EC', 'x': 'YNEmMB5QyQULW4WepHQvn5WWrBXpHGFB51eJ3oJj3k4', 'y': 'NU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ' };
        const headers = await generateV1Headers('https://example.com/', vapidKeys, 'abc@email.com');
        
        const jwtData = headers['Authorization'].replaceAll('WebPush ', '');
        const [header, body, signature] = jwtData.split('.');
        expect(headers['Crypto-Key']).toEqual('p256ecdsa=BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ');
        expect(JSON.parse(atob(header))).toMatchObject({ 'typ': 'JWT', 'alg': 'ES256' });
        expect(JSON.parse(atob(body))).toMatchObject({ 'aud': 'https://example.com', 'exp': 1487119908, 'sub': 'abc@email.com' });
        // todo validate signature
        expect(signature).toBeTruthy();
    });

    test('generateV2Headers', async () => {
        const vapidKeys = { 'crv': 'P-256', 'd': 'MM3IEY73Br5_Hdtfknab6QIXqCHXv7S5cZrlD3lrjuk', 'ext': true, 'key_ops': ['sign'], 'kty': 'EC', 'x': 'YNEmMB5QyQULW4WepHQvn5WWrBXpHGFB51eJ3oJj3k4', 'y': 'NU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ' };
        const headers = await generateV2Headers('https://example.com/', vapidKeys, 'abc@email.com');
        //  regex extract vapid t=${headers.token}, k=${headers.serverKey}
        const maybeHeader = headers['Authorization'].match(/vapid t=([^,]+), k=([^,]+)/);
        if (!maybeHeader) {
            throw new Error('no match');
        }
        const [, token, serverKey] = maybeHeader;
        const [header, body, signature] = token.split('.');
        expect(serverKey).toEqual('BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ');
        expect(JSON.parse(atob(header))).toMatchObject({ 'typ': 'JWT', 'alg': 'ES256' });
        expect(JSON.parse(atob(body))).toMatchObject({ 'aud': 'https://example.com', 'exp': 1487119908, 'sub': 'abc@email.com' });
        // todo validate signature
        expect(signature).toBeTruthy();
    });

});
