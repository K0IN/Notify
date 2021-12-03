export const arraybuffer2base64 = (arraybuffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arraybuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}