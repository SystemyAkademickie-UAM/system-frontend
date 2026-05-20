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
    id: 'auth.loginNikita',
    pathPattern: '/loginnikita',
    pageTitle: 'Logowanie — Nikita',
    pageModule: 'pages/links/login/LoginNikitaPage.jsx',
    contentModule: 'pages/content/login-nikita/LoginNikitaContent.jsx',
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
    id: 'app.organizations',
    pathPattern: '/organizations',
    pageTitle: 'Zarządzanie organizacjami',
    pageModule: 'pages/links/app/OrganizationManagementPage.jsx',
    contentModule: 'pages/content/organization-management/OrganizationManagementContent.jsx',
  },
  {
    id: 'group.main.home',
    pathPattern: '/groups/:groupId',
    pageTitle: 'Strona główna grupy',
    pageModule: 'pages/links/groups/main/GroupMainHomePage.jsx',
    contentModule: 'pages/content/group-main-home/GroupMainHomeContent.jsx',
  },
  {
    id: 'group.main.activity',
    pathPattern: '/groups/:groupId/activity',
    pageTitle: 'Lista aktywności',
    pageModule: 'pages/links/groups/main/GroupActivityListPage.jsx',
    contentModule: 'pages/content/group-main-activity/GroupMainActivityContent.jsx',
  },
  {
    id: 'group.main.ranks',
    pathPattern: '/groups/:groupId/ranks',
    pageTitle: 'Rangi i odznaki',
    pageModule: 'pages/links/groups/main/GroupRanksAndBadgesPage.jsx',
    contentModule: 'pages/content/group-main-ranksandbadges/GroupMainRanksAndBadgesContent.jsx',
  },
  {
    id: 'group.control.home',
    pathPattern: '/groups/:groupId/control',
    pageTitle: 'Panel zarządzania',
    pageModule: 'pages/links/groups/control/ControlPanelHomePage.jsx',
    contentModule: 'pages/content/control-panel-home/ControlPanelHomeContent.jsx',
  },
  {
    id: 'group.control.users',
    pathPattern: '/groups/:groupId/control/users',
    pageTitle: 'Panel — użytkownicy',
    pageModule: 'pages/links/groups/control/ControlPanelUsersPage.jsx',
    contentModule: 'pages/content/control-panel-users/ControlPanelUsersContent.jsx',
  },
  {
    id: 'group.control.activity',
    pathPattern: '/groups/:groupId/control/activity',
    pageTitle: 'Panel — etapy i aktywności',
    pageModule: 'pages/links/groups/control/ControlPanelActivityPage.jsx',
    contentModule: 'pages/content/control-panel-activity/ControlPanelActivityContent.jsx',
  },
  {
    id: 'group.control.posts',
    pathPattern: '/groups/:groupId/control/posts',
    pageTitle: 'Panel — wpisy',
    pageModule: 'pages/links/groups/control/ControlPanelPostsPage.jsx',
    contentModule: 'pages/content/control-panel-posts/ControlPanelPostsContent.jsx',
  },
  {
    id: 'group.control.ranks',
    pathPattern: '/groups/:groupId/control/ranks',
    pageTitle: 'Panel — odznaki i rangi',
    pageModule: 'pages/links/groups/control/ControlPanelRanksPage.jsx',
    contentModule: 'pages/content/control-panel-ranksandbadges/ControlPanelRanksAndBadgesContent.jsx',
  },
  {
    id: 'group.control.shopitems',
    pathPattern: '/groups/:groupId/control/shopitems',
    pageTitle: 'Panel — przedmioty sklepowe',
    pageModule: 'pages/links/groups/control/ControlPanelShopItemsPage.jsx',
    contentModule: 'pages/content/control-panel-shopitems/ControlPanelShopItemsContent.jsx',
  },
  {
    id: 'group.control.currency',
    pathPattern: '/groups/:groupId/control/currency',
    pageTitle: 'Panel — waluta',
    pageModule: 'pages/links/groups/control/ControlPanelCurrencyPage.jsx',
    contentModule: 'pages/content/control-panel-currency/ControlPanelCurrencyContent.jsx',
  },
  {
    id: 'group.control.health',
    pathPattern: '/groups/:groupId/control/health',
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
  {
    id: 'dev.apiTest',
    pathPattern: '/api-test',
    pageTitle: 'API Test Dashboard',
    pageModule: 'pages/links/dev/ApiTestPage.jsx',
    contentModule: 'pages/content/api-test/ApiTestContent.jsx',
  },
];
