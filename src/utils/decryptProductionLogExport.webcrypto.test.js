import { describe, expect, it } from 'vitest';

import {
  decodeBase64ToBytes,
  decryptProductionLogExport,
  encodeBytesToBase64,
  generateLogExportKeyPair,
} from './decryptProductionLogExport.js';

async function encryptLikeServer(plaintext, clientPublicKeyBase64) {
  const clientRaw = decodeBase64ToBytes(clientPublicKeyBase64);
  const clientPublic = await crypto.subtle.importKey(
    'raw',
    clientRaw,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );
  const serverPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  );
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: clientPublic },
    serverPair.privateKey,
    256,
  );
  const aesKeyBytes = await crypto.subtle.digest('SHA-256', sharedBits);
  const aesKey = await crypto.subtle.importKey('raw', aesKeyBytes, { name: 'AES-GCM' }, false, [
    'encrypt',
  ]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aesKey, new TextEncoder().encode(plaintext)),
  );
  const ciphertext = encrypted.slice(0, encrypted.length - 16);
  const authTag = encrypted.slice(encrypted.length - 16);
  const serverRaw = new Uint8Array(await crypto.subtle.exportKey('raw', serverPair.publicKey));
  return {
    serverPublicKey: encodeBytesToBase64(serverRaw),
    iv: encodeBytesToBase64(iv),
    ciphertext: encodeBytesToBase64(ciphertext),
    authTag: encodeBytesToBase64(authTag),
  };
}

describe('decryptProductionLogExport (Web Crypto)', () => {
  it('decrypts a payload produced with the same ECDH+AES-GCM contract', async () => {
    const keyPair = await generateLogExportKeyPair();
    const exportBody = await encryptLikeServer('api down at 19:00\n', keyPair.clientPublicKey);
    expect(exportBody.ciphertext).not.toContain('api down');
    const plain = await decryptProductionLogExport(exportBody, keyPair.privateKey);
    expect(plain).toBe('api down at 19:00\n');
  });
});
