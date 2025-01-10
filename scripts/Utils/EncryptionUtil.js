var Encryption = {};

Encryption.encrypt = async function(str, key) {
    // Convert args to byte arrays
    const keyBytes = new TextEncoder().encode(key);
    const textBytes = new TextEncoder().encode(str);

    const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, "AES-CBC", false, ["encrypt"]);
    const encryptedBytes = await crypto.subtle.encrypt({ name: "AES-CBC", iv: new Uint8Array(16) }, cryptoKey, textBytes);
    return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedBytes)));
}

Encryption.decrypt = async function(encryptedBase64, key) {
    // Convert args to byte arrays
    const keyBytes = new TextEncoder().encode(key);
    const encryptedBytes = new Uint8Array(atob(encryptedBase64).split("").map(c => c.charCodeAt(0)));
  
    const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, "AES-CBC", false, ["decrypt"]);
    const decryptedBytes = await crypto.subtle.decrypt({ name: "AES-CBC", iv: new Uint8Array(16) }, cryptoKey, encryptedBytes);
    return new TextDecoder().decode(decryptedBytes);
  }