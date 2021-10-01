type KVType = 'text' | 'json' | 'arrayBuffer' | 'stream';

interface ListResponse {
    keys: Array<{ name: string, expiration: number, metadata: { [key: string]: string } }>;
    list_complete: boolean;
    cursor: string;
}

interface PutOptions {
    expirationTtl?: number;
    metadata?: { [key: string]: string };
}

export interface KV {
    put(key: string, value: string | ReadableStream | ArrayBuffer, options?: PutOptions): Promise<void>;
    get<T>(key: string, options?: { cacheTtl?: number, type?: KVType }): Promise<T | undefined>;
    delete(key: string): Promise<void>;
    getWithMetadata<T>(key: string, options?: { cacheTtl?: number, type?: KVType }): Promise<{ value: T, metadata: string }>;
    list(arg?: { prefix?: string, limit?: number, cursor?: string }): Promise<ListResponse>;
}