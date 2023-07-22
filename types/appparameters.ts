import { z } from 'zod';
import { validateVapidKey } from '../util/commandvalidator.ts';

export interface ServerParams {
    port: number,
    vapidKey: string, // base64 encoded private key
    sub: string,
    cors: boolean,
    frontend?: string, // path to frontend build directory or undefined = no frontend
    sendkey?: string, // key to send notifications
    loginkey?: string, // key to login into the ui
}


export const AppParametersValidator = z.object({  
    port: z.number().int().min(1).max(65535).default(8787),
    vapidKey: z.string().refine(validateVapidKey),
    sub: z.string().startsWith('mailto:'),
    cors: z.boolean().optional().default(false),
    frontend: z.string().optional().default('static-site'),
    sendkey: z.string().optional(),
    loginkey: z.string().optional(),
});

export type AppParameters = z.infer<typeof AppParametersValidator>;
