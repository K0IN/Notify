export function validateSecret(secret?: string): boolean {
    if (!secret) {
        return false; // missing data
    }
    const deviceSecret = String(secret);
    return deviceSecret.length === 32 && Boolean(/^[a-f0-9]{32}$/.exec(deviceSecret)); // validate secret
}