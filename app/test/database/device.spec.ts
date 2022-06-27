import { databaseCreateDevice, databaseGetAllDeviceIDs, databaseGetDevice } from '../../src/databases/device';
import { deleteDevice } from '../../src/logic/device/delete';
import type { IDevice } from '../../src/types/database/device';
import { generateRandomId } from '../../src/webpush/util';

describe('test device database', () => {
    test('check if list is empty', async () => {
        const devices = await databaseGetAllDeviceIDs();
        expect(devices).toEqual([]);
        expect(devices.length).toBe(0);
    });

    test('check if device gets added', async () => {
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
        const devices = await databaseGetAllDeviceIDs();
        expect(devices.length).toBe(1);
    });

    test('check if device gets added and can be read', async () => {
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
        const devices = await databaseGetAllDeviceIDs();
        expect(devices.length).toBe(1);
        const deviceFromDatabase = await databaseGetDevice(device.id);
        expect(deviceFromDatabase).toEqual(device);
    });

    test('check if device gets deleted', async () => {
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
        const devices = await databaseGetAllDeviceIDs();
        expect(devices.length).toBe(1);
        await deleteDevice(device.id);
        const devices2 = await databaseGetAllDeviceIDs();
        expect(devices2.length).toBe(0);
    });

    test('check if undefined device throws', async () => {
        await expect(async () => {
            await databaseGetDevice('none existing device');
        })
            .rejects
            .toThrow('Device not found');
    });

    test('check if same id create device throws', async () => {
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
        const devices = await databaseGetAllDeviceIDs();
        expect(devices.length).toBe(1);

        await expect(async () => {
            await databaseCreateDevice(device);
        }).rejects.toThrow('Device already exists');

        const devices2 = await databaseGetAllDeviceIDs();
        expect(devices2.length).toBe(1);
    });

    test('check if all ids are correctly returned', async () => {
        for (let i = 0; i < 100; i++) {
            const id = generateRandomId();
            const device: IDevice = {
                id: id,
                pushData: {
                    auth: 'test',
                    endpoint: 'https://test.com',
                    key: 'test',
                },
                secret: '01993d9e846ac84044889292bddd3632'
            };
            
            await databaseCreateDevice(device);

            const devices = await databaseGetAllDeviceIDs();
            expect(devices.length).toBe(i + 1);
            
            const deviceFromDatabase = await databaseGetDevice(device.id);
            expect(deviceFromDatabase).toEqual(device);
        }
    });

    test('check if huge get ids works', async () => {
        for (let i = 0; i < 10_000; i++) {
            const id = generateRandomId();
            const device: IDevice = {
                id: id,
                pushData: {
                    auth: 'test',
                    endpoint: 'https://test.com',
                    key: 'test',
                },
                secret: '01993d9e846ac84044889292bddd3632'
            };            
            await databaseCreateDevice(device);
        }
        const devices = await databaseGetAllDeviceIDs();
        expect(devices.length).toBe(10000);
    });
});
