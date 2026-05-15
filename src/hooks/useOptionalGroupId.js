import { useLocation } from 'react-router-dom';

/**
 * Zwraca groupId z URL, gdy użytkownik jest pod ścieżką /groups/:groupId/...
 * Używane przez Sidebar (poza zagnieżdżonym Outletem z :groupId).
 */
export function useOptionalGroupId() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/groups\/([^/]+)/u);
  return match?.[1] ?? null;
}
