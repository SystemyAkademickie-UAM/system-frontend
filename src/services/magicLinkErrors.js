/** @typedef {{ message?: string, error?: string }} MagicLinkApiError */

const MAGIC_LINK_ERROR_MESSAGES = {
  MAGIC_LINK_INVALID: 'Link logowania wygasł lub jest nieprawidłowy.',
  MAGIC_LINK_ACCOUNT_NOT_REGISTERED: 'Konto nie jest zarejestrowane w wybranej uczelni.',
  MAGIC_LINK_COOLDOWN: 'Odczekaj chwilę przed ponownym wysłaniem linku.',
  MAGIC_LINK_NOT_CONFIGURED: 'Logowanie przez e-mail nie jest skonfigurowane.',
  MAGIC_LINK_SMTP_NOT_CONFIGURED: 'Serwer poczty nie jest skonfigurowany.',
};

/**
 * Maps backend magic-link error codes to user-facing Polish messages.
 * @param {unknown} data
 * @param {string} fallback
 * @returns {string}
 */
export function getMagicLinkErrorMessage(data, fallback) {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const error = /** @type {MagicLinkApiError} */ (data);
  const code = error.error;
  if (code && typeof code === 'string' && MAGIC_LINK_ERROR_MESSAGES[code]) {
    return MAGIC_LINK_ERROR_MESSAGES[code];
  }
  if (typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }
  return fallback;
}
