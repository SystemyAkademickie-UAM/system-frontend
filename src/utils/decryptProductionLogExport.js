import { BASE64_ENCODE_CHUNK_SIZE } from '../constants/productionLogs.constants.js';

/**
 * Decode base64 to bytes without spreading huge arrays onto the stack.
 * @param {string} value
 * @returns {Uint8Array}
 */
export function decodeBase64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

/**
 * Encode bytes as base64.
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function encodeBytesToBase64(bytes) {
  const chunkSize = BASE64_ENCODE_CHUNK_SIZE;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

/**
 * ECDH P-256 key pair for log export. Public key is uncompressed SEC1, base64.
 * @returns {Promise<{ privateKey: CryptoKey, clientPublicKey: string }>}
 */
export async function generateLogExportKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  );
  const rawPublic = new Uint8Array(await crypto.subtle.exportKey('raw', keyPair.publicKey));
  return {
    privateKey: keyPair.privateKey,
    clientPublicKey: encodeBytesToBase64(rawPublic),
  };
}

/**
 * Decrypts an admin log export. Ciphertext is AES-256-GCM; key is SHA-256(ECDH secret).
 * @param {{ serverPublicKey: string, iv: string, ciphertext: string, authTag: string }} exportBody
 * @param {CryptoKey} privateKey
 * @returns {Promise<string>}
 */
export async function decryptProductionLogExport(exportBody, privateKey) {
  const serverRaw = decodeBase64ToBytes(exportBody.serverPublicKey);
  const serverKey = await crypto.subtle.importKey(
    'raw',
    serverRaw,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: serverKey },
    privateKey,
    256,
  );
  const aesKeyBytes = await crypto.subtle.digest('SHA-256', sharedBits);
  const aesKey = await crypto.subtle.importKey('raw', aesKeyBytes, { name: 'AES-GCM' }, false, [
    'decrypt',
  ]);
  const iv = decodeBase64ToBytes(exportBody.iv);
  const ciphertext = decodeBase64ToBytes(exportBody.ciphertext);
  const authTag = decodeBase64ToBytes(exportBody.authTag);
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    aesKey,
    combined,
  );
  return new TextDecoder().decode(plain);
}
