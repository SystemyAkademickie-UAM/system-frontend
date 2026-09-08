/**
 * MyAcademyQuest — Theme Service
 * Obsługa motywów aplikacji: systemowy (domyślny), jasny, ciemny.
 */

export const THEME_MODE = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
};

export const THEME_OPTIONS = [
  { id: THEME_MODE.SYSTEM, label: 'Motyw systemowy', description: 'Dopasowany do ustawień Twojego urządzenia' },
  { id: THEME_MODE.LIGHT, label: 'Motyw jasny', description: 'Jasne tło i wysoki kontrast' },
  { id: THEME_MODE.DARK, label: 'Motyw ciemny', description: 'Ciemna oprawa graficzna' },
];

const STORAGE_KEY = 'maq.theme';

let currentTheme = THEME_MODE.SYSTEM;
let systemThemeMediaQuery = null;

function handleSystemThemeChange(e) {
  if (currentTheme === THEME_MODE.SYSTEM) {
    const isDark = e.matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}

/**
 * Zwraca aktualnie wybrany motyw z localStorage lub domyślny 'system'.
 * @returns {'system' | 'light' | 'dark'}
 */
export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === THEME_MODE.LIGHT || saved === THEME_MODE.DARK || saved === THEME_MODE.SYSTEM) {
      return saved;
    }
  } catch {
    // localStorage niedostępne
  }
  return THEME_MODE.SYSTEM;
}

/**
 * Ustawia i aplikuje motyw w aplikacji.
 * @param {'system' | 'light' | 'dark'} theme
 */
export function applyTheme(theme) {
  currentTheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignoruj błędy zapisu
  }

  if (theme === THEME_MODE.SYSTEM) {
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (!systemThemeMediaQuery) {
        systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);
      }
      const isDark = systemThemeMediaQuery.matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } else {
    if (systemThemeMediaQuery) {
      systemThemeMediaQuery.removeEventListener('change', handleSystemThemeChange);
      systemThemeMediaQuery = null;
    }
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/**
 * Inicjalizuje motyw przy starcie aplikacji.
 */
export function initTheme() {
  const saved = getSavedTheme();
  applyTheme(saved);
}
