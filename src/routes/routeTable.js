/**
 * Tablica routingu — dokumentacja i identyfikatory stron.
 * Drzewo Route: `createAppRouter.jsx`.
 *
 * @typedef {Object} AppRouteDefinition
 * @property {string} id
 * @property {string} pathPattern
 * @property {string} pageTitle
 * @property {string} pageModule — komponent w `pages/links/` (router)
 * @property {string} [contentModule] — treść w `pages/content/` (jeśli dotyczy)
 */

/** @type {AppRouteDefinition[]} */
export const ROUTE_TABLE = [
  {
    id: 'auth.login',
    pathPattern: '/login',
    pageTitle: 'Logowanie',
    pageModule: 'pages/links/login/LoginHubPage.jsx',
    contentModule: 'pages/content/login-hub/LoginHubContent.jsx',
  },
  {
    id: 'auth.loginTemp',
    pathPattern: '/logintemp',
    pageTitle: 'Logowanie (tymczasowe)',
    pageModule: 'pages/links/login/LoginTempPage.jsx',
    contentModule: 'pages/content/login-temp/LoginTempContent.jsx',
  },
  {
    id: 'dev.apiTest',
    pathPattern: '/dev/api-test',
    pageTitle: 'Dev API test',
    pageModule: 'pages/links/login/DevApiTestPage.jsx',
    contentModule: 'pages/content/api-test/ApiTestWorkspace.jsx',
  },
  {
    id: 'dev.apiTestLegacy',
    pathPattern: '/api-test',
    pageTitle: 'API Test Dashboard (redirect)',
    pageModule: 'pages/links/login/DevApiTestPage.jsx',
    contentModule: 'pages/content/api-test/ApiTestWorkspace.jsx',
  },
  {
    id: 'groups.list',
    pathPattern: '/groups',
    pageTitle: 'Lista grup',
    pageModule: 'pages/links/groups/GroupsListPage.jsx',
    contentModule: 'pages/content/groups-list/GroupsListContent.jsx',
  },
  {
    id: 'app.settings',
    pathPattern: '/settings',
    pageTitle: 'Ustawienia',
    pageModule: 'pages/links/app/SettingsPage.jsx',
    contentModule: 'pages/content/settings/SettingsContent.jsx',
  },
  {
    id: 'app.help',
    pathPattern: '/help',
    pageTitle: 'Centrum pomocy',
    pageModule: 'pages/links/app/HelpPage.jsx',
    contentModule: 'pages/content/help/HelpContent.jsx',
  },
  {
    id: 'app.userManagement',
    pathPattern: '/userManagement',
    pageTitle: 'Zarządzanie dostępem',
    pageModule: 'pages/links/app/UserManagementPage.jsx',
    contentModule: 'pages/content/user-management/UserManagementContent.jsx',
  },
  {
    id: 'app.courseManagement',
    pathPattern: '/courseManagement',
    pageTitle: 'Zarządzanie kursami',
    pageModule: 'pages/links/app/CourseManagementPage.jsx',
    contentModule: 'pages/content/course-management/CourseManagementContent.jsx',
  },
  {
    id: 'app.statistics',
    pathPattern: '/Statistics',
    pageTitle: 'Statystyki',
    pageModule: 'pages/links/app/StatisticsPage.jsx',
    contentModule: 'pages/content/statistics/StatisticsContent.jsx',
  },
  {
    id: 'app.organizationManagement',
    pathPattern: '/organizationManagement',
    pageTitle: 'Zarządzanie organizacjami',
    pageModule: 'pages/links/app/OrganizationManagementPage.jsx',
    contentModule: 'pages/content/organization-management/OrganizationManagementContent.jsx',
  },
  {
    id: 'group.main.home',
    pathPattern: '/groups/:groupId/main',
    pageTitle: 'Strona główna grupy',
    pageModule: 'pages/links/groups/main/GroupMainHomePage.jsx',
    contentModule: 'pages/content/group-main-home/GroupMainHomeContent.jsx',
  },
  {
    id: 'group.main.activity',
    pathPattern: '/groups/:groupId/main/activity',
    pageTitle: 'Lista aktywności',
    pageModule: 'pages/links/groups/main/GroupActivityListPage.jsx',
    contentModule: 'pages/content/group-main-activity/GroupMainActivityContent.jsx',
  },
  {
    id: 'group.main.ranksandbadges',
    pathPattern: '/groups/:groupId/main/ranksandbadges',
    pageTitle: 'Rangi i odznaki',
    pageModule: 'pages/links/groups/main/GroupRanksAndBadgesPage.jsx',
    contentModule: 'pages/content/group-main-ranksandbadges/GroupMainRanksAndBadgesContent.jsx',
  },
  {
    id: 'group.control.home',
    pathPattern: '/groups/:groupId/controlPanel',
    pageTitle: 'Panel zarządzania',
    pageModule: 'pages/links/groups/control/ControlPanelHomePage.jsx',
    contentModule: 'pages/content/control-panel-home/ControlPanelHomeContent.jsx',
  },
  {
    id: 'group.control.users',
    pathPattern: '/groups/:groupId/controlPanel/users',
    pageTitle: 'Panel — użytkownicy',
    pageModule: 'pages/links/groups/control/ControlPanelUsersPage.jsx',
    contentModule: 'pages/content/control-panel-users/ControlPanelUsersContent.jsx',
  },
  {
    id: 'group.control.activity',
    pathPattern: '/groups/:groupId/controlPanel/activity',
    pageTitle: 'Panel — etapy i aktywności',
    pageModule: 'pages/links/groups/control/ControlPanelActivityPage.jsx',
    contentModule: 'pages/content/control-panel-activity/ControlPanelActivityContent.jsx',
  },
  {
    id: 'group.control.posts',
    pathPattern: '/groups/:groupId/controlPanel/posts',
    pageTitle: 'Panel — wpisy',
    pageModule: 'pages/links/groups/control/ControlPanelPostsPage.jsx',
    contentModule: 'pages/content/control-panel-posts/ControlPanelPostsContent.jsx',
  },
  {
    id: 'group.control.ranksandbadges',
    pathPattern: '/groups/:groupId/controlPanel/ranksandbadges',
    pageTitle: 'Panel — odznaki i rangi',
    pageModule: 'pages/links/groups/control/ControlPanelRanksPage.jsx',
    contentModule: 'pages/content/control-panel-ranksandbadges/ControlPanelRanksAndBadgesContent.jsx',
  },
  {
    id: 'group.control.shopitems',
    pathPattern: '/groups/:groupId/controlPanel/shopitems',
    pageTitle: 'Panel — przedmioty sklepowe',
    pageModule: 'pages/links/groups/control/ControlPanelShopItemsPage.jsx',
    contentModule: 'pages/content/control-panel-shopitems/ControlPanelShopItemsContent.jsx',
  },
  {
    id: 'group.control.currency',
    pathPattern: '/groups/:groupId/controlPanel/currency',
    pageTitle: 'Panel — waluta',
    pageModule: 'pages/links/groups/control/ControlPanelCurrencyPage.jsx',
    contentModule: 'pages/content/control-panel-currency/ControlPanelCurrencyContent.jsx',
  },
  {
    id: 'group.control.health',
    pathPattern: '/groups/:groupId/controlPanel/health',
    pageTitle: 'Panel — system żyć',
    pageModule: 'pages/links/groups/control/ControlPanelHealthPage.jsx',
    contentModule: 'pages/content/control-panel-health/ControlPanelHealthContent.jsx',
  },
  {
    id: 'group.profile',
    pathPattern: '/groups/:groupId/profile',
    pageTitle: 'Profil użytkownika',
    pageModule: 'pages/links/groups/GroupProfilePage.jsx',
    contentModule: 'pages/content/profile/ProfileContent.jsx',
  },
  {
    id: 'group.shop',
    pathPattern: '/groups/:groupId/shop',
    pageTitle: 'Sklep',
    pageModule: 'pages/links/groups/GroupShopPage.jsx',
    contentModule: 'pages/content/group-shop/GroupShopContent.jsx',
  },
  {
    id: 'group.shop.add',
    pathPattern: '/groups/:groupId/shop/add',
    pageTitle: 'Dodawanie przedmiotu do sklepu',
    pageModule: 'pages/links/groups/GroupShopAddPage.jsx',
    contentModule: 'pages/content/group-shop-add/GroupShopAddContent.jsx',
  },
  {
    id: 'group.ranking',
    pathPattern: '/groups/:groupId/ranking',
    pageTitle: 'Ranking',
    pageModule: 'pages/links/groups/GroupRankingPage.jsx',
    contentModule: 'pages/content/group-ranking/GroupRankingContent.jsx',
  },
];
