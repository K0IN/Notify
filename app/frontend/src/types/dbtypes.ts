import { DBSchema } from 'idb';
import { Device } from './localdevice';
import { MessageType } from './messagetype';

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

