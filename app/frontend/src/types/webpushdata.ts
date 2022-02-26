export type ExtendedSubscription = PushSubscription & { expirationTime?: number };
export type ExtractedWebPushData = {
    endpoint: string,
    key: ArrayBuffer,
    auth: ArrayBuffer,
    expirationTime?: number
}
export type WebPushData = {
    endpoint: string;
    key: string;
    auth: string;
};
