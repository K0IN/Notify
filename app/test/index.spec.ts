import { errorHandler, handleCors } from '../src';
import { corsHeaders } from '../src/cors';

describe('index', () => {    
    test('errorHandler', async () => {
        const e = new Error('test');
        const res = errorHandler(e);
        expect(res.status).toBe(500);
        const obj = await res.json();
        expect(obj).toMatchObject({
            successful: false,
            error: {
                type: 'internal_error',
                message: 'test'
            }
        });
    });

    test('set cors header', async () => {
        const request = new Request('https://localhost/api/device/', { method: 'OPTIONS' });
        const res = handleCors(request);
        for(const headerName in corsHeaders) {
            expect(res?.headers.get(headerName)).toEqual((corsHeaders as any)[headerName]);
        }
    });
});