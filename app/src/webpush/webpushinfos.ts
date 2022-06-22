export interface WebPushInfos {
    endpoint: string;
    key: string;
    auth: string;
}

type Urgency = 'very-low' | 'low' | 'normal' | 'high';

export interface WebPushMessage {
    data: string;
    urgency: Urgency;
    sub: string;
    ttl: number;
}

export enum WebPushResult {
    Success = 0,
    Error = 1,
    NotSubscribed = 2,
}