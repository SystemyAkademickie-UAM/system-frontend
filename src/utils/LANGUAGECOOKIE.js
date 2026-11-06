/**
 * @file LANGUAGECOOKIE.js
 * @description Funkcje pomocnicze i narzędziowe modułu LANGUAGECOOKIE.
 */

// === IMPORTY I STAŁE MODUŁU ===
export function READLANGUAGECOOKIE() {
  const cookies = Object.fromEntries(
    document.cookie.split(';').map((entry) => {
      const [key, value] = entry.split('=');
      return [key.trim(), value];

    }),
  );

  if (cookies.CURRENTLANGUAGE) {
    return cookies.CURRENTLANGUAGE;
  } else {
    return 'polish';
  }
}
