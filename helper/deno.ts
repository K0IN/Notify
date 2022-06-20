// deno key generator script
// run 
// > deno run installer.ts
// to generate a new server key
// see doc/install.md for more info

const key = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
const serverKey = await window.crypto.subtle.exportKey("jwk", key.privateKey);
const serverKeyString = JSON.stringify(serverKey, null, 0);
console.log(serverKeyString);