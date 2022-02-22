import { createDevice, getDevice } from '../../../src/databases/device';
import { update } from '../../../src/logic/device/update';
import { IDevice } from '../../../src/types/database/device';

// todo fix names of database and device functions 

describe('device update tests', () => {
    test('delete successful', async () => {
        const device: IDevice = {
            id: 'test-device-id',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: 'test-device-secret'
        };
        await createDevice(device);
        await update('test-device-id', 'test-device-secret', { auth: 'new', endpoint: 'new', key: 'new' });
        const dev = await getDevice('test-device-id');
        expect(dev.pushData.auth).toBe('new');
        expect(dev.pushData.endpoint).toBe('new');
        expect(dev.pushData.key).toBe('new');
    });

    test('delete invalid device', async () => {
        await expect(async () => {
            await update('test-device-id', 'test-device-secret', { auth: 'new', endpoint: 'new', key: 'new' });
        })
            .rejects
            .toThrow('Device not found');
    });

    test('delete device with wrong password', async () => {
        const device: IDevice = {
            id: 'test-device-id',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: 'test-device-secret'
        };
        await createDevice(device);
        await expect(async () => {
            await update('test-device-id', 'wrong-device-secret', { auth: 'new', endpoint: 'new', key: 'new' });
        })
            .rejects
            .toThrow('Invalid secret');

    });
});