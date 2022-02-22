import { databaseCreateDevice, databaseGetDevice } from '../../../src/databases/device';
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
        await databaseCreateDevice(device);
        await deleteDevice('test-device-id');
        await expect(async () => {
            await databaseGetDevice('test-device-id');
        }).rejects.toThrow('Device not found');
    });
});
