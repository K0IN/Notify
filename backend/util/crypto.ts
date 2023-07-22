export function compareStringSafe(s1: string, s2: string): boolean {
    if (s1.length !== s2.length) {
        return false;
    }
    let result = 0;
    for (let i = 0; i < s1.length; i++) {
        result |= s1.charCodeAt(i) ^ s2.charCodeAt(i);
    }
    return result === 0;
}