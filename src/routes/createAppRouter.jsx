/**
 * @file createAppRouter.jsx
 * @description Konfiguracja routingu i definicja powiązań tras dla createAppRouter.
 */

// === IMPORTY I KONFIGURACJA TRAS ===
import { Suspense, lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
import AuthShell from '../components/layout/AuthShell.jsx';
import LoginShell from '../components/layout/LoginShell.jsx';
import { LoadingSpinner } from '../components/ui/index.js';
import {
  GroupAccessGuard,
  GroupOwnerGuard,
  HomeRedirect,
  RankingDisabledRedirect,
  RouteGuard,
} from '../components/guards/index.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import {
  devApiTestPath,
  homePath,
  loginPath,
  templatesPath,
} from './pathRegistry.js';
import {
  GroupBannerLayout,
  GroupMainLayout,
  GroupShopRedirect,
  GroupSimpleLayout,
} from '../pages/groups/group-shared/GroupLayouts.jsx';
import TemplatesPageLayout from '../pages/templates/TemplatesPageLayout.jsx';

function withLazy(factory) {
  const Component = lazy(factory);
  return function LazyPageWrapper(props) {
    return (
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

function withGuard(element, { requireAuth = true, allowedRoles, redirectTo } = {}) {
  return (
    <RouteGuard requireAuth={requireAuth} allowedRoles={allowedRoles} redirectTo={redirectTo}>
      {element}
    </RouteGuard>
  );
}

const LECTURER_ONLY = [APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN];
const STUDENT_ONLY = [APP_ROLE.STUDENT];

const LoginPage = withLazy(() => import('../pages/auth/LoginPage.jsx'));
const LoginMagicPage = withLazy(() => import('../pages/auth/LoginMagicPage.jsx'));
const WelcomePage = withLazy(() => import('../pages/auth/WelcomePage.jsx'));
const DevApiTestPage = withLazy(() => import('../pages/api-test/DevApiTestPage.jsx'));

const CourseManagementPage = withLazy(() => import('../pages/course-management/CourseManagementContent.jsx'));
const HelpPage = withLazy(() => import('../pages/help/HelpContent.jsx'));
const FaqPage = withLazy(() => import('../pages/faq/FaqContent.jsx'));
const PatchNotesPage = withLazy(() => import('../pages/patch-notes/PatchNotesContent.jsx'));
const AdminHomePage = withLazy(() => import('../pages/admin-home/AdminHomeContent.jsx'));
const DiskSpacePage = withLazy(() => import('../pages/disk-space/DiskSpaceContent.jsx'));
const DocumentsPage = withLazy(() => import('../pages/documents/DocumentsContent.jsx'));
const BroadcastsPage = withLazy(() => import('../pages/broadcasts/BroadcastsContent.jsx'));
const OrganizationManagementPage = withLazy(() => import('../pages/organization-management/OrganizationManagementContent.jsx'));
const SuperadminLogsPage = withLazy(() => import('../pages/superadmin-logs/SuperadminLogsContent.jsx'));
const AdminBackupPage = withLazy(() => import('../pages/admin-backup/AdminBackupContent.jsx'));
const SettingsPage = withLazy(() => import('../pages/settings/SettingsContent.jsx'));
const StatisticsPage = withLazy(() => import('../pages/statistics/StatisticsContent.jsx'));
const UserManagementPage = withLazy(() => import('../pages/user-management/UserManagementContent.jsx'));

const TemplatesMyPage = withLazy(() => import('../pages/templates/TemplatesMyContent.jsx'));
const TemplatesGalleryPage = withLazy(() => import('../pages/templates/TemplatesGalleryContent.jsx'));

const GroupsListPage = withLazy(() => import('../pages/groups/groups-list/GroupsListContent.jsx'));
const GroupJoinPage = withLazy(() => import('../pages/groups/group-join/GroupJoinContent.jsx'));

const GroupMainHomePage = withLazy(() => import('../pages/groups/group-main/GroupMainHomeContent.jsx'));
const GroupMainPostsPage = withLazy(() => import('../pages/groups/group-main/GroupMainPostsContent.jsx'));
const GroupMainMembersPage = withLazy(() => import('../pages/groups/group-main/GroupMainMembersContent.jsx'));
const GroupMainActivitiesPage = withLazy(() => import('../pages/groups/group-main-activities/GroupMainActivitiesContent.jsx'));
const GroupMainRanksPage = withLazy(() => import('../pages/groups/group-main-ranks/GroupMainRanksContent.jsx'));
const GroupMainBadgesPage = withLazy(() => import('../pages/groups/group-main-badges/GroupMainBadgesContent.jsx'));

const ProfileHomePage = withLazy(() => import('../pages/groups/group-profile/ProfileHomeContent.jsx'));
const ProfileLogPage = withLazy(() => import('../pages/groups/group-profile-log/ProfileLogContent.jsx'));
const ProfileEqPage = withLazy(() => import('../pages/groups/group-profile-eq/ProfileEqContent.jsx'));
const ProfilePurchasesPage = withLazy(() => import('../pages/groups/group-profile-purchases/ProfilePurchasesContent.jsx'));

const MembersHomePage = withLazy(() => import('../pages/groups/group-members/MembersHomeContent.jsx'));
const MembersLogPage = withLazy(() => import('../pages/groups/group-members-log/MembersLogContent.jsx'));
const MembersCodePage = withLazy(() => import('../pages/groups/group-members-code/MembersCodeContent.jsx'));

const ActivitiesHomePage = withLazy(() => import('../pages/groups/group-activities/ActivitiesHomeContent.jsx'));
const ActivitiesToolsPage = withLazy(() => import('../pages/groups/group-activities-tools/ActivitiesToolsContent.jsx'));
const PostsHomePage = withLazy(() => import('../pages/groups/group-posts/PostsHomeContent.jsx'));

const RewardsHomePage = withLazy(() => import('../pages/groups/group-rewards/RewardsHomeContent.jsx'));

// === DEFINICJE ŚCIEŻEK I STRAŻNICY ===
const RewardsBadgesPage = withLazy(() => import('../pages/groups/group-rewards-badges/RewardsBadgesContent.jsx'));
const ShopItemsPage = withLazy(() => import('../pages/groups/group-rewards-shopitems/RewardsShopItemsContent.jsx'));

const GroupSettingsHomePage = withLazy(() => import('../pages/groups/group-settings/GroupSettingsHomeContent.jsx'));
const GroupSettingsCurrencyPage = withLazy(() => import('../pages/groups/group-settings-currency/GroupSettingsCurrencyContent.jsx'));
const GroupSettingsHealthPage = withLazy(() => import('../pages/groups/group-settings-health/GroupSettingsHealthContent.jsx'));

const ShopHomePage = withLazy(() => import('../pages/groups/group-shop/GroupShopContent.jsx'));

// === EKSPORTY I REJESTRACJA ===
const ShopAddPage = withLazy(() => import('../pages/groups/group-shop-add/GroupShopAddContent.jsx'));

const appRouteTree = [
  {
    path: '/',
    children: [
      { index: true, element: <HomeRedirect /> },
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
      {
        element: <LoginShell />,
        children: [
          { path: 'dev/api-test', element: <DevApiTestPage /> },
        ],
      },
      {
        element: withGuard(<AppShell />),
        children: [
          { path: 'settings', element: withGuard(<SettingsPage />) },
          { path: 'help', element: withGuard(<HelpPage />) },
          { path: 'faq', element: withGuard(<FaqPage />) },
          { path: 'patch-notes', element: withGuard(<PatchNotesPage />) },

          { path: 'home', element: withGuard(<AdminHomePage />, { allowedRoles: [APP_ROLE.ADMIN] }) },
          { path: 'users', element: withGuard(<UserManagementPage />, { allowedRoles: [APP_ROLE.ADMIN] }) },
          { path: 'userManagement', element: <Navigate to="/users" replace /> },
          { path: 'courseManagement', element: <Navigate to="/groups" replace /> },
          { path: 'disk-space', element: withGuard(<DiskSpacePage />, { allowedRoles: [APP_ROLE.ADMIN] }) },
          { path: 'statistics', element: withGuard(<StatisticsPage />, { allowedRoles: [APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN] }) },

          { path: 'organizations', element: withGuard(<OrganizationManagementPage />, { allowedRoles: [APP_ROLE.SUPERADMIN] }) },
          { path: 'backups', element: withGuard(<AdminBackupPage />, { allowedRoles: [APP_ROLE.SUPERADMIN] }) },
          { path: 'admin/backup', element: <Navigate to="/backups" replace /> },
          { path: 'documents', element: withGuard(<DocumentsPage />, { allowedRoles: [APP_ROLE.SUPERADMIN] }) },
          { path: 'broadcasts', element: withGuard(<BroadcastsPage />, { allowedRoles: [APP_ROLE.SUPERADMIN] }) },
          { path: 'boardcasts', element: <Navigate to="/broadcasts" replace /> },
          { path: 'logs', element: withGuard(<SuperadminLogsPage />, { allowedRoles: [APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN] }) },
          { path: 'system-logs', element: <Navigate to="/logs" replace /> },
          {
            path: 'templates',
            element: withGuard(<TemplatesPageLayout />, { allowedRoles: LECTURER_ONLY }),
            children: [
              { index: true, element: <TemplatesGalleryPage /> },
              { path: 'my', element: <TemplatesMyPage /> },
              { path: 'gallery', element: <Navigate to={templatesPath()} replace /> },
            ],
          },
          {
            path: 'groups',
            children: [
              { index: true, element: withGuard(<GroupsListPage />) },
              {
                path: ':groupId',
                children: [
                  { index: true, element: withGuard(<GroupJoinPage />) },
                  {
                    element: withGuard(<GroupAccessGuard />),
                    children: [
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
                      {
                        element: withGuard(<GroupOwnerGuard />),
                        children: [
                          {
                            path: 'student-profile/:studentId',
                            element: withGuard(<GroupSimpleLayout />, { allowedRoles: LECTURER_ONLY }),
                            children: [
                              { index: true, element: <ProfileHomePage /> },
                              { path: 'activity', element: <Navigate to="." replace /> },
                              { path: 'eq', element: <ProfileEqPage /> },
                              { path: 'purchases', element: <ProfilePurchasesPage /> },
                            ],
                          },
                          {
                            path: 'members',
                            element: withGuard(<GroupSimpleLayout />, { allowedRoles: LECTURER_ONLY }),
                            children: [
                              { index: true, element: <MembersHomePage /> },
                              { path: 'codes', element: <MembersCodePage /> },
                              { path: 'log', element: <MembersLogPage /> },
                            ],
                          },
                          {
                            path: 'activities',
                            element: withGuard(<GroupSimpleLayout />, { allowedRoles: LECTURER_ONLY }),
                            children: [
                              { index: true, element: <ActivitiesHomePage /> },
                              { path: 'tools', element: <ActivitiesToolsPage /> },
                              { path: 'posts', element: <PostsHomePage /> },
                            ],
                          },
                          {
                            path: 'rewards',
                            element: withGuard(<GroupSimpleLayout />, { allowedRoles: LECTURER_ONLY }),
                            children: [
                              { index: true, element: <RewardsBadgesPage /> },
                              { path: 'ranks', element: <RewardsHomePage /> },
                              { path: 'shop-items', element: <ShopItemsPage /> },
                              { path: 'shopitems', element: <Navigate to="shop-items" replace /> },
                            ],
                          },
                          {
                            path: 'group-settings',
                            element: withGuard(<GroupSimpleLayout />, { allowedRoles: LECTURER_ONLY }),
                            children: [
                              { index: true, element: <GroupSettingsHomePage /> },
                              { path: 'currency', element: <GroupSettingsCurrencyPage /> },
                              { path: 'lives', element: <GroupSettingsHealthPage /> },
                            ],
                          },
                          {
                            path: 'shop/add',
                            element: withGuard(<ShopAddPage />, { allowedRoles: LECTURER_ONLY }),
                          },
                          {
                            path: 'shop/add/*',
                            element: withGuard(<GroupShopRedirect />, { allowedRoles: LECTURER_ONLY }),
                          },
                        ],
                      },
                      {
                        path: 'profile',
                        element: withGuard(<GroupSimpleLayout />, { allowedRoles: STUDENT_ONLY }),
                        children: [
                          { index: true, element: <ProfileLogPage /> },
                          { path: 'activity', element: <ProfileHomePage /> },
                          { path: 'eq', element: <ProfileEqPage /> },
                          { path: 'purchases', element: <ProfilePurchasesPage /> },
                        ],
                      },
                      {
                        path: 'shop',
                        element: withGuard(<GroupBannerLayout />),
                        children: [
                          { index: true, element: <ShopHomePage /> },
                        ],
                      },
                      {
                        path: 'ranking/*',
                        element: withGuard(<RankingDisabledRedirect />),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { path: 'api-test', element: <Navigate to={devApiTestPath()} replace /> },
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
