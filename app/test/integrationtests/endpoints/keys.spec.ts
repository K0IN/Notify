import { handleApiRequest } from '../../../src';

test('responds with url', async () => {
    const req = new Request('https://localhost/api/keys/');
    const res = await handleApiRequest(req);
    expect(res).toBeTruthy();
    // response check
    expect(res?.status).toBe(200);
    expect(await res?.json()).toMatchObject({ successful: true, data: 'BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ' });
    // cors headers check
    expect(res?.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res?.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, PUT, DELETE, OPTIONS, PATCH');
    expect(res?.headers.get('Access-Control-Allow-Headers')).toBe('Origin, X-Requested-With, Content-Type, Accept, Authorization');
});
