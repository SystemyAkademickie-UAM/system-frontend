/**
 * Browser ID storage stub — X-Browser-ID has been removed from authentication.
 */
export {
  getOrCreateBrowserId,
  getBrowserIdForAuth,
  resetStoredBrowserId,
  pinBrowserIdForSamlFlow,
  clearPendingSamlBrowserId,
  hasPendingSamlBrowserId,
} from '../../../../auth/browserIdStorage.js';
