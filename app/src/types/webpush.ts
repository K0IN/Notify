import { z } from 'zod';

export const WebPushMessageSchema = z.object({
    title: z.string().max(1024),
    message: z.string().max(1024),
    icon: z.string().url().max(1024).optional(),
    tags: z.array(z.string().max(1024)).optional(),
});

export type IWebPush = z.infer<typeof WebPushMessageSchema>;