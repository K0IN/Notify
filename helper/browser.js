// run this in your browser console
window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])
    .then((keyPair) => window.crypto.subtle.exportKey("jwk", keyPair.privateKey))
    .then((jwk) => console.log(JSON.stringify(jwk)))