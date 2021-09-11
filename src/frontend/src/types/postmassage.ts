import { Message } from "./message";

export interface BasePushMessage<T> {
    type: string;
    data: T;
}

export interface NewMessagePushMessage extends BasePushMessage<Message> {
    type: 'notification';
}

export type PushMessage = NewMessagePushMessage; // todo rename this