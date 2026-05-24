import {
  BROWSER_ID_LOCAL_STORAGE_KEY,
  BROWSER_ID_LOCAL_STORAGE_KEY_LEGACY,
} from '../constants/browserId.constants.js';

function readStoredBrowserId() {
  try {
    const current = globalThis.localStorage?.getItem(BROWSER_ID_LOCAL_STORAGE_KEY);
    if (typeof current === 'string' && current.trim().length > 0) {
      return current.trim();
    }
    const legacy = globalThis.localStorage?.getItem(BROWSER_ID_LOCAL_STORAGE_KEY_LEGACY);
    if (typeof legacy === 'string' && legacy.trim().length > 0) {
      const migrated = legacy.trim();
      globalThis.localStorage?.setItem(BROWSER_ID_LOCAL_STORAGE_KEY, migrated);
      globalThis.localStorage?.removeItem(BROWSER_ID_LOCAL_STORAGE_KEY_LEGACY);
      return migrated;
    }
  } catch {
    // ignore private mode / disabled storage
  }
  return null;
}

function writeStoredBrowserId(id) {
  try {
    globalThis.localStorage?.setItem(BROWSER_ID_LOCAL_STORAGE_KEY, id);
    globalThis.localStorage?.removeItem(BROWSER_ID_LOCAL_STORAGE_KEY_LEGACY);
  } catch {
    // ignore
  }
}

/**
 * Returns a persisted UUID for `X-Browser-ID`, creating and storing one when missing.
 * @returns {string}
 */
export function getOrCreateBrowserId() {
  const existing = readStoredBrowserId();
  if (existing !== null) {
    return existing;
  }
  const id = globalThis.crypto.randomUUID();
  writeStoredBrowserId(id);
  return id;
}

/**
 * Replaces stored browser id (invalidates prior auth token binding for this install).
 * @returns {string}
 */
export function resetStoredBrowserId() {
  const id = globalThis.crypto.randomUUID();
  writeStoredBrowserId(id);
  return id;
}
