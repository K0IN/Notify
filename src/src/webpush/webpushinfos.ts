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

// todo move this to own errors
export enum WebPushResult {
    Success = 0,
    Error = 1,
    NotSubscribed = 2,
    NoDataProvided = 3,
}