/**
 * Rejestr tras aplikacji — dokumentacja i identyfikatory stron.
 * Drzewo Route (źródło prawdy): `createAppRouter.jsx`.
 *
 * Konwencja:
 * - `pageModule` — cienki wrapper w `pages/links/` (podpięty w routerze)
 * - `contentModule` — treść ekranu w `pages/content/`
 *
 * @typedef {Object} AppRouteDefinition
 * @property {string} id — stabilny identyfikator trasy
 * @property {string} pathPattern — wzorzec URL (React Router)
 * @property {string} pageTitle — tytuł strony (UI / dokumentacja)
 * @property {string} pageModule — ścieżka do *Page.jsx w links/
 * @property {string} [contentModule] — ścieżka do *Content.jsx w content/
 * @property {string} [section] — grupa logiczna (auth, app, group, dev)
 * @property {string[]} [roles] — dozwolone role (puste = jak w routerze)
 */

/** @type {AppRouteDefinition[]} */
export const ROUTE_TABLE = [
  // ===========================================================================
  // AUTH (publiczne)
  // ===========================================================================
  {
    id: 'auth.login',
    section: 'auth',
    pathPattern: '/login',
    pageTitle: 'Logowanie',
    pageModule: 'pages/links/auth/LoginPage.jsx',
    contentModule: 'pages/content/auth/LoginPionierId.jsx',
  },

  // ===========================================================================
  // DEV
  // ===========================================================================
  {
    id: 'dev.apiTest',
    section: 'dev',
    pathPattern: '/dev/api-test',
    pageTitle: 'Dev API Test',
    pageModule: 'pages/links/dev/DevApiTestPage.jsx',
    contentModule: 'pages/content/api-test/ApiTestWorkspace.jsx',
  },
  {
    id: 'dev.apiTestLegacy',
    section: 'dev',
    pathPattern: '/api-test',
    pageTitle: 'API Test (redirect)',
    pageModule: null,
    contentModule: null,
  },

  // ===========================================================================
  // APP (poziom aplikacji, bez groupId)
  // ===========================================================================
  {
    id: 'groups.list',
    section: 'group',
    pathPattern: '/groups',
    pageTitle: 'Lista grup',
    pageModule: 'pages/links/groups/groups-list/GroupsListPage.jsx',
    contentModule: 'pages/content/groups-list/GroupsListContent.jsx',
  },
  {
    id: 'app.settings',
    section: 'app',
    pathPattern: '/settings',
    pageTitle: 'Ustawienia',
    pageModule: 'pages/links/app/SettingsPage.jsx',
    contentModule: 'pages/content/settings/SettingsContent.jsx',
  },
  {
    id: 'app.help',
    section: 'app',
    pathPattern: '/help',
    pageTitle: 'Centrum pomocy',
    pageModule: 'pages/links/app/HelpPage.jsx',
    contentModule: 'pages/content/help/HelpContent.jsx',
  },
  {
    id: 'app.userManagement',
    section: 'app',
    pathPattern: '/userManagement',
    pageTitle: 'Zarządzanie dostępem',
    pageModule: 'pages/links/app/UserManagementPage.jsx',
    contentModule: 'pages/content/user-management/UserManagementContent.jsx',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'app.courseManagement',
    section: 'app',
    pathPattern: '/courseManagement',
    pageTitle: 'Zarządzanie kursami',
    pageModule: 'pages/links/app/CourseManagementPage.jsx',
    contentModule: 'pages/content/course-management/CourseManagementContent.jsx',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'app.statistics',
    section: 'app',
    pathPattern: '/statistics',
    pageTitle: 'Statystyki',
    pageModule: 'pages/links/app/StatisticsPage.jsx',
    contentModule: 'pages/content/statistics/StatisticsContent.jsx',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'app.organizations',
    section: 'app',
    pathPattern: '/organizations',
    pageTitle: 'Zarządzanie organizacjami',
    pageModule: 'pages/links/app/OrganizationManagementPage.jsx',
    contentModule: 'pages/content/organization-management/OrganizationManagementContent.jsx',
    roles: ['superadmin'],
  },

  // ===========================================================================
  // GROUP — Korzeń (/groups/:groupId)
  // ===========================================================================
  {
    id: 'group.root',
    section: 'group',
    pathPattern: '/groups/:groupId',
    pageTitle: 'Grupa — dołączenie',
    pageModule: 'pages/links/groups/GroupJoinPage.jsx',
    contentModule: 'pages/content/group-join/GroupJoinContent.jsx',
    roles: ['student'],
  },

  // ===========================================================================
  // GROUP — Strona główna (/home)
  // ===========================================================================
  {
    id: 'group.main.home',
    section: 'group',
    pathPattern: '/groups/:groupId/home',
    pageTitle: 'Ekran główny',
    pageModule: 'pages/links/groups/main/GroupMainHomePage.jsx',
    contentModule: 'pages/content/group-main/GroupMainHomeContent.jsx',
  },

  // ===========================================================================
  // GROUP — Student flat routes (poza /home)
  // ===========================================================================
  {
    id: 'group.student.posts',
    section: 'group',
    pathPattern: '/groups/:groupId/posts',
    pageTitle: 'Wpisy',
    pageModule: 'pages/links/groups/main/GroupMainPostsPage.jsx',
    contentModule: 'pages/content/group-main/GroupMainPostsContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.users',
    section: 'group',
    pathPattern: '/groups/:groupId/users',
    pageTitle: 'Uczestnicy',
    pageModule: 'pages/links/groups/main/GroupMainMembersPage.jsx',
    contentModule: 'pages/content/group-main-members/GroupMainMembersContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.activityList',
    section: 'group',
    pathPattern: '/groups/:groupId/activity-list',
    pageTitle: 'Lista aktywności',
    pageModule: 'pages/links/groups/main/GroupMainActivitiesPage.jsx',
    contentModule: 'pages/content/group-main-activities/GroupMainActivitiesContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.ranks',
    section: 'group',
    pathPattern: '/groups/:groupId/ranks',
    pageTitle: 'Rangi',
    pageModule: 'pages/links/groups/main/GroupMainRanksPage.jsx',
    contentModule: 'pages/content/group-main-ranks/GroupMainRanksContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.student.badges',
    section: 'group',
    pathPattern: '/groups/:groupId/badges',
    pageTitle: 'Odznaki',
    pageModule: 'pages/links/groups/main/GroupMainBadgesPage.jsx',
    contentModule: 'pages/content/group-main-badges/GroupMainBadgesContent.jsx',
    roles: ['student'],
  },

  // ===========================================================================
  // GROUP — Profil (/profile) — student
  // ===========================================================================
  {
    id: 'group.profile.home',
    section: 'group',
    pathPattern: '/groups/:groupId/profile',
    pageTitle: 'Profil — odznaki',
    pageModule: 'pages/links/groups/profile/ProfileHomePage.jsx',
    contentModule: 'pages/content/group-profile/ProfileHomeContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.profile.activity',
    section: 'group',
    pathPattern: '/groups/:groupId/profile/activity',
    pageTitle: 'Profil — dziennik aktywności',
    pageModule: 'pages/links/groups/profile/ProfileLogPage.jsx',
    contentModule: 'pages/content/group-profile-log/ProfileLogContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.profile.eq',
    section: 'group',
    pathPattern: '/groups/:groupId/profile/eq',
    pageTitle: 'Profil — ekwipunek',
    pageModule: 'pages/links/groups/profile/ProfileEqPage.jsx',
    contentModule: 'pages/content/group-profile-eq/ProfileEqContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.studentProfile.home',
    section: 'group',
    pathPattern: '/groups/:groupId/studentprofile/:studentId',
    pageTitle: 'Profil uczestnika',
    pageModule: 'pages/links/groups/student-profile/StudentProfileHomePage.jsx',
    contentModule: 'pages/content/group-profile/ProfileHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.studentProfile.log',
    section: 'group',
    pathPattern: '/groups/:groupId/studentprofile/:studentId/log',
    pageTitle: 'Profil uczestnika — aktywności',
    pageModule: 'pages/links/groups/student-profile/StudentProfileLogPage.jsx',
    contentModule: 'pages/content/group-profile-log/ProfileLogContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.studentProfile.eq',
    section: 'group',
    pathPattern: '/groups/:groupId/studentprofile/:studentId/eq',
    pageTitle: 'Profil uczestnika — ekwipunek',
    pageModule: 'pages/links/groups/student-profile/StudentProfileEqPage.jsx',
    contentModule: 'pages/content/group-profile-eq/ProfileEqContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  // ===========================================================================
  // GROUP — Użytkownicy (/members) — lecturer
  // ===========================================================================
  {
    id: 'group.members.home',
    section: 'group',
    pathPattern: '/groups/:groupId/members',
    pageTitle: 'Użytkownicy — uczestnicy',
    pageModule: 'pages/links/groups/members/MembersHomePage.jsx',
    contentModule: 'pages/content/group-members/MembersHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.members.log',
    section: 'group',
    pathPattern: '/groups/:groupId/members/log',
    pageTitle: 'Użytkownicy — log aktywności',
    pageModule: 'pages/links/groups/members/MembersLogPage.jsx',
    contentModule: 'pages/content/group-members-log/MembersLogContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.members.codes',
    section: 'group',
    pathPattern: '/groups/:groupId/members/codes',
    pageTitle: 'Użytkownicy — kody dostępu',
    pageModule: 'pages/links/groups/members/MembersCodePage.jsx',
    contentModule: 'pages/content/group-members-code/MembersCodeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  // ===========================================================================
  // GROUP — Aktywności (/activities) — lecturer
  // ===========================================================================
  {
    id: 'group.activities.home',
    section: 'group',
    pathPattern: '/groups/:groupId/activities',
    pageTitle: 'Aktywności — etapy',
    pageModule: 'pages/links/groups/activities/ActivitiesHomePage.jsx',
    contentModule: 'pages/content/group-activities/ActivitiesHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.activities.tools',
    section: 'group',
    pathPattern: '/groups/:groupId/activities/tools',
    pageTitle: 'Aktywności — raporty',
    pageModule: 'pages/links/groups/activities/ActivitiesToolsPage.jsx',
    contentModule: 'pages/content/group-activities-tools/ActivitiesToolsContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  // ===========================================================================
  // GROUP — Wpisy (/activities/posts) — lecturer
  // ===========================================================================
  {
    id: 'group.activities.posts',
    section: 'group',
    pathPattern: '/groups/:groupId/activities/posts',
    pageTitle: 'Aktywności — wpisy',
    pageModule: 'pages/links/groups/posts/PostsHomePage.jsx',
    contentModule: 'pages/content/group-posts/PostsContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  // ===========================================================================
  // GROUP — Systemy nagród (/rewards) — lecturer
  // ===========================================================================
  {
    id: 'group.rewards.badges',
    section: 'group',
    pathPattern: '/groups/:groupId/rewards',
    pageTitle: 'Systemy nagród — odznaki',
    pageModule: 'pages/links/groups/rewards/RewardsBadgesPage.jsx',
    contentModule: 'pages/content/group-rewards-badges/RewardsBadgesContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.rewards.ranks',
    section: 'group',
    pathPattern: '/groups/:groupId/rewards/ranks',
    pageTitle: 'Systemy nagród — rangi',
    pageModule: 'pages/links/groups/rewards/RewardsHomePage.jsx',
    contentModule: 'pages/content/group-rewards/RewardsHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.rewards.shopitems',
    section: 'group',
    pathPattern: '/groups/:groupId/rewards/shopitems',
    pageTitle: 'Systemy nagród — przedmioty sklepowe',
    pageModule: 'pages/links/groups/rewards/ShopItemsPage.jsx',
    contentModule: 'pages/content/group-rewards-shopitems/RewardsShopItemsContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  // ===========================================================================
  // GROUP — Ustawienia grupy (/groupsettings) — lecturer
  // ===========================================================================
  {
    id: 'group.settings.home',
    section: 'group',
    pathPattern: '/groups/:groupId/groupsettings',
    pageTitle: 'Ustawienia grupy — kreator',
    pageModule: 'pages/links/groups/group-settings/GroupSettingsHomePage.jsx',
    contentModule: 'pages/content/group-settings/GroupSettingsHomeContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.settings.currency',
    section: 'group',
    pathPattern: '/groups/:groupId/groupsettings/currency',
    pageTitle: 'Ustawienia grupy — waluta',
    pageModule: 'pages/links/groups/group-settings/GroupSettingsCurrencyPage.jsx',
    contentModule: 'pages/content/group-settings-currency/GroupSettingsCurrencyContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },
  {
    id: 'group.settings.lives',
    section: 'group',
    pathPattern: '/groups/:groupId/groupsettings/lives',
    pageTitle: 'Ustawienia grupy — system żyć',
    pageModule: 'pages/links/groups/group-settings/GroupSettingsHealthPage.jsx',
    contentModule: 'pages/content/group-settings-health/GroupSettingsHealthContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  // ===========================================================================
  // GROUP — Sklep (/shop)
  // ===========================================================================
  {
    id: 'group.shop.home',
    section: 'group',
    pathPattern: '/groups/:groupId/shop',
    pageTitle: 'Sklep',
    pageModule: 'pages/links/groups/shop/ShopHomePage.jsx',
    contentModule: 'pages/content/group-shop/GroupShopContent.jsx',
    roles: ['student'],
  },
  {
    id: 'group.shop.add',
    section: 'group',
    pathPattern: '/groups/:groupId/shop/add',
    pageTitle: 'Sklep — dodawanie przedmiotu',
    pageModule: 'pages/links/groups/shop/ShopAddPage.jsx',
    contentModule: 'pages/content/group-shop-add/GroupShopAddContent.jsx',
    roles: ['lecturer', 'admin', 'superadmin'],
  },

  // ===========================================================================
  // GROUP — Ranking (/ranking)
  // ===========================================================================
  {
    id: 'group.ranking.home',
    section: 'group',
    pathPattern: '/groups/:groupId/ranking',
    pageTitle: 'Ranking — twoje informacje',
    pageModule: 'pages/links/groups/ranking/RankingHomePage.jsx',
    contentModule: 'pages/content/group-ranking/RankingHomeContent.jsx',
  },
  {
    id: 'group.ranking.group',
    section: 'group',
    pathPattern: '/groups/:groupId/ranking/group',
    pageTitle: 'Ranking — ranking grupy',
    pageModule: 'pages/links/groups/ranking/RankingGroupPage.jsx',
    contentModule: 'pages/content/group-ranking-group/RankingGroupContent.jsx',
  },
  {
    id: 'group.ranking.activities',
    section: 'group',
    pathPattern: '/groups/:groupId/ranking/activities',
    pageTitle: 'Ranking — ranking aktywności',
    pageModule: 'pages/links/groups/ranking/RankingActivitiesPage.jsx',
    contentModule: 'pages/content/group-ranking-activities/RankingActivitiesContent.jsx',
  },
];

/**
 * Zwraca definicję trasy po identyfikatorze.
 * @param {string} id
 * @returns {AppRouteDefinition | undefined}
 */
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
