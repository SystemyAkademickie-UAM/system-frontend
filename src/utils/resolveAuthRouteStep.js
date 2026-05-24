/**
 * Auth shell exposes a single route (`/login`); wizard steps use in-page transitions.
 * @param {string} pathname
 * @returns {number | null}
 */
export function resolveAuthRouteStep(pathname) {
  const normalized = pathname.replace(/\/+$/, '');

  if (normalized.endsWith('/login')) {
    return 0;
  }

  return null;
}
