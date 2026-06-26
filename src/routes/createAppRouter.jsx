import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
import { HomeRedirect, RouteGuard, GroupAccessGuard } from '../components/guards/index.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';

// Login/Auth pages
import AuthShell from '../components/layout/AuthShell.jsx';
import LoginShell from '../components/layout/LoginShell.jsx';
import LoginPage from '../pages/links/auth/LoginPage.jsx';
import LoginMagicPage from '../pages/links/auth/LoginMagicPage.jsx';
import WelcomePage from '../pages/links/auth/WelcomePage.jsx';
import DevApiTestPage from '../pages/links/dev/DevApiTestPage.jsx';

// App-level pages
import CourseManagementPage from '../pages/links/app/CourseManagementPage.jsx';
import HelpPage from '../pages/links/app/HelpPage.jsx';
import OrganizationManagementPage from '../pages/links/app/OrganizationManagementPage.jsx';
import SettingsPage from '../pages/links/app/SettingsPage.jsx';
import StatisticsPage from '../pages/links/app/StatisticsPage.jsx';
import UserManagementPage from '../pages/links/app/UserManagementPage.jsx';

// Templates gallery - lecturer only
import TemplatesLayout from '../pages/links/templates/TemplatesLayout.jsx';
import TemplatesMyPage from '../pages/links/templates/TemplatesMyPage.jsx';
import TemplatesGalleryPage from '../pages/links/templates/TemplatesGalleryPage.jsx';

// Groups list
import GroupsListPage from '../pages/links/groups/groups-list/GroupsListPage.jsx';
import GroupJoinPage from '../pages/links/groups/GroupJoinPage.jsx';

// Group Main (Ekran główny) - student + lecturer
import GroupMainLayout from '../pages/links/groups/layouts/GroupMainLayout.jsx';
import GroupMainHomePage from '../pages/links/groups/main/GroupMainHomePage.jsx';
import GroupMainPostsPage from '../pages/links/groups/main/GroupMainPostsPage.jsx';
import GroupMainMembersPage from '../pages/links/groups/main/GroupMainMembersPage.jsx';
import GroupMainActivitiesPage from '../pages/links/groups/main/GroupMainActivitiesPage.jsx';
import GroupMainRanksPage from '../pages/links/groups/main/GroupMainRanksPage.jsx';
import GroupMainBadgesPage from '../pages/links/groups/main/GroupMainBadgesPage.jsx';

// Profile (Profil) - student only
import ProfileLayout from '../pages/links/groups/layouts/ProfileLayout.jsx';
import ProfileHomePage from '../pages/links/groups/profile/ProfileHomePage.jsx';
import ProfileLogPage from '../pages/links/groups/profile/ProfileLogPage.jsx';
import ProfileEqPage from '../pages/links/groups/profile/ProfileEqPage.jsx';
import StudentProfileViewPage from '../pages/links/groups/student-profile/StudentProfileViewPage.jsx';

// Members (Użytkownicy) - lecturer only
import MembersLayout from '../pages/links/groups/layouts/MembersLayout.jsx';
import MembersHomePage from '../pages/links/groups/members/MembersHomePage.jsx';
import MembersLogPage from '../pages/links/groups/members/MembersLogPage.jsx';
import MembersCodePage from '../pages/links/groups/members/MembersCodePage.jsx';

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
import GroupSettingsHomePage from '../pages/links/groups/group-settings/GroupSettingsHomePage.jsx';
import GroupSettingsCurrencyPage from '../pages/links/groups/group-settings/GroupSettingsCurrencyPage.jsx';
import GroupSettingsHealthPage from '../pages/links/groups/group-settings/GroupSettingsHealthPage.jsx';

// Shop (Sklep) - student + lecturer
import ShopLayout from '../pages/links/groups/shop/ShopLayout.jsx';
import ShopHomePage from '../pages/links/groups/shop/ShopHomePage.jsx';
import ShopAddRedirect from '../pages/links/groups/shop/ShopAddRedirect.jsx';

// Ranking - student + lecturer
import RankingLayout from '../pages/links/groups/layouts/RankingLayout.jsx';
import RankingHomePage from '../pages/links/groups/ranking/RankingHomePage.jsx';
import RankingGroupPage from '../pages/links/groups/ranking/RankingGroupPage.jsx';
import RankingActivitiesPage from '../pages/links/groups/ranking/RankingActivitiesPage.jsx';

import {
  devApiTestPath,
  homePath,
  loginPath,
} from './pathRegistry.js';

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
 * Trasy `login`, `dev/api-test`: layout `LoginShell` (bez paska bocznego).
 */
