/**
 * @file useShellGroupContext.js
 * @description Niestandardowy hook React enkapsulujący logikę dla useShellGroupContext.
 */

// === IMPORTY I ZALEŻNOŚCI HOOKA ===
import { useLocation } from 'react-router-dom';

/**
 * Określa kontekst grupy dla nawigacji (sidebar / superbar).
 * Na stronie landingowej `/groups/:groupId` (bez podścieżki) nie pokazujemy nawigacji grupowej.
 *
 * @returns {{ groupId: string | null, rawGroupId: string | null, isGroupLanding: boolean, showGroupNav: boolean }}
 */

// === DEFINICJA HOOKA I ZARZĄDZANIE STANEM ===
export function useShellGroupContext() {

const { pathname } = useLocation();
  const match = pathname.match(/^\/groups\/([^/]+)/u);
  const rawGroupId = match?.[1] ?? null;
  const isGroupLanding =
    rawGroupId !== null && new RegExp(`^/groups/${rawGroupId}/?$`, 'u').test(pathname);

const showGroupNav = rawGroupId !== null && !isGroupLanding;

// === ZWRACANY STAN I INTERFEJS ===
  return {
    groupId: showGroupNav ? rawGroupId : null,
    rawGroupId,
    isGroupLanding,
    showGroupNav,
  };
}
