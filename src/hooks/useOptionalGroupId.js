import { useLocation } from 'react-router-dom';
import { useShellGroupContext } from './useShellGroupContext.js';

/**
 * Zwraca groupId z URL tylko gdy użytkownik jest w kontekście nawigacji grupowej
 * (nie na landing page `/groups/:groupId`).
 */
export function useOptionalGroupId() {
  const { groupId } = useShellGroupContext();
  return groupId;
}

/**
 * @deprecated Prefer useShellGroupContext for finer control.
 */
export function useRawGroupId() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/groups\/([^/]+)/u);
  return match?.[1] ?? null;
}
