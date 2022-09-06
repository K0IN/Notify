import { z } from 'zod';
import { WebPushInfos } from '../../webpush/webpushinfos';

export const WebPushInfosSchema = z.object({
    endpoint: z.string().url().max(1024),
    key: z.string().max(512), // base64
    auth: z.string().max(256), // base64
});

export const DeviceSchema = z.object({
    id: z.string().length(32),
    secret: z.string().length(32),
    pushData: WebPushInfosSchema // WebPushInfos
});

export type IDevice = z.infer<typeof DeviceSchema>;
export type IWebPushInfos = z.infer<typeof WebPushInfosSchema> & WebPushInfos;
