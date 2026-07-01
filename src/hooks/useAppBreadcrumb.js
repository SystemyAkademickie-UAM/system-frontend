import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useOptionalGroupId } from './useOptionalGroupId.js';
import { useGroupDetails } from '../hooks/groups/useGroupDetails.js';
import { resolveAppBreadcrumb } from '../navigation/breadcrumb.config.js';
import { appHelpPath, appSettingsPath, groupMainPath, groupsListPath } from '../routes/pathRegistry.js';

/**
 * Buduje klikalną ścieżkę nawigacji dla SuperBar.
 */
export function useAppBreadcrumb() {
  const { pathname } = useLocation();
  const groupId = useOptionalGroupId();
  const { group } = useGroupDetails(groupId);

  return useMemo(() => {
    const homePath = groupsListPath();
    const tailSegments = resolveAppBreadcrumb(pathname, groupId) ?? [];
    const groupName = group?.name?.trim() || group?.storyName?.trim() || (groupId ? `Grupa ${groupId}` : null);

    let back = null;
    if (pathname === appSettingsPath()) {
      back = {
        ariaLabel: 'Wróć do poprzedniej strony',
        fallbackTo: homePath,
      };
    } else if (pathname === appHelpPath()) {
      back = {
        ariaLabel: 'Wróć do ustawień',
        fallbackTo: appSettingsPath(),
      };
    }

    if (pathname === homePath || pathname === `${homePath}/`) {
      return {
        homePath,
        groupName: null,
        groupPath: null,
        segments: [{ label: 'Grupy' }],
        back,
      };
    }

    if (groupId && groupName) {
      return {
        homePath,
        groupName,
        groupPath: groupMainPath(groupId),
        segments: tailSegments,
        back,
      };
    }

    if (tailSegments.length > 0) {
      return {
        homePath,
        groupName: null,
        groupPath: null,
        segments: tailSegments,
        back,
      };
    }

    return {
      homePath,
      groupName: null,
      groupPath: null,
      segments: [],
      back,
    };
  }, [pathname, groupId, group?.name, group?.storyName]);
}
