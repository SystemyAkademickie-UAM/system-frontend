import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
import ApiTestPage from '../pages/links/dev/ApiTestPage.jsx';
import LoginShell from '../components/layout/LoginShell.jsx';
import CourseManagementPage from '../pages/links/app/CourseManagementPage.jsx';
import HelpPage from '../pages/links/app/HelpPage.jsx';
import OrganizationManagementPage from '../pages/links/app/OrganizationManagementPage.jsx';
import StatisticsPage from '../pages/links/app/StatisticsPage.jsx';
import UserManagementPage from '../pages/links/app/UserManagementPage.jsx';
import SettingsPage from '../pages/links/app/SettingsPage.jsx';
import GroupProfilePage from '../pages/links/groups/GroupProfilePage.jsx';
import GroupRankingPage from '../pages/links/groups/GroupRankingPage.jsx';
import GroupShopAddPage from '../pages/links/groups/GroupShopAddPage.jsx';
import GroupShopLayout from '../pages/links/groups/GroupShopLayout.jsx';
import GroupShopPage from '../pages/links/groups/GroupShopPage.jsx';
import GroupsListPage from '../pages/links/groups/GroupsListPage.jsx';
import ControlPanelActivityPage from '../pages/links/groups/control/ControlPanelActivityPage.jsx';
import ControlPanelCurrencyPage from '../pages/links/groups/control/ControlPanelCurrencyPage.jsx';
import ControlPanelHealthPage from '../pages/links/groups/control/ControlPanelHealthPage.jsx';
import ControlPanelHomePage from '../pages/links/groups/control/ControlPanelHomePage.jsx';
import ControlPanelLayout from '../pages/links/groups/control/ControlPanelLayout.jsx';
import ControlPanelPostsPage from '../pages/links/groups/control/ControlPanelPostsPage.jsx';
import ControlPanelRanksPage from '../pages/links/groups/control/ControlPanelRanksPage.jsx';
import ControlPanelShopItemsPage from '../pages/links/groups/control/ControlPanelShopItemsPage.jsx';
import ControlPanelUsersPage from '../pages/links/groups/control/ControlPanelUsersPage.jsx';
import GroupActivityListPage from '../pages/links/groups/main/GroupActivityListPage.jsx';
import GroupMainHomePage from '../pages/links/groups/main/GroupMainHomePage.jsx';
import GroupMainLayout from '../pages/links/groups/layouts/GroupMainLayout.jsx';
import GroupRanksAndBadgesPage from '../pages/links/groups/main/GroupRanksAndBadgesPage.jsx';
import LoginHubPage from '../pages/links/login/LoginHubPage.jsx';
import LoginNikitaPage from '../pages/links/login/LoginNikitaPage.jsx';
import LoginTempPage from '../pages/links/login/LoginTempPage.jsx';
import { loginPath } from './pathRegistry.js';

/**
 * Drzewo tras — zsynchronizuj z `routeTable.js` i `shellTemplates.config.js`.
 * `pages/links/` — komponenty podpięte pod router; `pages/content/` — treść ekranów.
 * Trasy `login`, `logintemp`, `loginnikita`: layout `LoginShell` (bez paska bocznego).
 */
const appRouteTree = [
  {
    path: '/',
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      {
        element: <LoginShell />,
        children: [
          { path: 'login', element: <LoginHubPage /> },
          { path: 'logintemp', element: <LoginTempPage /> },
          { path: 'loginnikita', element: <LoginNikitaPage /> },
        ],
      },
      {
        element: <AppShell />,
        children: [
          { path: 'settings', element: <SettingsPage /> },
          { path: 'help', element: <HelpPage /> },
          { path: 'userManagement', element: <UserManagementPage /> },
          { path: 'courseManagement', element: <CourseManagementPage /> },
          { path: 'Statistics', element: <StatisticsPage /> },
          { path: 'organizations', element: <OrganizationManagementPage /> },
          {
            path: 'groups',
            children: [
              { index: true, element: <GroupsListPage /> },
              {
                path: ':groupId',
                children: [
                  {
                    element: <GroupMainLayout />,
                    children: [
                      { index: true, element: <GroupMainHomePage /> },
                      { path: 'activity', element: <GroupActivityListPage /> },
                      { path: 'ranks', element: <GroupRanksAndBadgesPage /> },
                    ],
                  },
                  {
                    path: 'control',
                    element: <ControlPanelLayout />,
                    children: [
                      { index: true, element: <ControlPanelHomePage /> },
                      { path: 'users', element: <ControlPanelUsersPage /> },
                      { path: 'activity', element: <ControlPanelActivityPage /> },
                      { path: 'posts', element: <ControlPanelPostsPage /> },
                      { path: 'ranks', element: <ControlPanelRanksPage /> },
                      { path: 'shopitems', element: <ControlPanelShopItemsPage /> },
                      { path: 'currency', element: <ControlPanelCurrencyPage /> },
                      { path: 'health', element: <ControlPanelHealthPage /> },
                    ],
                  },
                  { path: 'profile', element: <GroupProfilePage /> },
                  {
                    path: 'shop',
                    element: <GroupShopLayout />,
                    children: [
                      { index: true, element: <GroupShopPage /> },
                      { path: 'add', element: <GroupShopAddPage /> },
                    ],
                  },
                  { path: 'ranking', element: <GroupRankingPage /> },
                ],
              },
            ],
          },
          { path: 'api-test', element: <ApiTestPage /> },
          { path: '*', element: <Navigate to={loginPath()} replace /> },
        ],
      },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(appRouteTree, {
    basename: import.meta.env.BASE_URL,
  });
}
