export type headers = {
    get: (name: string) => string | undefined;
};

export function extractAuthHeader(headers?: headers): string | undefined {
    if (!headers) {
        return undefined;
    }
    const header = headers.get('authorization');
    if (!header) {
        return undefined;
    }
    const tokenMatch = /^[B|b]earer (.*)$/.exec(header);
    if (!tokenMatch || !tokenMatch[1]) {
        return undefined;
    }
    return String(tokenMatch[1]);
}