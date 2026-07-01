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
  templatesMyPath,
  templatesPath,
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
  [appHelpPath()]: [
    { label: 'Ustawienia', path: () => appSettingsPath() },
    { label: 'Centrum pomocy' },
  ],

  [userManagementPath()]: [{ label: 'Zarządzanie dostępem' }],
  [courseManagementPath()]: [{ label: 'Zarządzanie grupami' }],
  [statisticsPath()]: [{ label: 'Statystyki' }],
  [organizationsPath()]: [{ label: 'Zarządzanie organizacjami' }],

  [templatesPath()]: [{ label: 'Szablony' }, { label: 'Galeria szablonów' }],
  [templatesMyPath()]: [{ label: 'Szablony' }, { label: 'Moje szablony' }],
};

/** Ścieżki grupowe — dopasowanie po regex (kolejność ma znaczenie). */
export const GROUP_BREADCRUMB_RULES = [
  {
    pattern: /^\/groups\/[^/]+\/posts\/?$/u,
    segments: [{ label: 'Wpisy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/users\/?$/u,
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
    pattern: /^\/groups\/[^/]+\/home\/?$/u,
    segments: [],
  },
  {
    pattern: /^\/groups\/[^/]+\/student-profile\/[^/]+\/?$/u,
    segments: [{ label: 'Profil uczestnika' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/eq\/?$/u,
    segments: [{ label: 'Ekwipunek' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/activity\/?$/u,
    segments: [{ label: 'Dziennik aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/?$/u,
    segments: [{ label: 'Zdobyte odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/members\/codes\/?$/u,
    segments: [{ label: 'Użytkownicy', path: groupMembersPath }, { label: 'Kody dostępu' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/members\/log\/?$/u,
    segments: [{ label: 'Użytkownicy', path: groupMembersPath }, { label: 'Dziennik aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/members\/?$/u,
    segments: [{ label: 'Użytkownicy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/activities\/tools\/?$/u,
    segments: [{ label: 'Aktywności', path: groupActivitiesPath }, { label: 'Raporty' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/activities\/?$/u,
    segments: [{ label: 'Aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/activities\/posts\/?$/u,
    segments: [{ label: 'Aktywności', path: groupActivitiesPath }, { label: 'Wpisy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/rewards\/ranks\/?$/u,
    segments: [{ label: 'Systemy nagród', path: groupRewardsPath }, { label: 'Rangi' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/rewards\/shop-items\/?$/u,
    segments: [{ label: 'Systemy nagród', path: groupRewardsPath }, { label: 'Sklep' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/rewards\/?$/u,
    segments: [{ label: 'Systemy nagród', path: groupRewardsPath }, { label: 'Odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/group-settings\/currency\/?$/u,
    segments: [{ label: 'Ustawienia grupy', path: groupSettingsPath }, { label: 'Waluta' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/group-settings\/lives\/?$/u,
    segments: [{ label: 'Ustawienia grupy', path: groupSettingsPath }, { label: 'System żyć' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/group-settings\/?$/u,
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
