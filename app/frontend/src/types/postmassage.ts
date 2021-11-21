import type { MessageType } from './messagetype';

export interface BasePushMessage<T> {
    type: string;
    data: T;
}

export interface NewMessagePushMessage extends BasePushMessage<MessageType> {
    type: 'notification';
}

export type PushMessage = NewMessagePushMessage; // todo rename this