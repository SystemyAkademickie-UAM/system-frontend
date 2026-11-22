/**
 * @file decryptProductionLogExport.test.js
 * @description Zestaw testów jednostkowych weryfikujących funkcjonalność decryptProductionLogExport.
 */

// === IMPORTY I ŚRODOWISKO TESTOWE ===
import { describe, expect, it } from 'vitest';

import { decodeBase64ToBytes, encodeBytesToBase64 } from './decryptProductionLogExport.js';

// === SCENARIUSZE TESTOWE (SUITE) ===
describe('decryptProductionLogExport helpers', () => {
  it('round-trips base64 for uncompressed P-256 prefix bytes', () => {
    const bytes = new Uint8Array([0x04, 0x01, 0x02, 0x03]);
    const encoded = encodeBytesToBase64(bytes);
    expect(decodeBase64ToBytes(encoded)).toEqual(bytes);
  });
});
