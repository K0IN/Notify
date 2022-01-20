import { createDevice, deleteDeviceFromDatabase, getAllDevicesIDs, getDevice } from '../../src/databases/device';
import type { IDevice } from '../../src/types/database/device';

describe('test device database', () => {
    test('check if list is empty', async () => {
        const devices = await getAllDevicesIDs();
        expect(devices).toEqual([]);
        expect(devices.length).toBe(0);
    });

    test('check if device gets added', async () => {
        const device: IDevice = {
            id: 'test',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: 'test'
        };
        await createDevice(device);
        const devices = await getAllDevicesIDs();
        expect(devices.length).toBe(1);
    });

    test('check if device gets added and can be read', async () => {
        const device: IDevice = {
            id: 'test',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: 'test'
        };
        await createDevice(device);
        const devices = await getAllDevicesIDs();
        expect(devices.length).toBe(1);
        const deviceFromDatabase = await getDevice(device.id);
        expect(deviceFromDatabase).toEqual(device);
    });

    test('check if device gets deleted', async () => {
        const device: IDevice = {
            id: 'test',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: 'test'
        };
        await createDevice(device);
        const devices = await getAllDevicesIDs();
        expect(devices.length).toBe(1);
        await deleteDeviceFromDatabase(device.id);
        const devices2 = await getAllDevicesIDs();
        expect(devices2.length).toBe(0);
    });

    test('check if undefined device throws', async () => {
        await expect(async () => {
            await getDevice('none existing device');
        })
            .rejects
            .toThrow('Device not found');
    });

    test('check if same id create device throws', async () => {
        const device: IDevice = {
            id: 'test',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: 'test'
        };

        await createDevice(device);
        const devices = await getAllDevicesIDs();
        expect(devices.length).toBe(1);

        await expect(async () => {
            await createDevice(device);
        }).rejects.toThrow('Device already exists');

        const devices2 = await getAllDevicesIDs();
        expect(devices2.length).toBe(1);
    });

    test('check if all ids are correctly returned', async () => {
        for (let i = 0; i < 100; i++) {
            const device: IDevice = {
                id: String(i),
                pushData: {
                    auth: 'test',
                    endpoint: 'test',
                    key: 'test',
                },
                secret: 'test'
            };
            
            await createDevice(device);

            const devices = await getAllDevicesIDs();
            expect(devices.length).toBe(i + 1);
            
            const deviceFromDatabase = await getDevice(device.id);
            expect(deviceFromDatabase).toEqual(device);
        }
    });

    test('check if get ides pages works', async () => {
        for (let i = 0; i < 10_000; i++) {
            const device: IDevice = {
                id: String(i),
                pushData: {
                    auth: 'test',
                    endpoint: 'test',
                    key: 'test',
                },
                secret: 'test'
            };            
            await createDevice(device);
        }
        const devices = await getAllDevicesIDs();
        expect(devices.length).toBe(10000);
    });


});
