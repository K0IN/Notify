import { databaseCreateDevice, databaseGetDevice } from '../../../src/databases/device';
import { deleteDevice } from '../../../src/logic/device/delete';
import { IDevice } from '../../../src/types/database/device';

describe('device delete tests', () => {
    test('delete successful', async () => {
        const device: IDevice = {
            id: 'c0fad558910fc2d4d2e4c91a5bb4925b',
            pushData: {
                auth: 'test',
                endpoint: 'https://test.com',
                key: 'test',
            },
            secret: '01993d9e846ac84044889292bddd3632'
        };
        await databaseCreateDevice(device);
        await deleteDevice('c0fad558910fc2d4d2e4c91a5bb4925b');
        await expect(async () => {
            await databaseGetDevice('c0fad558910fc2d4d2e4c91a5bb4925b');
        }).rejects.toThrow('Device not found');
    });
});
