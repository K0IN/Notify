import { z } from "zod";
import { WebPushInfosSchema } from '../../webpush/webpushinfos.ts';

export const DeviceSchema = z.object({
    id: z.string().length(32),
    secret: z.string().length(32),
    pushData: WebPushInfosSchema // WebPushInfos
});

export type IDevice = z.infer<typeof DeviceSchema>;


