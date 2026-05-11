import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
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
import { groupsListPath } from './pathRegistry.js';

/**
 * Drzewo tras — zsynchronizuj z `routeTable.js` i `shellTemplates.config.js`.
 * `pages/links/` — komponenty podpięte pod router; `pages/content/` — treść ekranów.
 */
const appRouteTree = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="groups" replace /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'userManagement', element: <UserManagementPage /> },
      { path: 'courseManagement', element: <CourseManagementPage /> },
      { path: 'Statistics', element: <StatisticsPage /> },
      { path: 'organizationManagement', element: <OrganizationManagementPage /> },
      {
        path: 'groups',
        children: [
          { index: true, element: <GroupsListPage /> },
          {
            path: ':groupId',
            children: [
              {
                path: 'main',
                element: <GroupMainLayout />,
                children: [
                  { index: true, element: <GroupMainHomePage /> },
                  { path: 'activity', element: <GroupActivityListPage /> },
                  { path: 'ranksandbadges', element: <GroupRanksAndBadgesPage /> },
                ],
              },
              {
                path: 'controlPanel',
                element: <ControlPanelLayout />,
                children: [
                  { index: true, element: <ControlPanelHomePage /> },
                  { path: 'users', element: <ControlPanelUsersPage /> },
                  { path: 'activity', element: <ControlPanelActivityPage /> },
                  { path: 'posts', element: <ControlPanelPostsPage /> },
                  { path: 'ranksandbadges', element: <ControlPanelRanksPage /> },
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
      { path: '*', element: <Navigate to={groupsListPath()} replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(appRouteTree, {
    basename: import.meta.env.BASE_URL,
  });
}
