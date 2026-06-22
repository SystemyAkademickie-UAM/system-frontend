/**
 * Tablica routingu studenta — mapowanie nawigacji bocznej na ścieżki URL.
 * Synchronizuj z `studentView` w `shellTemplates.config.js`, `createAppRouter.jsx` i `routeTable.js`.
 *
 * @typedef {Object} StudentRouteDefinition
 * @property {string} id — identyfikator trasy (`routeTable.js`)
 * @property {string} navLabel — etykieta w sidebarze (lub „—” gdy brak pozycji)
 * @property {string} hrefKey — klucz z `HREF_BUILDERS`
 * @property {string} pathPattern — wzorzec URL (React Router)
 * @property {string} breadcrumb — oczekiwany breadcrumb po nazwie grupy
 * @property {string} [notes] — uwagi
 */

import {
  appSettingsPath,
  groupMainPath,
  groupProfileEqPath,
  groupProfileLogPath,
  groupProfilePath,
  groupRankingActivitiesPath,
  groupRankingGroupPath,
  groupRankingPath,
  groupShopPath,
  groupStudentActivityListPath,
  groupStudentBadgesPath,
  groupStudentFeedPath,
  groupStudentParticipantsPath,
  groupStudentProfilePath,
  groupStudentRanksPath,
  groupsListPath,
} from './pathRegistry.js';

/** @type {StudentRouteDefinition[]} */
export const STUDENT_ROUTE_TABLE = [
  {
    id: 'groups.list',
    navLabel: 'Twoje grupy',
    hrefKey: 'GROUPS_LIST',
    pathPattern: groupsListPath(),
    breadcrumb: 'Grupy',
  },
  {
    id: 'group.main.home',
    navLabel: 'Strona Główna',
    hrefKey: 'GROUP_MAIN',
    pathPattern: '/groups/:groupId/home',
    breadcrumb: 'Strona główna',
  },
  {
    id: 'group.student.feed',
    navLabel: 'Wpisy',
    hrefKey: 'GROUP_STUDENT_FEED',
    pathPattern: '/groups/:groupId/feed',
    breadcrumb: 'Wpisy',
    notes: '/posts zajęte przez panel prowadzącego',
  },
  {
    id: 'group.profile.home',
    navLabel: 'Zdobyte odznaki',
    hrefKey: 'GROUP_PROFILE',
    pathPattern: '/groups/:groupId/profile',
    breadcrumb: 'Zdobyte odznaki',
    notes: 'Pierwszy element drzewka „Profil”',
  },
  {
    id: 'group.profile.log',
    navLabel: 'Aktywności',
    hrefKey: 'GROUP_PROFILE_LOG',
    pathPattern: '/groups/:groupId/profile/log',
    breadcrumb: 'Aktywności',
    notes: 'Podstrona profilu',
  },
  {
    id: 'group.profile.eq',
    navLabel: 'Ekwipunek',
    hrefKey: 'GROUP_PROFILE_EQ',
    pathPattern: '/groups/:groupId/profile/eq',
    breadcrumb: 'Ekwipunek',
    notes: 'Podstrona profilu',
  },
  {
    id: 'group.student.activityList',
    navLabel: 'Lista aktywności',
    hrefKey: 'GROUP_STUDENT_ACTIVITY_LIST',
    pathPattern: '/groups/:groupId/activity-list',
    breadcrumb: 'Lista aktywności',
    notes: '/activities zajęte przez panel prowadzącego',
  },
  {
    id: 'group.student.badges',
    navLabel: 'Odznaki',
    hrefKey: 'GROUP_STUDENT_BADGES',
    pathPattern: '/groups/:groupId/badges',
    breadcrumb: 'Odznaki',
    notes: 'Odróżnienie od „Zdobyte odznaki” w profilu',
  },
  {
    id: 'group.student.ranks',
    navLabel: 'Rangi',
    hrefKey: 'GROUP_STUDENT_RANKS',
    pathPattern: '/groups/:groupId/ranks',
    breadcrumb: 'Rangi',
  },
  {
    id: 'group.shop.home',
    navLabel: 'Sklep',
    hrefKey: 'GROUP_SHOP',
    pathPattern: '/groups/:groupId/shop',
    breadcrumb: 'Sklep',
  },
  {
    id: 'group.student.participants',
    navLabel: 'Uczestnicy',
    hrefKey: 'GROUP_STUDENT_PARTICIPANTS',
    pathPattern: '/groups/:groupId/participants',
    breadcrumb: 'Uczestnicy',
    notes: '/members zajęte przez panel prowadzącego',
  },
  {
    id: 'group.ranking.home',
    navLabel: 'Ranking',
    hrefKey: 'GROUP_RANKING',
    pathPattern: '/groups/:groupId/ranking',
    breadcrumb: 'Ranking',
    notes: 'Pozycja „unavailable” z nawigacją tymczasową',
  },
  {
    id: 'group.ranking.group',
    navLabel: '—',
    hrefKey: 'GROUP_RANKING_GROUP',
    pathPattern: '/groups/:groupId/ranking/group',
    breadcrumb: 'Ranking grupy',
    notes: 'Podstrona rankingu (brak osobnej pozycji w sidebarze)',
  },
  {
    id: 'group.ranking.activities',
    navLabel: '—',
    hrefKey: 'GROUP_RANKING_ACTIVITIES',
    pathPattern: '/groups/:groupId/ranking/activities',
    breadcrumb: 'Ranking aktywności',
    notes: 'Podstrona rankingu (brak osobnej pozycji w sidebarze)',
  },
  {
    id: 'app.settings',
    navLabel: 'Ustawienia',
    hrefKey: 'APP_SETTINGS',
    pathPattern: appSettingsPath(),
    breadcrumb: 'Ustawienia',
    notes: 'Stopka sidebaru',
  },
  {
    id: 'group.studentProfile.home',
    navLabel: '—',
    hrefKey: 'GROUP_STUDENT_PROFILE',
    pathPattern: '/groups/:groupId/studentprofile/:studentId',
    breadcrumb: 'Zdobyte odznaki',
    notes: 'Profil innego uczestnika — link z tabeli uczestników',
  },
  {
    id: 'group.studentProfile.log',
    navLabel: '—',
    hrefKey: 'GROUP_STUDENT_PROFILE',
    pathPattern: '/groups/:groupId/studentprofile/:studentId/log',
    breadcrumb: 'Aktywności',
    notes: 'Profil innego uczestnika',
  },
  {
    id: 'group.studentProfile.eq',
    navLabel: '—',
    hrefKey: 'GROUP_STUDENT_PROFILE',
    pathPattern: '/groups/:groupId/studentprofile/:studentId/eq',
    breadcrumb: 'Ekwipunek',
    notes: 'Profil innego uczestnika',
  },
  {
    id: 'group.root',
    navLabel: '—',
    hrefKey: 'GROUP_ROOT',
    pathPattern: '/groups/:groupId',
    breadcrumb: '—',
    notes: 'Landing dołączenia do grupy (bez nawigacji grupowej)',
  },
];

