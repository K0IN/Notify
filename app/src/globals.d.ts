import type { KV } from './types/kv';

declare global {
    // databases
    const NOTIFY_USERS: KV;
    // env    
    const SUB: string | undefined; // this is used for the subscription administrator email
    // secrets
    const VAPID_SERVER_KEY: string | undefined;
    const SERVERPWD: string | undefined; // used for pushes
    const AUTHPWD: string | undefined; // used for authentication
    // server 
    const CORS_ORIGIN: string | undefined;
    const SERVE_FRONTEND: string | undefined;
}