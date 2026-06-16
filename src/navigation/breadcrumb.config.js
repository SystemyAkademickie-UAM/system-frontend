import {
  appHelpPath,
  appSettingsPath,
  courseManagementPath,
  groupActivitiesPath,
  groupActivitiesToolsPath,
  groupMainActivitiesPath,
  groupMainBadgesPath,
  groupMainMembersPath,
  groupMainPath,
  groupMainPostsPath,
  groupMainRanksPath,
  groupMembersCodePath,
  groupMembersLogPath,
  groupMembersPath,
  groupPostsPath,
  groupProfileEqPath,
  groupProfileLogPath,
  groupProfilePath,
  groupRankingActivitiesPath,
  groupRankingGroupPath,
  groupRankingPath,
  groupRewardsBadgesPath,
  groupRewardsPath,
  groupSettingsCurrencyPath,
  groupSettingsHealthPath,
  groupSettingsPath,
  groupShopAddPath,
  groupShopItemsPath,
  groupShopPath,
  groupStudentProfilePath,
  groupsListPath,
  organizationsPath,
  statisticsPath,
  userManagementPath,
} from '../routes/pathRegistry.js';

/**
 * Segment breadcrumb poza nazwą grupy (grupa jest zawsze pierwsza, pogrubiona).
 * @typedef {{ label: string, path?: (ctx: { groupId: string }) => string }} BreadcrumbSegmentDef
 */

/** @type {Record<string, BreadcrumbSegmentDef[]>} */
export const BREADCRUMB_BY_PATH = {
  [groupsListPath()]: [{ label: 'Grupy' }],

  [appSettingsPath()]: [
    { label: 'Lista grup', path: () => groupsListPath() },
    { label: 'Ustawienia' },
  ],
  [appHelpPath()]: [{ label: 'Centrum pomocy' }],

  [userManagementPath()]: [{ label: 'Zarządzanie dostępem' }],
  [courseManagementPath()]: [{ label: 'Zarządzanie grupami' }],
  [statisticsPath()]: [{ label: 'Statystyki' }],
  [organizationsPath()]: [{ label: 'Zarządzanie organizacjami' }],
};

/** Ścieżki grupowe — dopasowanie po regex (kolejność ma znaczenie). */
export const GROUP_BREADCRUMB_RULES = [
  {
    pattern: /^\/groups\/[^/]+\/main\/posts\/?$/u,
    segments: [{ label: 'Dane grupy', path: groupMainPath }, { label: 'Wpisy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/main\/members\/?$/u,
    segments: [{ label: 'Dane grupy', path: groupMainPath }, { label: 'Uczestnicy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/main\/activities\/?$/u,
    segments: [{ label: 'Dane grupy', path: groupMainPath }, { label: 'Lista aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/main\/ranks\/?$/u,
    segments: [{ label: 'Dane grupy', path: groupMainPath }, { label: 'Rangi' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/main\/badges\/?$/u,
    segments: [{ label: 'Dane grupy', path: groupMainPath }, { label: 'Odznaki' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/main\/?$/u,
    segments: [{ label: 'Dane grupy' }, { label: 'Strona główna' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/studentprofile\/[^/]+\/eq\/?$/u,
    segments: [{ label: 'Profil' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/studentprofile\/[^/]+\/log\/?$/u,
    segments: [{ label: 'Profil' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/studentprofile\/[^/]+\/?$/u,
    segments: [{ label: 'Profil' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/eq\/?$/u,
    segments: [{ label: 'Profil', path: groupProfilePath }, { label: 'Ekwipunek' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/log\/?$/u,
    segments: [{ label: 'Profil', path: groupProfilePath }, { label: 'Aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/profile\/?$/u,
    segments: [{ label: 'Profil' }],
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
    pattern: /^\/groups\/[^/]+\/posts\/?$/u,
    segments: [{ label: 'Wpisy' }],
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
    pattern: /^\/groups\/[^/]+\/groupsettings\/health\/?$/u,
    segments: [{ label: 'Ustawienia grupy', path: groupSettingsPath }, { label: 'System żyć' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/groupsettings\/?$/u,
    segments: [{ label: 'Ustawienia grupy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/shop\/add\/?$/u,
    segments: [{ label: 'Sklep', path: groupShopPath }, { label: 'Dodaj produkt' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/shop\/?$/u,
    segments: [{ label: 'Sklep' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/ranking\/group\/?$/u,
    segments: [{ label: 'Ranking', path: groupRankingPath }, { label: 'Ranking grupy' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/ranking\/activities\/?$/u,
    segments: [{ label: 'Ranking', path: groupRankingPath }, { label: 'Ranking aktywności' }],
  },
  {
    pattern: /^\/groups\/[^/]+\/ranking\/?$/u,
    segments: [{ label: 'Ranking' }],
  },
];

/** Etykieta sidebar → breadcrumb (gdy brak dopasowania reguły). */
export const SIDEBAR_LABEL_BY_HREF_KEY = {
  GROUP_MAIN: 'Dane grupy',
  GROUP_PROFILE: 'Profil',
  GROUP_SHOP: 'Sklep',
  GROUP_RANKING: 'Ranking',
  GROUP_MEMBERS: 'Użytkownicy',
  GROUP_ACTIVITIES: 'Aktywności',
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
