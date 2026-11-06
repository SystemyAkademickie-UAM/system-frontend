/**
 * @file useGroupMainEmptyLink.js
 * @description Niestandardowy hook React enkapsulujący logikę dla useGroupMainEmptyLink.
 */

// === IMPORTY I ZALEŻNOŚCI HOOKA ===
import { useAppRole } from '../../context/AppRoleContext.jsx';

import { GROUP_MAIN_EMPTY_LINKS, resolveGroupMainEmptyLinkForRole } from '../../utils/group-main/emptyStateLinks.js';

/**
 * @param {'ranks' | 'badges' | 'activities'} key
 * @param {string} groupId
 */

// === DEFINICJA HOOKA I ZARZĄDZANIE STANEM ===
export function useGroupMainEmptyLink(key, groupId) {

const { role } = useAppRole();
  const linkConfig = GROUP_MAIN_EMPTY_LINKS[key];
  return resolveGroupMainEmptyLinkForRole(role, linkConfig, groupId);
}
