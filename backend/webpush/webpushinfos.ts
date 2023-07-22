import { z } from "zod";

const base64Regex = /^(?:[a-zA-Z0-9+/]{4})*(?:|(?:[a-zA-Z0-9+/]{3}=)|(?:[a-zA-Z0-9+/]{2}==)|(?:[a-zA-Z0-9+/]{1}===))$/;
export const WebPushInfosSchema = z.object({
    endpoint: z.string().url().max(1024),
    key: z.string().max(512).regex(base64Regex, "auth is not base 64 encoded"), // base64
    auth: z.string().max(256).regex(base64Regex, "auth is not base 64 encoded"), // base64
});

export type WebPushInfos = z.infer<typeof WebPushInfosSchema>;

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