/**
 * Buduje przykładową ścieżkę URL dla studenta.
 * @param {StudentRouteDefinition} route
 * @param {string} groupId
 * @param {string} [studentId]
 */
export function buildStudentRouteExample(route, groupId, studentId = 'student-1') {
  const builders = {
    GROUPS_LIST: () => groupsListPath(),
    GROUP_MAIN: () => groupMainPath(groupId),
    GROUP_STUDENT_FEED: () => groupStudentFeedPath(groupId),
    GROUP_STUDENT_PARTICIPANTS: () => groupStudentParticipantsPath(groupId),
    GROUP_STUDENT_ACTIVITY_LIST: () => groupStudentActivityListPath(groupId),
    GROUP_STUDENT_RANKS: () => groupStudentRanksPath(groupId),
    GROUP_STUDENT_BADGES: () => groupStudentBadgesPath(groupId),
    GROUP_PROFILE: () => groupProfilePath(groupId),
    GROUP_PROFILE_LOG: () => groupProfileLogPath(groupId),
    GROUP_PROFILE_EQ: () => groupProfileEqPath(groupId),
    GROUP_SHOP: () => groupShopPath(groupId),
    GROUP_RANKING: () => groupRankingPath(groupId),
    GROUP_RANKING_GROUP: () => groupRankingGroupPath(groupId),
    GROUP_RANKING_ACTIVITIES: () => groupRankingActivitiesPath(groupId),
    APP_SETTINGS: () => appSettingsPath(),
    GROUP_STUDENT_PROFILE: () => groupStudentProfilePath(groupId, studentId),
    GROUP_ROOT: () => `/groups/${groupId}`,
  };

  const builder = builders[route.hrefKey];
  return builder ? builder() : route.pathPattern;
}
