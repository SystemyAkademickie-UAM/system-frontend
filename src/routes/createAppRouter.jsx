import { Navigate, createBrowserRouter, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
import { HomeRedirect, RouteGuard, GroupAccessGuard } from '../components/guards/index.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import { useAppRole } from '../context/AppRoleContext.jsx';

// Login/Auth pages
import AuthShell from '../components/layout/AuthShell.jsx';
import LoginShell from '../components/layout/LoginShell.jsx';
import LoginPage from '../pages/links/auth/LoginPage.jsx';
import DevApiTestPage from '../pages/links/dev/DevApiTestPage.jsx';

// App-level pages
import CourseManagementPage from '../pages/links/app/CourseManagementPage.jsx';
import HelpPage from '../pages/links/app/HelpPage.jsx';
import OrganizationManagementPage from '../pages/links/app/OrganizationManagementPage.jsx';
import SettingsPage from '../pages/links/app/SettingsPage.jsx';
import StatisticsPage from '../pages/links/app/StatisticsPage.jsx';
import UserManagementPage from '../pages/links/app/UserManagementPage.jsx';

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
import StudentProfileLayout from '../pages/links/groups/layouts/StudentProfileLayout.jsx';
import StudentProfileHomePage from '../pages/links/groups/student-profile/StudentProfileHomePage.jsx';
import StudentProfileLogPage from '../pages/links/groups/student-profile/StudentProfileLogPage.jsx';
import StudentProfileEqPage from '../pages/links/groups/student-profile/StudentProfileEqPage.jsx';

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
import PostsLayout from '../pages/links/groups/layouts/PostsLayout.jsx';
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
import ShopAddPage from '../pages/links/groups/shop/ShopAddPage.jsx';

// Ranking - student + lecturer
import RankingLayout from '../pages/links/groups/layouts/RankingLayout.jsx';
import RankingHomePage from '../pages/links/groups/ranking/RankingHomePage.jsx';
import RankingGroupPage from '../pages/links/groups/ranking/RankingGroupPage.jsx';
import RankingActivitiesPage from '../pages/links/groups/ranking/RankingActivitiesPage.jsx';

import {
  devApiTestPath,
  groupActivitiesPath,
  groupMainBadgesPath,
  groupMainPath,
  groupMainRanksPath,
  groupMembersPath,
  groupPostsPath,
  groupSettingsHealthPath,
  groupStudentActivityListPath,
  groupStudentBadgesPath,
  groupStudentFeedPath,
  groupStudentParticipantsPath,
  groupStudentRanksPath,
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

/** Przekierowanie ze starszych ścieżek grupowych. */
function GroupLegacyPathRedirect({ buildPath }) {
  const { groupId } = useParams();
  return <Navigate to={buildPath(groupId)} replace />;
}

/** Na `/home/*` student trafia na płaską trasę; prowadzący — na docelową sekcję. */
function withMainSubpageRedirect(buildFlatPath, PageComponent, buildLecturerPath = null) {
  return function MainSubpageRoute() {
    const { role } = useAppRole();
    const { groupId } = useParams();
    if (role === APP_ROLE.STUDENT) {
      return <Navigate to={buildFlatPath(groupId)} replace />;
    }
    if (buildLecturerPath) {
      return <Navigate to={buildLecturerPath(groupId)} replace />;
    }
    return <PageComponent />;
  };
}

const LecturerMainPostsPage = withMainSubpageRedirect(
  groupStudentFeedPath,
  GroupMainPostsPage,
  groupPostsPath,
);
const LecturerMainMembersPage = withMainSubpageRedirect(
  groupStudentParticipantsPath,
  GroupMainMembersPage,
  groupMembersPath,
);
const LecturerMainActivitiesPage = withMainSubpageRedirect(
  groupStudentActivityListPath,
  GroupMainActivitiesPage,
  groupActivitiesPath,
);
const LecturerMainRanksPage = withMainSubpageRedirect(groupStudentRanksPath, GroupMainRanksPage);
const LecturerMainBadgesPage = withMainSubpageRedirect(groupStudentBadgesPath, GroupMainBadgesPage);

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
          { path: 'login', element: <LoginPage /> },
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

                  // Legacy — `/activity` → `/activity-list`
                  {
                    path: 'activity',
                    element: <GroupLegacyPathRedirect buildPath={groupStudentActivityListPath} />,
                  },

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
                          { path: 'posts', element: <LecturerMainPostsPage /> },
                          { path: 'members', element: <LecturerMainMembersPage /> },
                          { path: 'activities', element: <LecturerMainActivitiesPage /> },
                          { path: 'ranks', element: <LecturerMainRanksPage /> },
                          { path: 'badges', element: <LecturerMainBadgesPage /> },
                        ],
                      },
                      // Legacy — `/main` → `/home`
                      {
                        path: 'main',
                        children: [
                          { index: true, element: <GroupLegacyPathRedirect buildPath={groupMainPath} /> },
                          { path: 'posts', element: <GroupLegacyPathRedirect buildPath={groupPostsPath} /> },
                          { path: 'members', element: <GroupLegacyPathRedirect buildPath={groupMembersPath} /> },
                          { path: 'activities', element: <GroupLegacyPathRedirect buildPath={groupActivitiesPath} /> },
                          { path: 'ranks', element: <GroupLegacyPathRedirect buildPath={groupMainRanksPath} /> },
                          { path: 'badges', element: <GroupLegacyPathRedirect buildPath={groupMainBadgesPath} /> },
                        ],
                      },
                      { path: 'feed', element: <GroupMainPostsPage /> },
                      { path: 'participants', element: <GroupMainMembersPage /> },
                      { path: 'activity-list', element: <GroupMainActivitiesPage /> },
                      { path: 'ranks', element: <GroupMainRanksPage /> },
                      { path: 'badges', element: <GroupMainBadgesPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // STUDENT PROFILE (view other user) - any member
                  // ----------------------------------------
                  {
                    path: 'studentprofile/:studentId',
                    element: withGuard(<StudentProfileLayout />),
                    children: [
                      { index: true, element: <StudentProfileHomePage /> },
                      { path: 'log', element: <StudentProfileLogPage /> },
                      { path: 'eq', element: <StudentProfileEqPage /> },
                    ],
                  },

                  // ----------------------------------------
                  // PROFILE - student only (own profile)
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
                      { path: 'code', element: <MembersCodePage /> },
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
                    element: withGuard(<PostsLayout />, { allowedRoles: LECTURER_ONLY }),
                    children: [
                      { index: true, element: <PostsHomePage /> },
                    ],
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
                      { path: 'lives', element: <GroupSettingsHealthPage /> },
                      { path: 'health', element: <GroupLegacyPathRedirect buildPath={groupSettingsHealthPath} /> },
                    ],
                  },

                  // ----------------------------------------
                  // SHOP PREVIEW (lecturer — widok studenta)
                  // ----------------------------------------
                  {
                    path: 'preview',
                    children: [
                      {
                        path: 'shop',
                        element: withGuard(<ShopLayout />, { allowedRoles: LECTURER_ONLY }),
                        children: [{ index: true, element: <ShopHomePage /> }],
                      },
                    ],
                  },

                  // ----------------------------------------
                  // SHOP (Sklep) - student + lecturer
                  // ----------------------------------------
                  {
                    path: 'shop',
                    element: withGuard(<ShopLayout />),
                    children: [
                      { index: true, element: <ShopHomePage /> },
                      // Add product - lecturer only
                      { path: 'add', element: withGuard(<ShopAddPage />, { allowedRoles: LECTURER_ONLY }) },
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
