import { createDevice } from '../../../src/databases/device';
import { deleteDevice } from '../../../src/logic/device/delete';
import { IDevice } from '../../../src/types/database/device';

describe('device delete tests', () => {
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
        await deleteDevice('test-device-id', 'test-device-secret');
    });

    test('delete invalid device', async () => {

        await expect(async () => {
            await deleteDevice('test-device-id', 'test-device-secret');
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
            await deleteDevice('test-device-id', 'another-device-secret');
        })
            .rejects
            .toThrow('Invalid secret');

    });
});