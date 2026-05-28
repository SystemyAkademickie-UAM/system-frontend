import { useLocation } from 'react-router-dom';

/**
 * Określa kontekst grupy dla nawigacji (sidebar / superbar).
 * Na stronie landingowej `/groups/:groupId` (bez podścieżki) nie pokazujemy nawigacji grupowej.
 *
 * @returns {{ groupId: string | null, rawGroupId: string | null, isGroupLanding: boolean, showGroupNav: boolean }}
 */
export function useShellGroupContext() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/groups\/([^/]+)/u);
  const rawGroupId = match?.[1] ?? null;
  const isGroupLanding =
    rawGroupId !== null && new RegExp(`^/groups/${rawGroupId}/?$`, 'u').test(pathname);
  const showGroupNav = rawGroupId !== null && !isGroupLanding;

  return {
    groupId: showGroupNav ? rawGroupId : null,
    rawGroupId,
    isGroupLanding,
    showGroupNav,
  };
}
