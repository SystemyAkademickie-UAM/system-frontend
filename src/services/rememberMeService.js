/**
 * MyAcademyQuest — Remember Me Service
 * Obsługa trzymania sesji użytkownika ("Zapamiętaj mnie").
 * Preferencja zapisywana w ciasteczku `maq_remember_me` oraz localStorage.
 */

const REMEMBER_ME_COOKIE_NAME = 'maq_remember_me';
const REMEMBER_ME_STORAGE_KEY = 'maq_remember_me';

/**
 * Odczytuje preferencję "Zapamiętaj mnie".
 * Domyślnie `true`, chyba że użytkownik jawnie zapisał wartość '0' / 'false'.
 *
 * @returns {boolean}
 */
export function getRememberMe() {
  try {
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith(`${REMEMBER_ME_COOKIE_NAME}=`)) {
        const val = trimmed.slice(REMEMBER_ME_COOKIE_NAME.length + 1);
        return val === '1' || val === 'true';
      }
    }

    const local = localStorage.getItem(REMEMBER_ME_STORAGE_KEY);
    if (local !== null) {
      return local === '1' || local === 'true';
    }
  } catch {
    // Ignoruj błędy dostępu do cookies/localStorage
  }

  return true;
}

/**
 * Zapisuje preferencję "Zapamiętaj mnie" w ciasteczku oraz localStorage.
 *
 * @param {boolean} enabled
 */
export function setRememberMe(enabled) {
  try {
    const val = enabled ? '1' : '0';
    // Ciasteczko na 365 dni
    document.cookie = `${REMEMBER_ME_COOKIE_NAME}=${val};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    localStorage.setItem(REMEMBER_ME_STORAGE_KEY, val);
  } catch {
    // Ignoruj błędy zapisu
  }
}
