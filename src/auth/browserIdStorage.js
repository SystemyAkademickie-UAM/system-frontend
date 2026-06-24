/**
 * Browser ID storage stub — X-Browser-ID has been removed from authentication.
 * These stubs maintain backwards compatibility for legacy code paths.
 */

export function getOrCreateBrowserId() {
  return '';
}

export function getBrowserIdForAuth() {
  return '';
}

export function resetStoredBrowserId() {
  return '';
}

export function pinBrowserIdForSamlFlow() {
  // no-op
}

export function clearPendingSamlBrowserId() {
  // no-op
}

export function hasPendingSamlBrowserId() {
  return false;
}
