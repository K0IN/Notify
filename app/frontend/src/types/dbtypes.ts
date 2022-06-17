import type { DBSchema, IDBPDatabase } from 'idb';
import type { Device } from './localdevice';
import type { MessageType } from './messagetype';

export interface NotifyV1Store extends DBSchema {
    'messages': {
        key: number;
        value: MessageType; // the message type
    },
    'user': {
        key: number;
        value: Device; // the message type
    }
}

export type NotifyDatabase = IDBPDatabase<NotifyV1Store>;