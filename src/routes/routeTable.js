/**
 * Tablica routingu — dokumentacja i identyfikatory stron.
 * Drzewo Route: `createAppRouter.jsx`.
 *
 * @typedef {Object} AppRouteDefinition
 * @property {string} id
 * @property {string} pathPattern
 * @property {string} pageTitle
 * @property {string} pageModule
 */

/** @type {AppRouteDefinition[]} */
export const ROUTE_TABLE = [
  { id: 'groups.list', pathPattern: '/groups', pageTitle: 'Lista grup', pageModule: 'pages/groups/GroupsListPage.jsx' },
  { id: 'app.settings', pathPattern: '/settings', pageTitle: 'Ustawienia', pageModule: 'pages/groups/GroupSettingsPage.jsx' },
  { id: 'app.help', pathPattern: '/help', pageTitle: 'Centrum pomocy', pageModule: 'pages/app/HelpPage.jsx' },
  { id: 'app.userManagement', pathPattern: '/userManagement', pageTitle: 'Zarządzanie dostępem', pageModule: 'pages/app/UserManagementPage.jsx' },
  { id: 'app.courseManagement', pathPattern: '/courseManagement', pageTitle: 'Zarządzanie kursami', pageModule: 'pages/app/CourseManagementPage.jsx' },
  { id: 'app.statistics', pathPattern: '/Statistics', pageTitle: 'Statystyki', pageModule: 'pages/app/StatisticsPage.jsx' },
  {
    id: 'app.organizationManagement',
    pathPattern: '/organizationManagement',
    pageTitle: 'Zarządzanie organizacjami',
    pageModule: 'pages/app/OrganizationManagementPage.jsx',
  },
  {
    id: 'group.main.home',
    pathPattern: '/groups/:groupId/main',
    pageTitle: 'Strona główna grupy',
    pageModule: 'pages/groups/main/GroupMainHomePage.jsx',
  },
  {
    id: 'group.main.activity',
    pathPattern: '/groups/:groupId/main/activity',
    pageTitle: 'Lista aktywności',
    pageModule: 'pages/groups/main/GroupActivityListPage.jsx',
  },
  {
    id: 'group.main.ranksandbadges',
    pathPattern: '/groups/:groupId/main/ranksandbadges',
    pageTitle: 'Rangi i odznaki',
    pageModule: 'pages/groups/main/GroupRanksAndBadgesPage.jsx',
  },
  {
    id: 'group.control.home',
    pathPattern: '/groups/:groupId/controlPanel',
    pageTitle: 'Panel zarządzania',
    pageModule: 'pages/groups/control/ControlPanelHomePage.jsx',
  },
  {
    id: 'group.control.users',
    pathPattern: '/groups/:groupId/controlPanel/users',
    pageTitle: 'Panel — użytkownicy',
    pageModule: 'pages/groups/control/ControlPanelUsersPage.jsx',
  },
  {
    id: 'group.control.activity',
    pathPattern: '/groups/:groupId/controlPanel/activity',
    pageTitle: 'Panel — etapy i aktywności',
    pageModule: 'pages/groups/control/ControlPanelActivityPage.jsx',
  },
  {
    id: 'group.control.posts',
    pathPattern: '/groups/:groupId/controlPanel/posts',
    pageTitle: 'Panel — wpisy',
    pageModule: 'pages/groups/control/ControlPanelPostsPage.jsx',
  },
  {
    id: 'group.control.ranksandbadges',
    pathPattern: '/groups/:groupId/controlPanel/ranksandbadges',
    pageTitle: 'Panel — odznaki i rangi',
    pageModule: 'pages/groups/control/ControlPanelRanksPage.jsx',
  },
  {
    id: 'group.control.shopitems',
    pathPattern: '/groups/:groupId/controlPanel/shopitems',
    pageTitle: 'Panel — przedmioty sklepowe',
    pageModule: 'pages/groups/control/ControlPanelShopItemsPage.jsx',
  },
  {
    id: 'group.control.currency',
    pathPattern: '/groups/:groupId/controlPanel/currency',
    pageTitle: 'Panel — waluta',
    pageModule: 'pages/groups/control/ControlPanelCurrencyPage.jsx',
  },
  {
    id: 'group.control.health',
    pathPattern: '/groups/:groupId/controlPanel/health',
    pageTitle: 'Panel — system żyć',
    pageModule: 'pages/groups/control/ControlPanelHealthPage.jsx',
  },
  {
    id: 'group.profile',
    pathPattern: '/groups/:groupId/profile',
    pageTitle: 'Profil użytkownika',
    pageModule: 'pages/groups/GroupProfilePage.jsx',
  },
  {
    id: 'group.shop',
    pathPattern: '/groups/:groupId/shop',
    pageTitle: 'Sklep',
    pageModule: 'pages/groups/GroupShopPage.jsx',
  },
  {
    id: 'group.shop.add',
    pathPattern: '/groups/:groupId/shop/add',
    pageTitle: 'Dodawanie przedmiotu do sklepu',
    pageModule: 'pages/groups/GroupShopAddPage.jsx',
  },
  {
    id: 'group.ranking',
    pathPattern: '/groups/:groupId/ranking',
    pageTitle: 'Ranking',
    pageModule: 'pages/groups/GroupRankingPage.jsx',
  },
];
