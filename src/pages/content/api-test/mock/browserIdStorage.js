import { BROWSER_ID_LOCAL_STORAGE_KEY } from './mockConstants.js';

/**
 * Returns a persisted UUID for `X-Browser-ID`, creating and storing one when missing.
 * @returns {string}
 */
export function getOrCreateBrowserId() {
  try {
    const existing = globalThis.localStorage?.getItem(BROWSER_ID_LOCAL_STORAGE_KEY);
    if (typeof existing === 'string' && existing.trim().length > 0) {
      return existing.trim();
    }
  } catch {
    // ignore private mode / disabled storage
  }
  const id = globalThis.crypto.randomUUID();
  try {
    globalThis.localStorage?.setItem(BROWSER_ID_LOCAL_STORAGE_KEY, id);
  } catch {
    // ignore
  }
  return id;
}

/**
 * Replaces stored browser id (invalidates prior auth token binding for this install).
 * @returns {string}
 */
export function resetStoredBrowserId() {
  const id = globalThis.crypto.randomUUID();
  try {
    globalThis.localStorage?.setItem(BROWSER_ID_LOCAL_STORAGE_KEY, id);
  } catch {
    // ignore
  }
  return id;
}
