import { z } from 'zod';
export const MessageValidator = z.object({  
    title: z.string().max(1024).min(1),
    message: z.string().max(1024).min(1),
    icon: z.string().url().max(1024).optional(),
    tags: z.array(z.string().min(1).max(256)).optional(),    
});

export type IMessageValidator = z.infer<typeof MessageValidator>;
