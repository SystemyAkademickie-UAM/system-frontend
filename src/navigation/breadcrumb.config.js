import {
  appHelpPath,
  appSettingsPath,
  courseManagementPath,
  groupActivitiesPath,
  groupMembersPath,
  groupRewardsPath,
  groupSettingsPath,
  groupsListPath,
  organizationsPath,
  statisticsPath,
  userManagementPath,
} from '../routes/pathRegistry.js';

/**
 * Segment breadcrumb po ikonie domku i nazwie grupy.
 * @typedef {{ label: string, path?: (ctx: { groupId: string }) => string }} BreadcrumbSegmentDef
 */

/** @type {Record<string, BreadcrumbSegmentDef[]>} */
export const BREADCRUMB_BY_PATH = {
  [groupsListPath()]: [{ label: 'Grupy' }],

  [appSettingsPath()]: [{ label: 'Ustawienia' }],
  [appHelpPath()]: [{ label: 'Centrum pomocy' }],

  [userManagementPath()]: [{ label: 'Zarządzanie dostępem' }],
  [courseManagementPath()]: [{ label: 'Zarządzanie grupami' }],
  [statisticsPath()]: [{ label: 'Statystyki' }],
  [organizationsPath()]: [{ label: 'Zarządzanie organizacjami' }],
};

/** Ścieżki grupowe — dopasowanie po regex (kolejność ma znaczenie). */
export const GROUP_BREADCRUMB_RULES = [
  {
    pattern: /^\/groups\/[^/]+\/feed\/?$/u,
    segments: [{ label: 'Wpisy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/participants\/?$/u,
    segments: [{ label: 'Uczestnicy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/activity-list\/?$/u,
    segments: [{ label: 'Lista aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/ranks\/?$/u,
    segments: [{ label: 'Rangi' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/badges\/?$/u,
    segments: [{ label: 'Odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/home\/posts\/?$/u,
    segments: [{ label: 'Aktywności', path: groupActivitiesPath }, { label: 'Wpisy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/home\/members\/?$/u,
    segments: [{ label: 'Użytkownicy', path: groupMembersPath }],
  },
  {
    pattern: /^\/groups\/[^/]+\/home\/activities\/?$/u,
    segments: [{ label: 'Aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/home\/ranks\/?$/u,
    segments: [{ label: 'Podgląd' }, { label: 'Rangi' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/home\/badges\/?$/u,
    segments: [{ label: 'Podgląd' }, { label: 'Odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/home\/?$/u,
    segments: [{ label: 'Strona główna' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/studentprofile\/[^/]+\/eq\/?$/u,
    segments: [{ label: 'Ekwipunek' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/studentprofile\/[^/]+\/log\/?$/u,
    segments: [{ label: 'Aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/studentprofile\/[^/]+\/?$/u,
    segments: [{ label: 'Zdobyte odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/eq\/?$/u,
    segments: [{ label: 'Ekwipunek' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/log\/?$/u,
    segments: [{ label: 'Aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/?$/u,
    segments: [{ label: 'Zdobyte odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/members\/code\/?$/u,
    segments: [{ label: 'Użytkownicy', path: groupMembersPath }, { label: 'Kody dostępu' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/members\/log\/?$/u,
    segments: [{ label: 'Użytkownicy', path: groupMembersPath }, { label: 'Log aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/members\/?$/u,
    segments: [{ label: 'Użytkownicy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/activities\/tools\/?$/u,
    segments: [{ label: 'Aktywności', path: groupActivitiesPath }, { label: 'Narzędzia' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/activities\/?$/u,
    segments: [{ label: 'Aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/preview\/shop\/?$/u,
    segments: [{ label: 'Podgląd' }, { label: 'Sklep' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/posts\/?$/u,
    segments: [{ label: 'Aktywności', path: groupActivitiesPath }, { label: 'Wpisy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/rewards\/badges\/?$/u,
    segments: [{ label: 'Systemy nagród', path: groupRewardsPath }, { label: 'Odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/rewards\/shopitems\/?$/u,
    segments: [{ label: 'Systemy nagród', path: groupRewardsPath }, { label: 'Przedmioty sklepowe' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/rewards\/?$/u,
    segments: [{ label: 'Systemy nagród' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/groupsettings\/currency\/?$/u,
    segments: [{ label: 'Ustawienia grupy', path: groupSettingsPath }, { label: 'Waluta' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/groupsettings\/lives\/?$/u,
    segments: [{ label: 'Ustawienia grupy', path: groupSettingsPath }, { label: 'System żyć' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/groupsettings\/?$/u,
    segments: [{ label: 'Ustawienia grupy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/shop\/add\/?$/u,
    segments: [{ label: 'Dodaj produkt' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/shop\/?$/u,
    segments: [{ label: 'Sklep' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/ranking\/group\/?$/u,
    segments: [{ label: 'Ranking grupy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/ranking\/activities\/?$/u,
    segments: [{ label: 'Ranking aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/ranking\/?$/u,
    segments: [{ label: 'Ranking' }],
  },
];

/** Etykieta sidebar → breadcrumb (gdy brak dopasowania reguły). */
export const SIDEBAR_LABEL_BY_HREF_KEY = {
  GROUP_MAIN: 'Strona główna',
  GROUP_PROFILE: 'Zdobyte odznaki',
  GROUP_SHOP: 'Sklep',
  GROUP_RANKING: 'Ranking',
  GROUP_MEMBERS: 'Użytkownicy',
  GROUP_ACTIVITIES: 'Aktywności',
  GROUP_STUDENT_FEED: 'Wpisy',
  GROUP_STUDENT_PARTICIPANTS: 'Uczestnicy',
  GROUP_STUDENT_ACTIVITY_LIST: 'Lista aktywności',
  GROUP_STUDENT_RANKS: 'Rangi',
  GROUP_STUDENT_BADGES: 'Odznaki',
  GROUP_POSTS: 'Wpisy',
  GROUP_REWARDS: 'Systemy nagród',
  GROUP_SETTINGS: 'Ustawienia grupy',
};

export function resolveGroupBreadcrumb(pathname, groupId) {
  if (!groupId) {
    return null;
  }

  for (const rule of GROUP_BREADCRUMB_RULES) {
    if (rule.pattern.test(pathname)) {
      return rule.segments.map((segment) => ({
        label: segment.label,
        to: segment.path ? segment.path(groupId) : undefined,
      }));
    }
  }

  return null;
}

export function resolveAppBreadcrumb(pathname, groupId) {
  const staticSegments = BREADCRUMB_BY_PATH[pathname];
  if (staticSegments) {
    return staticSegments.map((segment) => ({ ...segment, to: segment.path?.({ groupId }) }));
  }

  return resolveGroupBreadcrumb(pathname, groupId);
}
