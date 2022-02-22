import { secretAuthFactory } from '../../src/middleware/secret';
import { Request as ittyRequest } from 'itty-router';
import { IDevice } from '../../src/types/database/device';
import { databaseCreateDevice } from '../../src/databases/device';

describe('secret middleware', () => {
    beforeAll(async () => {
        const device: IDevice = {
            id: '0f23a3129eefc8b90f23a3129eefc8b9',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: '8a7a4f189b0cfeab8a7a4f189b0cfeab'
        };
        await databaseCreateDevice(device);
    });

    test('check correct secret', async () => {
        const req = new Request('https://localhost/api/device/0f23a3129eefc8b90f23a3129eefc8b9', {
            headers: {
                'authorization': 'Bearer 8a7a4f189b0cfeab8a7a4f189b0cfeab'
            }
        }) as ittyRequest;        
        req.params = { device_id: '0f23a3129eefc8b90f23a3129eefc8b9' };

        const authFn = secretAuthFactory('device_id');
        const res = await authFn(req);
        expect(res).toBe(undefined);
    });

    test('check invalid secret', async () => {
        const req = new Request('https://localhost/api/device/0f23a3129eefc8b90f23a3129eefc8b9', {
            headers: {
                'authorization': 'Bearer this-is-invalid'
            }
        }) as ittyRequest;        
        req.params = { device_id: '0f23a3129eefc8b90f23a3129eefc8b9' };

        const authFn = secretAuthFactory('device_id');
        const res = await authFn(req);

        expect(res).toBeTruthy();
        expect(res?.status).toBe(401);
        expect(await res?.json()).toMatchObject({ successful: false, error: { type: 'auth_required' } });
    });

    test('check incorrect secret', async () => {
        const req = new Request('https://localhost/api/device/0f23a3129eefc8b90f23a3129eefc8b9', {
            headers: {
                'authorization': 'Bearer 7419da77f7ec7baa7419da77f7ec7baa'
            }
        }) as ittyRequest;        
        req.params = { device_id: '0f23a3129eefc8b90f23a3129eefc8b9' };

        const authFn = secretAuthFactory('device_id');
        const res = await authFn(req);

        expect(res).toBeTruthy();
        expect(res?.status).toBe(401);
        expect(await res?.json()).toMatchObject({ successful: false, error: { type: 'auth_required' } });
    });

    test('check invalid device', async () => {
        const req = new Request('https://localhost/api/device/a', {
            headers: {
                'authorization': 'Bearer 7419da77f7ec7baa7419da77f7ec7baa'
            }
        }) as ittyRequest;        
        req.params = { device_id: 'a' };

        const authFn = secretAuthFactory('device_id');
        const res = await authFn(req);
        
        expect(res).toBeTruthy();
        expect(res?.status).toBe(400);
        expect(await res?.json()).toMatchObject({ successful: false, error: { type: 'invalid_data' } });
    });

    test('check unknown device', async () => {
        const req = new Request('https://localhost/api/device/7419da77f7ec7baa7419da77f7ec7baa', {
            headers: {
                'authorization': 'Bearer 7419da77f7ec7baa7419da77f7ec7baa'
            }
        }) as ittyRequest;        
        req.params = { device_id: '7419da77f7ec7baa7419da77f7ec7baa' };

        const authFn = secretAuthFactory('device_id');
        const res = await authFn(req);
        
        expect(res).toBeTruthy();
        expect(res?.status).toBe(401);
        expect(await res?.json()).toMatchObject({ successful: false, error: { type: 'auth_required' } });
    });

    test('check missing all', async () => {
        const req = new Request('https://localhost/api/device/') as ittyRequest;        
        req.params = { device_id: '' };
        const authFn = secretAuthFactory('device_id');
        const res = await authFn(req);
        
        expect(res).toBeTruthy();
        expect(res?.status).toBe(400);
        expect(await res?.json()).toMatchObject({ successful: false, error: { type: 'invalid_data' } });
    });

    test('check no header', async () => {
        const req = new Request('https://localhost/api/device/0f23a3129eefc8b90f23a3129eefc8b9') as ittyRequest;        
        req.params = { device_id: '0f23a3129eefc8b90f23a3129eefc8b9' };

        const authFn = secretAuthFactory('device_id');
        const res = await authFn(req);

        expect(res).toBeTruthy();
        expect(res?.status).toBe(401);
        expect(await res?.json()).toMatchObject({ successful: false, error: { type: 'auth_required' } });
    });
});
