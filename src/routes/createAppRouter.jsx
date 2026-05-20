import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
import { RouteGuard } from '../components/guards/index.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';

// Login pages
import LoginShell from '../components/layout/LoginShell.jsx';
import LoginHubPage from '../pages/links/login/LoginHubPage.jsx';
import LoginNikitaPage from '../pages/links/login/LoginNikitaPage.jsx';
import LoginTempPage from '../pages/links/login/LoginTempPage.jsx';

// App-level pages
import ApiTestPage from '../pages/links/dev/ApiTestPage.jsx';
import CourseManagementPage from '../pages/links/app/CourseManagementPage.jsx';
import HelpPage from '../pages/links/app/HelpPage.jsx';
import OrganizationManagementPage from '../pages/links/app/OrganizationManagementPage.jsx';
import SettingsPage from '../pages/links/app/SettingsPage.jsx';
import StatisticsPage from '../pages/links/app/StatisticsPage.jsx';
import UserManagementPage from '../pages/links/app/UserManagementPage.jsx';

// Groups list
import GroupsListPage from '../pages/links/groups/GroupsListPage.jsx';

// Group Main (Ekran główny) - student + lecturer
import GroupMainLayout from '../pages/links/groups/layouts/GroupMainLayout.jsx';
import GroupMainHomePage from '../pages/links/groups/main/GroupMainHomePage.jsx';
import GroupMainActivitiesPage from '../pages/links/groups/main/GroupMainActivitiesPage.jsx';
import GroupMainRanksPage from '../pages/links/groups/main/GroupMainRanksPage.jsx';
import GroupMainBadgesPage from '../pages/links/groups/main/GroupMainBadgesPage.jsx';

// Profile (Profil) - student only
import ProfileLayout from '../pages/links/groups/layouts/ProfileLayout.jsx';
import ProfileHomePage from '../pages/links/groups/profile/ProfileHomePage.jsx';
import ProfileLogPage from '../pages/links/groups/profile/ProfileLogPage.jsx';
import ProfileEqPage from '../pages/links/groups/profile/ProfileEqPage.jsx';

// Members (Użytkownicy) - lecturer only
import MembersLayout from '../pages/links/groups/layouts/MembersLayout.jsx';
import MembersHomePage from '../pages/links/groups/members/MembersHomePage.jsx';
import MembersLogPage from '../pages/links/groups/members/MembersLogPage.jsx';

// Activities (Aktywności) - lecturer only
import ActivitiesLayout from '../pages/links/groups/layouts/ActivitiesLayout.jsx';
import ActivitiesHomePage from '../pages/links/groups/activities/ActivitiesHomePage.jsx';
import ActivitiesToolsPage from '../pages/links/groups/activities/ActivitiesToolsPage.jsx';

// Posts (Wpisy) - lecturer only
import PostsHomePage from '../pages/links/groups/posts/PostsHomePage.jsx';

// Rewards (Systemy nagród) - lecturer only
import RewardsLayout from '../pages/links/groups/layouts/RewardsLayout.jsx';
import RewardsHomePage from '../pages/links/groups/rewards/RewardsHomePage.jsx';
import RewardsBadgesPage from '../pages/links/groups/rewards/RewardsBadgesPage.jsx';
import ShopItemsPage from '../pages/links/groups/rewards/ShopItemsPage.jsx';

// Group Settings (Ustawienia grupy) - lecturer only
import GroupSettingsLayout from '../pages/links/groups/layouts/GroupSettingsLayout.jsx';
import GroupSettingsHomePage from '../pages/links/groups/groupsettings/GroupSettingsHomePage.jsx';
import GroupSettingsCurrencyPage from '../pages/links/groups/groupsettings/GroupSettingsCurrencyPage.jsx';
import GroupSettingsHealthPage from '../pages/links/groups/groupsettings/GroupSettingsHealthPage.jsx';

// Shop (Sklep) - student + lecturer
import GroupShopLayout from '../pages/links/groups/GroupShopLayout.jsx';
import GroupShopPage from '../pages/links/groups/GroupShopPage.jsx';
import GroupShopAddPage from '../pages/links/groups/GroupShopAddPage.jsx';

// Ranking - student + lecturer
import RankingLayout from '../pages/links/groups/layouts/RankingLayout.jsx';
import RankingHomePage from '../pages/links/groups/ranking/RankingHomePage.jsx';
import RankingGroupPage from '../pages/links/groups/ranking/RankingGroupPage.jsx';
import RankingActivitiesPage from '../pages/links/groups/ranking/RankingActivitiesPage.jsx';

import { loginPath } from './pathRegistry.js';

// Helper: wraps element with RouteGuard
function withGuard(element, { requireAuth = true, allowedRoles, redirectTo } = {}) {
  return (
    <RouteGuard requireAuth={requireAuth} allowedRoles={allowedRoles} redirectTo={redirectTo}>
      {element}
    </RouteGuard>
  );
}

