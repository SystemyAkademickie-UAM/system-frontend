import {
  BROWSER_ID_LOCAL_STORAGE_KEY,
  BROWSER_ID_LOCAL_STORAGE_KEY_LEGACY,
  BROWSER_ID_SAML_PENDING_SESSION_KEY,
  BROWSER_ID_UUID_REGEX,
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

function readPendingSamlBrowserId() {
  try {
    const raw = globalThis.sessionStorage?.getItem(BROWSER_ID_SAML_PENDING_SESSION_KEY);
    if (typeof raw !== 'string') {
      return null;
    }
    const trimmed = raw.trim();
    if (BROWSER_ID_UUID_REGEX.test(trimmed)) {
      return trimmed;
    }
  } catch {
    // ignore
  }
  return null;
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
 * Browser id for authenticated API calls — prefers SAML RelayState pin from sessionStorage.
 * @returns {string}
 */
export function getBrowserIdForAuth() {
  const pendingSamlBrowserId = readPendingSamlBrowserId();
  if (pendingSamlBrowserId !== null) {
    return pendingSamlBrowserId;
  }
  return getOrCreateBrowserId();
}

/**
 * Pin browser id before SAML redirect so ACS token binding matches subsequent `X-Browser-ID`.
 * @param {string} browserId
 */
export function pinBrowserIdForSamlFlow(browserId) {
  const trimmed = typeof browserId === 'string' ? browserId.trim() : '';
  if (!BROWSER_ID_UUID_REGEX.test(trimmed)) {
    return;
  }
  writeStoredBrowserId(trimmed);
  try {
    globalThis.sessionStorage?.setItem(BROWSER_ID_SAML_PENDING_SESSION_KEY, trimmed);
  } catch {
    // ignore
  }
}

/** @returns {boolean} True while returning from SAML redirect (browser id pinned in sessionStorage). */
export function hasPendingSamlBrowserId() {
  return readPendingSamlBrowserId() !== null;
}

/** Clears SAML pending pin after session is established. */
export function clearPendingSamlBrowserId() {
  try {
    globalThis.sessionStorage?.removeItem(BROWSER_ID_SAML_PENDING_SESSION_KEY);
  } catch {
    // ignore
  }
}

/**
 * Replaces stored browser id (invalidates prior auth token binding for this install).
 * @returns {string}
 */
export function resetStoredBrowserId() {
  clearPendingSamlBrowserId();
  const id = globalThis.crypto.randomUUID();
  writeStoredBrowserId(id);
  return id;
}
