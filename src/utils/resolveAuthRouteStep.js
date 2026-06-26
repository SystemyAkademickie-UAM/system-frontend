/**
 * Auth shell route order for slide transitions (`/welcome` → `/login`).
 * @param {string} pathname
 * @returns {number | null}
 */
export function resolveAuthRouteStep(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/welcome') {
    return -1;
  }

  if (normalized === '/login') {
    return 0;
  }

  if (normalized === '/login/magic') {
    return 1;
  }

  return null;
}
