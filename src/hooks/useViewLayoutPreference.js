import { useCallback, useState } from 'react';
import { VIEW_LAYOUT, getNextViewLayout } from '../components/ui/ViewLayoutToggle/viewLayoutStates.js';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookieValue(cookieName) {
  const entry = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!entry) {
    return null;
  }

  return decodeURIComponent(entry.slice(cookieName.length + 1));
}

/**
 * Preferencja widoku (tabela / kafelki) zapisywana w cookie.
 *
 * @param {string} cookieKey
 * @param {'table' | 'tiles'} [defaultLayout]
 */
export function useViewLayoutPreference(cookieKey, defaultLayout = VIEW_LAYOUT.table) {
  const [layout, setLayout] = useState(() => {
    const stored = readCookieValue(cookieKey);
    return stored === VIEW_LAYOUT.tiles || stored === VIEW_LAYOUT.table ? stored : defaultLayout;
  });

  const setLayoutPreference = useCallback((nextLayout) => {
    const resolved = nextLayout === VIEW_LAYOUT.tiles ? VIEW_LAYOUT.tiles : VIEW_LAYOUT.table;
    document.cookie = `${cookieKey}=${encodeURIComponent(resolved)};path=/;max-age=${COOKIE_MAX_AGE_SECONDS}`;
    setLayout(resolved);
  }, [cookieKey]);

  const toggleLayout = useCallback(() => {
    setLayoutPreference(getNextViewLayout(layout));
  }, [layout, setLayoutPreference]);

  return {
    layout,
    setLayoutPreference,
    toggleLayout,
    isTileView: layout === VIEW_LAYOUT.tiles,
  };
}
