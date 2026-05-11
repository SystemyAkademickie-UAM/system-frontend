import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
import CourseManagementPage from '../pages/app/CourseManagementPage.jsx';
import HelpPage from '../pages/app/HelpPage.jsx';
import OrganizationManagementPage from '../pages/app/OrganizationManagementPage.jsx';
import StatisticsPage from '../pages/app/StatisticsPage.jsx';
import UserManagementPage from '../pages/app/UserManagementPage.jsx';
import GroupProfilePage from '../pages/groups/GroupProfilePage.jsx';
import GroupRankingPage from '../pages/groups/GroupRankingPage.jsx';
import GroupSettingsPage from '../pages/groups/GroupSettingsPage.jsx';
import GroupShopAddPage from '../pages/groups/GroupShopAddPage.jsx';
import GroupShopLayout from '../pages/groups/GroupShopLayout.jsx';
import GroupShopPage from '../pages/groups/GroupShopPage.jsx';
import GroupsListPage from '../pages/groups/GroupsListPage.jsx';
import ControlPanelActivityPage from '../pages/groups/control/ControlPanelActivityPage.jsx';
import ControlPanelCurrencyPage from '../pages/groups/control/ControlPanelCurrencyPage.jsx';
import ControlPanelHealthPage from '../pages/groups/control/ControlPanelHealthPage.jsx';
import ControlPanelHomePage from '../pages/groups/control/ControlPanelHomePage.jsx';
import ControlPanelLayout from '../pages/groups/control/ControlPanelLayout.jsx';
import ControlPanelPostsPage from '../pages/groups/control/ControlPanelPostsPage.jsx';
import ControlPanelRanksPage from '../pages/groups/control/ControlPanelRanksPage.jsx';
import ControlPanelShopItemsPage from '../pages/groups/control/ControlPanelShopItemsPage.jsx';
import ControlPanelUsersPage from '../pages/groups/control/ControlPanelUsersPage.jsx';
import GroupActivityListPage from '../pages/groups/main/GroupActivityListPage.jsx';
import GroupMainHomePage from '../pages/groups/main/GroupMainHomePage.jsx';
import GroupMainLayout from '../pages/groups/main/GroupMainLayout.jsx';
import GroupRanksAndBadgesPage from '../pages/groups/main/GroupRanksAndBadgesPage.jsx';
import { groupsListPath } from './pathRegistry.js';

/**
 * Drzewo tras — zsynchronizuj z `routeTable.js` i `shellTemplates.config.js`.
 */
const appRouteTree = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="groups" replace /> },
      { path: 'settings', element: <GroupSettingsPage /> },
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
