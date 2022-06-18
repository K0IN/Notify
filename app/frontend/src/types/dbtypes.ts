import type { DBSchema, IDBPDatabase } from 'idb';
import type { Device } from './localdevice';
import type { MessageType } from './messagetype';

export interface NotifyV1Store extends DBSchema {
    'messages': {
        key: number;
        value: MessageType;
    },
    'user': {
        key: string;
        value: Device;
    }
}

export type NotifyDatabase = IDBPDatabase<NotifyV1Store>;