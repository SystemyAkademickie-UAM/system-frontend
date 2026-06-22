import { useLocation } from 'react-router-dom';

/**
 * @param {string} pathname
 * @param {string} path
 * @param {boolean} [matchEnd]
 */
export function isPathActive(pathname, path, matchEnd = false) {
  if (!path) {
    return false;
  }
  if (matchEnd) {
    return pathname === path;
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * @param {string} pathname
 * @param {{ to?: string, matchEnd?: boolean, children?: { to?: string, matchEnd?: boolean }[] }[]} items
 */
export function isAnyNavItemActive(pathname, items) {
  return items.some((item) => {
    if (item.to && isPathActive(pathname, item.to, item.matchEnd)) {
      return true;
    }
    if (item.children?.length) {
      return isAnyNavItemActive(pathname, item.children);
    }
    return false;
  });
}

/**
 * @param {{ to?: string }[]} children
 * @returns {string | null}
 */
export function getFirstNavChildPath(children = []) {
  return children.find((child) => typeof child.to === 'string' && child.to.length > 0)?.to ?? null;
}

export function useNavPathname() {
  return useLocation().pathname;
}
