/**
 * @file routeTable.js
 * @description Konfiguracja routingu i definicja powiązań tras dla routeTable.
 */

// === IMPORTY I KONFIGURACJA TRAS ===
/**
 * Rejestr tras aplikacji — dokumentacja i identyfikatory stron.
 * Drzewo Route (źródło prawdy): `createAppRouter.jsx`.
 *
 * Konwencja:
 * - `pageModule` — moduł widoku podpięty w routerze
 * - `contentModule` — treść ekranu w `pages/`
 *
 * @typedef {Object} AppRouteDefinition
 * @property {string} id — stabilny identyfikator trasy
 * @property {string} pathPattern — wzorzec URL (React Router)
 * @property {string} pageTitle — tytuł strony (UI / dokumentacja)
 * @property {string} pageModule — ścieżka do komponentu
 * @property {string} [contentModule] — ścieżka do *Content.jsx w content/
 * @property {string} [section] — grupa logiczna (auth, app, group, dev)
 * @property {string[]} [roles] — dozwolone role (puste = jak w routerze)
 * @property {boolean} [requiresGroupOwner] — tylko właściciel grupy (Game Master)
 */

/** @type {AppRouteDefinition[]} */

// === DEFINICJE ŚCIEŻEK I STRAŻNICY ===
export const ROUTE_TABLE = [
  {
    id: 'auth.login',
    section: 'auth',
    pathPattern: '/login',
    pageTitle: 'Logowanie',
    pageModule: 'pages/auth/LoginPage.jsx',
    contentModule: 'pages/auth/LoginPionierId.jsx',
  },

  {
    id: 'dev.apiTest',
    section: 'dev',
    pathPattern: '/dev/api-test',
    pageTitle: 'Dev API Test',
    pageModule: 'pages/api-test/DevApiTestPage.jsx',
    contentModule: 'pages/api-test/ApiTestWorkspace.jsx',
  },
  {
    id: 'dev.apiTestLegacy',
    section: 'dev',
    pathPattern: '/api-test',
    pageTitle: 'API Test (redirect)',
    pageModule: null,
    contentModule: null,
  },

  {
    id: 'groups.list',
    section: 'group',
    pathPattern: '/groups',
    pageTitle: 'Lista grup',
    pageModule: 'pages/groups/groups-list/GroupsListContent.jsx',
    contentModule: 'pages/groups/groups-list/GroupsListContent.jsx',
  },
  {
    id: 'app.settings',
    section: 'app',
    pathPattern: '/settings',
    pageTitle: 'Ustawienia',
    pageModule: 'pages/settings/SettingsContent.jsx',
    contentModule: 'pages/settings/SettingsContent.jsx',
  },
  {
    id: 'app.help',
    section: 'app',
    pathPattern: '/help',
    pageTitle: 'Centrum pomocy',
    pageModule: 'pages/help/HelpContent.jsx',
    contentModule: 'pages/help/HelpContent.jsx',
  },
  {
    id: 'app.home',
    section: 'app',
    pathPattern: '/home',
    pageTitle: 'Zarządzanie organizacją',
    pageModule: 'pages/admin-home/AdminHomeContent.jsx',
    contentModule: 'pages/admin-home/AdminHomeContent.jsx',
    roles: ['admin'],
  },
  {
    id: 'app.users',
    section: 'app',
    pathPattern: '/users',
    pageTitle: 'Zarządzanie użytkownikami',
    pageModule: 'pages/user-management/UserManagementContent.jsx',
    contentModule: 'pages/user-management/UserManagementContent.jsx',
    roles: ['admin'],
  },
  {
    id: 'app.diskSpace',
    section: 'app',
    pathPattern: '/disk-space',
    pageTitle: 'Zarządzanie przestrzenią dyskową',
    pageModule: 'pages/disk-space/DiskSpaceContent.jsx',
    contentModule: 'pages/disk-space/DiskSpaceContent.jsx',
    roles: ['admin'],
  },
  {
    id: 'app.documents',
    section: 'app',
    pathPattern: '/documents',
    pageTitle: 'Dokumenty i patch notes',
    pageModule: 'pages/documents/DocumentsContent.jsx',
    contentModule: 'pages/documents/DocumentsContent.jsx',
    roles: ['superadmin'],
  },
  {
    id: 'app.broadcasts',
    section: 'app',
    pathPattern: '/broadcasts',
    pageTitle: 'Komunikaty i przerwa techniczna',
    pageModule: 'pages/broadcasts/BroadcastsContent.jsx',
    contentModule: 'pages/broadcasts/BroadcastsContent.jsx',
    roles: ['superadmin'],
  },
  {
    id: 'app.faq',
    section: 'app',
    pathPattern: '/faq',
    pageTitle: 'Najczęściej zadawane pytania (FAQ)',
    pageModule: 'pages/faq/FaqContent.jsx',
    contentModule: 'pages/faq/FaqContent.jsx',
  },
  {
    id: 'app.patchNotes',
    section: 'app',
    pathPattern: '/patch-notes',
    pageTitle: 'Informacje o aktualizacji',
    pageModule: 'pages/patch-notes/PatchNotesContent.jsx',
    contentModule: 'pages/patch-notes/PatchNotesContent.jsx',
  },
  {
    id: 'app.statistics',
    section: 'app',
    pathPattern: '/statistics',
    pageTitle: 'Statystyki',
    pageModule: 'pages/statistics/StatisticsContent.jsx',
    contentModule: 'pages/statistics/StatisticsContent.jsx',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'app.organizations',
    section: 'app',
    pathPattern: '/organizations',
    pageTitle: 'Zarządzanie organizacjami',
    pageModule: 'pages/organization-management/OrganizationManagementContent.jsx',
    contentModule: 'pages/organization-management/OrganizationManagementContent.jsx',
    roles: ['superadmin'],
  },
  {
    id: 'app.logs',
    section: 'app',
    pathPattern: '/logs',
    pageTitle: 'Logi produkcyjne',
    pageModule: 'pages/superadmin-logs/SuperadminLogsContent.jsx',
    contentModule: 'pages/superadmin-logs/SuperadminLogsContent.jsx',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'admin.backup',
    section: 'app',
    pathPattern: '/backups',
    pageTitle: 'Kopia zapasowa bazy',
    pageModule: 'pages/admin-backup/AdminBackupContent.jsx',
    contentModule: 'pages/admin-backup/AdminBackupContent.jsx',
    roles: ['superadmin'],
  },

  {
    id: 'group.root',
    section: 'group',
    pathPattern: '/groups/:groupId',
    pageTitle: 'Grupa — dołączenie',
    pageModule: 'pages/groups/group-join/GroupJoinContent.jsx',
    contentModule: 'pages/groups/group-join/GroupJoinContent.jsx',
    roles: ['student'],
  },

  {
    id: 'group.main.home',
    section: 'group',
    pathPattern: '/groups/:groupId/home',
    pageTitle: 'Ekran główny',
    pageModule: 'pages/groups/group-main/GroupMainHomeContent.jsx',
    contentModule: 'pages/groups/group-main/GroupMainHomeContent.jsx',
  },

  {
    id: 'group.student.posts',
    section: 'group',
    pathPattern: '/groups/:groupId/posts',
    pageTitle: 'Wpisy',
    pageModule: 'pages/groups/group-main/GroupMainPostsContent.jsx',
    contentModule: 'pages/groups/group-main/GroupMainPostsContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.users',
    section: 'group',
    pathPattern: '/groups/:groupId/users',
    pageTitle: 'Osoby uczestniczące',
    pageModule: 'pages/groups/group-main-members/GroupMainMembersContent.jsx',
    contentModule: 'pages/groups/group-main-members/GroupMainMembersContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.activityList',
    section: 'group',
    pathPattern: '/groups/:groupId/activity-list',
    pageTitle: 'Lista aktywności',
    pageModule: 'pages/groups/group-main-activities/GroupMainActivitiesContent.jsx',
    contentModule: 'pages/groups/group-main-activities/GroupMainActivitiesContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.ranks',
    section: 'group',
    pathPattern: '/groups/:groupId/ranks',
    pageTitle: 'Rangi',
    pageModule: 'pages/groups/group-main-ranks/GroupMainRanksContent.jsx',
    contentModule: 'pages/groups/group-main-ranks/GroupMainRanksContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.badges',
    section: 'group',
    pathPattern: '/groups/:groupId/badges',
    pageTitle: 'Odznaki',
    pageModule: 'pages/groups/group-main-badges/GroupMainBadgesContent.jsx',
    contentModule: 'pages/groups/group-main-badges/GroupMainBadgesContent.jsx',
    roles: ['student'],
  },

  {
    id: 'group.profile.home',
    section: 'group',
    pathPattern: '/groups/:groupId/profile',
    pageTitle: 'Profil — dziennik aktywności',
    pageModule: 'pages/groups/group-profile-log/ProfileLogContent.jsx',
    contentModule: 'pages/groups/group-profile-log/ProfileLogContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.profile.activity',
    section: 'group',
    pathPattern: '/groups/:groupId/profile/activity',
    pageTitle: 'Profil — odznaki',
    pageModule: 'pages/groups/group-profile/ProfileHomeContent.jsx',
    contentModule: 'pages/groups/group-profile/ProfileHomeContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.profile.eq',
    section: 'group',
    pathPattern: '/groups/:groupId/profile/eq',
    pageTitle: 'Profil — ekwipunek',
    pageModule: 'pages/groups/group-profile-eq/ProfileEqContent.jsx',
    contentModule: 'pages/groups/group-profile-eq/ProfileEqContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.profile.purchases',
    section: 'group',
    pathPattern: '/groups/:groupId/profile/purchases',
    pageTitle: 'Profil — historia zakupów',
    pageModule: 'pages/groups/group-profile-purchases/ProfilePurchasesContent.jsx',
    contentModule: 'pages/groups/group-profile-purchases/ProfilePurchasesContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.studentProfile',
    section: 'group',
    pathPattern: '/groups/:groupId/student-profile/:studentId',
    pageTitle: 'Profil uczestnika — ekwipunek',
    pageModule: 'pages/groups/group-student-profile/StudentProfileViewContent.jsx',
    contentModule: 'pages/groups/group-student-profile/StudentProfileViewContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'group.members.home',
    section: 'group',
    pathPattern: '/groups/:groupId/members',
    pageTitle: 'Użytkownicy — uczestnicy',
    pageModule: 'pages/groups/group-members/MembersHomeContent.jsx',
    contentModule: 'pages/groups/group-members/MembersHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.members.log',
    section: 'group',
    pathPattern: '/groups/:groupId/members/log',
    pageTitle: 'Użytkownicy — log aktywności',
    pageModule: 'pages/groups/group-members-log/MembersLogContent.jsx',
    contentModule: 'pages/groups/group-members-log/MembersLogContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.members.codes',
    section: 'group',
    pathPattern: '/groups/:groupId/members/codes',
    pageTitle: 'Użytkownicy — kody dostępu',
    pageModule: 'pages/groups/group-members-code/MembersCodeContent.jsx',
    contentModule: 'pages/groups/group-members-code/MembersCodeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'group.activities.home',
    section: 'group',
    pathPattern: '/groups/:groupId/activities',
    pageTitle: 'Aktywności — etapy',
    pageModule: 'pages/groups/group-activities/ActivitiesHomeContent.jsx',
    contentModule: 'pages/groups/group-activities/ActivitiesHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.activities.tools',
    section: 'group',
    pathPattern: '/groups/:groupId/activities/tools',
    pageTitle: 'Aktywności — raporty',
    pageModule: 'pages/groups/group-activities-tools/ActivitiesToolsContent.jsx',
    contentModule: 'pages/groups/group-activities-tools/ActivitiesToolsContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'group.activities.posts',
    section: 'group',
    pathPattern: '/groups/:groupId/activities/posts',
    pageTitle: 'Aktywności — wpisy',
    pageModule: 'pages/groups/group-posts/PostsContent.jsx',
    contentModule: 'pages/groups/group-posts/PostsContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'group.rewards.badges',
    section: 'group',
    pathPattern: '/groups/:groupId/rewards',
    pageTitle: 'Systemy nagród — odznaki',
    pageModule: 'pages/groups/group-rewards-badges/RewardsBadgesContent.jsx',
    contentModule: 'pages/groups/group-rewards-badges/RewardsBadgesContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.rewards.ranks',
    section: 'group',
    pathPattern: '/groups/:groupId/rewards/ranks',
    pageTitle: 'Systemy nagród — rangi',
    pageModule: 'pages/groups/group-rewards/RewardsHomeContent.jsx',
    contentModule: 'pages/groups/group-rewards/RewardsHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.rewards.shop-items',
    section: 'group',
    pathPattern: '/groups/:groupId/rewards/shop-items',
    pageTitle: 'Systemy nagród — przedmioty sklepowe',
    pageModule: 'pages/groups/group-rewards-shopitems/RewardsShopItemsContent.jsx',
    contentModule: 'pages/groups/group-rewards-shopitems/RewardsShopItemsContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'group.settings.home',
    section: 'group',
    pathPattern: '/groups/:groupId/group-settings',
    pageTitle: 'Ustawienia grupy — kreator',
    pageModule: 'pages/groups/group-settings/GroupSettingsHomeContent.jsx',
    contentModule: 'pages/groups/group-settings/GroupSettingsHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.settings.currency',
    section: 'group',
    pathPattern: '/groups/:groupId/group-settings/currency',
    pageTitle: 'Ustawienia grupy — waluta',
    pageModule: 'pages/groups/group-settings-currency/GroupSettingsCurrencyContent.jsx',
    contentModule: 'pages/groups/group-settings-currency/GroupSettingsCurrencyContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.settings.lives',
    section: 'group',
    pathPattern: '/groups/:groupId/group-settings/lives',
    pageTitle: 'Ustawienia grupy — system żyć',
    pageModule: 'pages/groups/group-settings-health/GroupSettingsHealthContent.jsx',
    contentModule: 'pages/groups/group-settings-health/GroupSettingsHealthContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'group.shop.home',
    section: 'group',
    pathPattern: '/groups/:groupId/shop',
    pageTitle: 'Sklep',
    pageModule: 'pages/groups/group-shop/GroupShopContent.jsx',
    contentModule: 'pages/groups/group-shop/GroupShopContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.shop.add',
    section: 'group',
    pathPattern: '/groups/:groupId/shop/add',
    pageTitle: 'Sklep — dodawanie przedmiotu',
    pageModule: 'pages/groups/group-shop-add/GroupShopAddContent.jsx',
    contentModule: 'pages/groups/group-shop-add/GroupShopAddContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'app.templates.gallery',
    section: 'app',
    pathPattern: '/templates',
    pageTitle: 'Szablony — galeria publiczna',
    pageModule: 'pages/templates/TemplatesGalleryContent.jsx',
    contentModule: 'pages/templates/TemplatesGalleryContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'app.templates.my',
    section: 'app',
    pathPattern: '/templates/my',
    pageTitle: 'Szablony — moje szablony',
    pageModule: 'pages/templates/TemplatesMyContent.jsx',
    contentModule: 'pages/templates/TemplatesMyContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  {
    id: 'group.ranking.home',
    section: 'group',
    pathPattern: '/groups/:groupId/ranking',
    pageTitle: 'Ranking — twoje informacje',
    pageModule: 'pages/groups/group-ranking/RankingHomeContent.jsx',
    contentModule: 'pages/groups/group-ranking/RankingHomeContent.jsx',
  },
  {
    id: 'group.ranking.group',
    section: 'group',
    pathPattern: '/groups/:groupId/ranking/group',
    pageTitle: 'Ranking — ranking grupy',
    pageModule: 'pages/groups/group-ranking-group/RankingGroupContent.jsx',
    contentModule: 'pages/groups/group-ranking-group/RankingGroupContent.jsx',
  },
  {
    id: 'group.ranking.activities',
    section: 'group',
    pathPattern: '/groups/:groupId/ranking/activities',
    pageTitle: 'Ranking — ranking aktywności',
    pageModule: 'pages/groups/group-ranking-activities/RankingActivitiesContent.jsx',
    contentModule: 'pages/groups/group-ranking-activities/RankingActivitiesContent.jsx',
  },
];

/**
 * Zwraca definicję trasy po identyfikatorze.
 * @param {string} id
 * @returns {AppRouteDefinition | undefined}
 */

// === EKSPORTY I REJESTRACJA ===
export function getRouteById(id) {
  return ROUTE_TABLE.find((route) => route.id === id);
}

/**
 * Zwraca trasy należące do danej sekcji.
 * @param {'auth' | 'app' | 'group' | 'dev'} section
 * @returns {AppRouteDefinition[]}
 */
export function getRoutesBySection(section) {
  return ROUTE_TABLE.filter((route) => route.section === section);
}
