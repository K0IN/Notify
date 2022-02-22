import { Request as ittyRequest } from 'itty-router';
import { extractAuthHeader } from '../../src/util/headers';

describe('header auth helper', () => {
    test('check correct auth', async () => {
        const req = new Request('https://localhost/api/device/0f23a3129eefc8b90f23a3129eefc8b9', {
            headers: {
                'authorization': 'Bearer 8a7a4f189b0cfeab8a7a4f189b0cfeab'
            }
        }) as ittyRequest;        
        
        const x = extractAuthHeader((req as any).headers);
        expect(x).toBe('8a7a4f189b0cfeab8a7a4f189b0cfeab');
    });

    test('check invalid encoding header', async () => {
        const req = new Request('https://localhost/api/device/0f23a3129eefc8b90f23a3129eefc8b9', {
            headers: {
                'authorization': '8a7a4f189b0cfeab8a7a4f189b0cfeab'
            }
        }) as ittyRequest;        
        
        const x = extractAuthHeader((req as any).headers);
        expect(x).toBe(undefined);
    });

    test('check no header', async () => {
        const req = new Request('https://localhost/api/device/0f23a3129eefc8b90f23a3129eefc8b9') as ittyRequest;        
        const x = extractAuthHeader((req as any).headers);
        expect(x).toBe(undefined);
    });

    test('check no request', async () => {       
        const x = extractAuthHeader(undefined);
        expect(x).toBe(undefined);
    });
});