// Role constants for guards
const LECTURER_ONLY = [APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN];
const STUDENT_ONLY = [APP_ROLE.STUDENT];
const ALL_AUTHENTICATED = undefined; // no role restriction, just auth

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

      // ========================================
      // LOGIN (public, no auth required)
      // ========================================
      {
        element: <LoginShell />,
        children: [
          { path: 'login', element: <LoginHubPage /> },
          { path: 'logintemp', element: <LoginTempPage /> },
          { path: 'loginnikita', element: <LoginNikitaPage /> },
        ],
      },

      // ========================================
      // APP SHELL (requires auth)
      // ========================================
      {
        element: <AppShell />,
        children: [
          // App-level pages
          { path: 'settings', element: withGuard(<SettingsPage />) },
          { path: 'help', element: withGuard(<HelpPage />) },
          { path: 'userManagement', element: withGuard(<UserManagementPage />, { allowedRoles: [APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN] }) },
          { path: 'courseManagement', element: withGuard(<CourseManagementPage />, { allowedRoles: [APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN] }) },
          { path: 'statistics', element: withGuard(<StatisticsPage />, { allowedRoles: [APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN] }) },
          { path: 'organizations', element: withGuard(<OrganizationManagementPage />, { allowedRoles: [APP_ROLE.SUPERADMIN] }) },

          // ========================================
          // GROUPS
          // ========================================
          {
            path: 'groups',
            children: [
              // Groups list (requires auth)
              { index: true, element: withGuard(<GroupsListPage />) },

              // ========================================
              // GROUP ROUTES (requires groupId)
              // ========================================
              {
                path: ':groupId',
                children: [
                  // Redirect bare groupId to main
                  { index: true, element: <Navigate to="main" replace /> },

                  // ----------------------------------------
                  // MAIN (Ekran główny) - student + lecturer
                  // ----------------------------------------
                  {
                    path: 'main',
                    element: withGuard(<GroupMainLayout />),
                    children: [
                      { index: true, element: <GroupMainHomePage /> },
                      { path: 'activities', element: <GroupMainActivitiesPage /> },
                      { path: 'ranks', element: <GroupMainRanksPage /> },
                      { path: 'badges', element: <GroupMainBadgesPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // PROFILE - student only
                  // ----------------------------------------
                  {
                    path: 'profile',
                    element: withGuard(<ProfileLayout />, { allowedRoles: STUDENT_ONLY }),
                    children: [
                      { index: true, element: <ProfileHomePage /> },
                      { path: 'log', element: <ProfileLogPage /> },
                      { path: 'eq', element: <ProfileEqPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // MEMBERS (Użytkownicy) - lecturer only
                  // ----------------------------------------
                  {
                    path: 'members',
                    element: withGuard(<MembersLayout />, { allowedRoles: LECTURER_ONLY }),
                    children: [
                      { index: true, element: <MembersHomePage /> },
                      { path: 'log', element: <MembersLogPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // ACTIVITIES (Aktywności) - lecturer only
                  // ----------------------------------------
                  {
                    path: 'activities',
                    element: withGuard(<ActivitiesLayout />, { allowedRoles: LECTURER_ONLY }),
                    children: [
                      { index: true, element: <ActivitiesHomePage /> },
                      { path: 'tools', element: <ActivitiesToolsPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // POSTS (Wpisy) - lecturer only
                  // ----------------------------------------
                  {
                    path: 'posts',
                    element: withGuard(<PostsHomePage />, { allowedRoles: LECTURER_ONLY }),
                  },

                  // ----------------------------------------
                  // REWARDS (Systemy nagród) - lecturer only
                  // ----------------------------------------
                  {
                    path: 'rewards',
                    element: withGuard(<RewardsLayout />, { allowedRoles: LECTURER_ONLY }),
                    children: [
                      { index: true, element: <RewardsHomePage /> },
                      { path: 'badges', element: <RewardsBadgesPage /> },
                      { path: 'shopitems', element: <ShopItemsPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // GROUP SETTINGS (Ustawienia grupy) - lecturer only
                  // ----------------------------------------
                  {
                    path: 'groupsettings',
                    element: withGuard(<GroupSettingsLayout />, { allowedRoles: LECTURER_ONLY }),
                    children: [
                      { index: true, element: <GroupSettingsHomePage /> },
                      { path: 'currency', element: <GroupSettingsCurrencyPage /> },
                      { path: 'health', element: <GroupSettingsHealthPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // SHOP (Sklep) - student + lecturer
                  // ----------------------------------------
                  {
                    path: 'shop',
                    element: withGuard(<GroupShopLayout />),
                    children: [
                      { index: true, element: <GroupShopPage /> },
                      // Add product - lecturer only
                      { path: 'add', element: withGuard(<GroupShopAddPage />, { allowedRoles: LECTURER_ONLY }) },
                    ],
                  },

                  // ----------------------------------------
                  // RANKING - student + lecturer
                  // ----------------------------------------
                  {
                    path: 'ranking',
                    element: withGuard(<RankingLayout />),
                    children: [
                      { index: true, element: <RankingHomePage /> },
                      { path: 'group', element: <RankingGroupPage /> },
                      { path: 'activities', element: <RankingActivitiesPage /> },
                    ],
                  },
                ],
              },
            ],
          },

          // Dev pages
          { path: 'api-test', element: <ApiTestPage /> },

          // Catch-all
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
