import { useAppRole } from '../../context/AppRoleContext.jsx';
import { GROUP_MAIN_EMPTY_LINKS, resolveGroupMainEmptyLinkForRole } from '../../utils/group-main/emptyStateLinks.js';

/**
 * @param {'ranks' | 'badges' | 'activities'} key
 * @param {string} groupId
 */
export function useGroupMainEmptyLink(key, groupId) {
  const { role } = useAppRole();
  const linkConfig = GROUP_MAIN_EMPTY_LINKS[key];
  return resolveGroupMainEmptyLinkForRole(role, linkConfig, groupId);
}
