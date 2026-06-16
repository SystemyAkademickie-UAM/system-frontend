import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useOptionalGroupId } from './useOptionalGroupId.js';
import { useGroupDetails } from '../pages/content/group-shared/useGroupDetails.js';
import { resolveAppBreadcrumb } from '../navigation/breadcrumb.config.js';

/**
 * Buduje klikalną ścieżkę nawigacji dla SuperBar.
 */
export function useAppBreadcrumb() {
  const { pathname } = useLocation();
  const groupId = useOptionalGroupId();
  const { group } = useGroupDetails(groupId);

  return useMemo(() => {
    const groupName = group?.name?.trim() || group?.storyName?.trim() || (groupId ? `Grupa ${groupId}` : null);
    const tailSegments = resolveAppBreadcrumb(pathname, groupId) ?? [];

    if (groupId && groupName) {
      return {
        groupName,
        groupPath: `/groups/${groupId}/main`,
        segments: tailSegments,
      };
    }

    if (tailSegments.length > 0) {
      return {
        groupName: null,
        groupPath: null,
        segments: tailSegments,
      };
    }

    return null;
  }, [pathname, groupId, group?.name, group?.storyName]);
}