const appRouteTree = [
  {
    path: '/',
    children: [
      { index: true, element: <HomeRedirect /> },

      // ========================================
      // AUTH PAGES (public, no auth required)
      // ========================================
      {
        element: <AuthShell />,
        children: [
          { path: 'welcome', element: <WelcomePage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'login/magic', element: <LoginMagicPage /> },
          { path: 'login/institution', element: <Navigate to={loginPath()} replace /> },
          { path: 'login/register/eula', element: <Navigate to={loginPath()} replace /> },
          { path: 'login/register', element: <Navigate to={loginPath()} replace /> },
          { path: 'register/eula', element: <Navigate to={loginPath()} replace /> },
          { path: 'register', element: <Navigate to={loginPath()} replace /> },
        ],
      },

      // ========================================
      // DEV PAGES (LoginShell for dev tools)
      // ========================================
      {
        element: <LoginShell />,
        children: [
          { path: 'dev/api-test', element: <DevApiTestPage /> },
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

          {
            path: 'templates',
            element: withGuard(<TemplatesLayout />, { allowedRoles: LECTURER_ONLY }),
            children: [
              { index: true, element: <TemplatesMyPage /> },
              { path: 'gallery', element: <TemplatesGalleryPage /> },
            ],
          },

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
                  // Landing — join code / brak dostępu (bez nawigacji grupowej w sidebarze)
                  { index: true, element: withGuard(<GroupJoinPage />) },

                  // Podstrony grupy — wymagają dostępu (właściciel lub zapisany student)
                  {
                    element: withGuard(<GroupAccessGuard />),
                    children: [
                  // ----------------------------------------
                  // HOME + student flat routes (wspólny layout)
                  // ----------------------------------------
                  {
                    element: withGuard(<GroupMainLayout />),
                    children: [
                      {
                        path: 'home',
                        children: [
                          { index: true, element: <GroupMainHomePage /> },
                        ],
                      },
                      { path: 'posts', element: withGuard(<GroupMainPostsPage />, { allowedRoles: STUDENT_ONLY }) },
                      { path: 'users', element: withGuard(<GroupMainMembersPage />, { allowedRoles: STUDENT_ONLY }) },
                      { path: 'activity-list', element: withGuard(<GroupMainActivitiesPage />, { allowedRoles: STUDENT_ONLY }) },
                      { path: 'ranks', element: withGuard(<GroupMainRanksPage />, { allowedRoles: STUDENT_ONLY }) },
                      { path: 'badges', element: withGuard(<GroupMainBadgesPage />, { allowedRoles: STUDENT_ONLY }) },
                    ],
                  },

                  // ----------------------------------------
                  // STUDENT PROFILE (lecturer view) — ekwipunek uczestnika
                  // ----------------------------------------
                  {
                    path: 'student-profile/:studentId',
                    element: withGuard(<StudentProfileViewPage />, { allowedRoles: LECTURER_ONLY }),
                  },

                  // ----------------------------------------
                  // PROFILE - student only (own profile)
                  // ----------------------------------------
                  {
                    path: 'profile',
                    element: withGuard(<ProfileLayout />, { allowedRoles: STUDENT_ONLY }),
                    children: [
                      { index: true, element: <ProfileHomePage /> },
                      { path: 'activity', element: <ProfileLogPage /> },
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
                      { path: 'codes', element: <MembersCodePage /> },
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
                      { path: 'posts', element: <PostsHomePage /> },
                    ],
                  },

                  // ----------------------------------------
                  // REWARDS (Systemy nagród) - lecturer only
                  // ----------------------------------------
                  {
                    path: 'rewards',
                    element: withGuard(<RewardsLayout />, { allowedRoles: LECTURER_ONLY }),
                    children: [
                      { index: true, element: <RewardsBadgesPage /> },
                      { path: 'ranks', element: <RewardsHomePage /> },
                      { path: 'shop-items', element: <ShopItemsPage /> },
                      { path: 'shopitems', element: <Navigate to="shop-items" replace /> },
                    ],
                  },

                  // ----------------------------------------
                  // GROUP SETTINGS (Ustawienia grupy) - lecturer only
                  // ----------------------------------------
                  {
                    path: 'group-settings',
                    element: withGuard(<GroupSettingsLayout />, { allowedRoles: LECTURER_ONLY }),
                    children: [
                      { index: true, element: <GroupSettingsHomePage /> },
                      { path: 'currency', element: <GroupSettingsCurrencyPage /> },
                      { path: 'lives', element: <GroupSettingsHealthPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // SHOP (Sklep) — student only
                  // ----------------------------------------
                  {
                    path: 'shop',
                    element: withGuard(<ShopLayout />),
                    children: [
                      { index: true, element: <ShopHomePage /> },
                    ],
                  },
                  {
                    path: 'shop/add',
                    element: withGuard(<ShopAddRedirect />, { allowedRoles: LECTURER_ONLY }),
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
            ],
          },

          // Legacy redirect: /api-test -> /dev/api-test
          { path: 'api-test', element: <Navigate to={devApiTestPath()} replace /> },

          // Catch-all: unknown paths → home (session-aware redirect from `/`)
          { path: '*', element: <Navigate to={homePath()} replace /> },
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
