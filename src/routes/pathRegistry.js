/**
 * Centralne budowanie ścieżek URL (wspólne dla Sidebara, linków i testów).
 * Pełne ścieżki absolutne w obrębie aplikacji (bez domeny — zgodnie z React Router).
 */

// ============================================================================
// LOGIN / AUTH
// ============================================================================

export function homePath() {
  return '/';
}

export function loginPath() {
  return '/login';
}

/** Magic link landing route (`?token=` from email). */
export function loginMagicPath() {
  return '/login/magic';
}

/** @deprecated All auth wizard steps live on `/login` (in-page state). */
export function loginInstitutionPath() {
  return loginPath();
}

/** @deprecated All auth wizard steps live on `/login` (in-page state). */
export function registerPath() {
  return loginPath();
}

/** @deprecated All auth wizard steps live on `/login` (in-page state). */
export function registerEulaPath() {
  return loginPath();
}

// ============================================================================
// GROUPS LIST
// ============================================================================

export function groupsListPath() {
  return '/groups';
}

// ============================================================================
// GROUP ROOT
// ============================================================================

/** Korzeń grupy — `/groups/:groupId`. */
export function groupRootPath(groupId) {
  return `/groups/${groupId}`;
}

// ============================================================================
// GROUP HOME (Strona główna) - student + lecturer
// ============================================================================

/** Strona główna grupy — `/groups/:groupId/home`. */
export function groupMainPath(groupId) {
  return `/groups/${groupId}/home`;
}

/** Wpisy na stronie głównej (legacy redirect) — `/groups/:groupId/home/posts`. */
export function groupMainPostsPath(groupId) {
  return `/groups/${groupId}/home/posts`;
}

/** Uczestnicy na stronie głównej (legacy redirect) — `/groups/:groupId/home/members`. */
export function groupMainMembersPath(groupId) {
  return `/groups/${groupId}/home/members`;
}

/** Profil innego użytkownika — `/groups/:groupId/studentprofile/:studentId`. */
export function groupStudentProfilePath(groupId, studentId) {
  return `/groups/${groupId}/studentprofile/${studentId}`;
}

/** Lista aktywności na stronie głównej (legacy redirect) — `/groups/:groupId/home/activities`. */
export function groupMainActivitiesPath(groupId) {
  return `/groups/${groupId}/home/activities`;
}

/** Rangi w podglądzie studenta (prowadzący) — `/groups/:groupId/home/ranks`. */
export function groupMainRanksPath(groupId) {
  return `/groups/${groupId}/home/ranks`;
}

/** Odznaki w podglądzie studenta (prowadzący) — `/groups/:groupId/home/badges`. */
export function groupMainBadgesPath(groupId) {
  return `/groups/${groupId}/home/badges`;
}

// ============================================================================
// STUDENT FLAT ROUTES (poza /home — osobne pozycje w sidebarze)
// ============================================================================

/** Wpisy studenta — `/groups/:groupId/feed` (`/posts` zajęte przez panel prowadzącego). */
export function groupStudentFeedPath(groupId) {
  return `/groups/${groupId}/feed`;
}

/** Uczestnicy studenta — `/groups/:groupId/participants` (`/members` zajęte). */
export function groupStudentParticipantsPath(groupId) {
  return `/groups/${groupId}/participants`;
}

/** Lista aktywności studenta — `/groups/:groupId/activity-list` (`/activities` zajęte). */
export function groupStudentActivityListPath(groupId) {
  return `/groups/${groupId}/activity-list`;
}

/** Rangi studenta — `/groups/:groupId/ranks`. */
export function groupStudentRanksPath(groupId) {
  return `/groups/${groupId}/ranks`;
}

/** Odznaki studenta — `/groups/:groupId/badges`. */
export function groupStudentBadgesPath(groupId) {
  return `/groups/${groupId}/badges`;
}

// ============================================================================
// PROFILE (Profil) - student only
// ============================================================================

/** Profil studenta — `/groups/:groupId/profile`. */
export function groupProfilePath(groupId) {
  return `/groups/${groupId}/profile`;
}

/** Log aktywności profilu — `/groups/:groupId/profile/log`. */
export function groupProfileLogPath(groupId) {
  return `/groups/${groupId}/profile/log`;
}

/** Ekwipunek — `/groups/:groupId/profile/eq`. */
export function groupProfileEqPath(groupId) {
  return `/groups/${groupId}/profile/eq`;
}

// ============================================================================
// MEMBERS (Użytkownicy) - lecturer only
// ============================================================================

/** Użytkownicy grupy — `/groups/:groupId/members`. */
export function groupMembersPath(groupId) {
  return `/groups/${groupId}/members`;
}

/** Log aktywności użytkowników — `/groups/:groupId/members/log`. */
export function groupMembersLogPath(groupId) {
  return `/groups/${groupId}/members/log`;
}

/** Kody dostępu — `/groups/:groupId/members/code`. */
export function groupMembersCodePath(groupId) {
  return `/groups/${groupId}/members/code`;
}

// ============================================================================
// ACTIVITIES (Aktywności / Etapy) - lecturer only
// ============================================================================

/** Aktywności / Etapy — `/groups/:groupId/activities`. */
export function groupActivitiesPath(groupId) {
  return `/groups/${groupId}/activities`;
}

/** Narzędzia aktywności — `/groups/:groupId/activities/tools`. */
export function groupActivitiesToolsPath(groupId) {
  return `/groups/${groupId}/activities/tools`;
}

// ============================================================================
// POSTS (Wpisy) - lecturer only
// ============================================================================

/** Wpisy — `/groups/:groupId/posts`. */
export function groupPostsPath(groupId) {
  return `/groups/${groupId}/posts`;
}

// ============================================================================
// REWARDS (Systemy nagród) - lecturer only
// ============================================================================

/** Systemy nagród / Rangi — `/groups/:groupId/rewards`. */
export function groupRewardsPath(groupId) {
  return `/groups/${groupId}/rewards`;
}

/** Odznaki — `/groups/:groupId/rewards/badges`. */
export function groupRewardsBadgesPath(groupId) {
  return `/groups/${groupId}/rewards/badges`;
}

/** Przedmioty sklepowe — `/groups/:groupId/rewards/shopitems`. */
export function groupShopItemsPath(groupId) {
  return `/groups/${groupId}/rewards/shopitems`;
}

// ============================================================================
// GROUP SETTINGS (Ustawienia grupy) - lecturer only
// ============================================================================

/** Ustawienia grupy / Kreator — `/groups/:groupId/groupsettings`. */
export function groupSettingsPath(groupId) {
  return `/groups/${groupId}/groupsettings`;
}

/** Waluta — `/groups/:groupId/groupsettings/currency`. */
export function groupSettingsCurrencyPath(groupId) {
  return `/groups/${groupId}/groupsettings/currency`;
}

/** System żyć — `/groups/:groupId/groupsettings/lives`. */
export function groupSettingsHealthPath(groupId) {
  return `/groups/${groupId}/groupsettings/lives`;
}

// ============================================================================
// SHOP (Sklep) - student + lecturer
// ============================================================================

/** Sklep — `/groups/:groupId/shop`. */
export function groupShopPath(groupId) {
  return `/groups/${groupId}/shop`;
}

/** Dodaj produkt (lecturer) — `/groups/:groupId/shop/add`. */
export function groupShopAddPath(groupId) {
  return `/groups/${groupId}/shop/add`;
}

/** Podgląd sklepu studenta (lecturer) — `/groups/:groupId/preview/shop`. */
export function groupShopPreviewPath(groupId) {
  return `/groups/${groupId}/preview/shop`;
}

// ============================================================================
// RANKING - student + lecturer
// ============================================================================

/** Ranking — `/groups/:groupId/ranking`. */
export function groupRankingPath(groupId) {
  return `/groups/${groupId}/ranking`;
}

/** Ranking grupy — `/groups/:groupId/ranking/group`. */
export function groupRankingGroupPath(groupId) {
  return `/groups/${groupId}/ranking/group`;
}

/** Ranking aktywności — `/groups/:groupId/ranking/activities`. */
export function groupRankingActivitiesPath(groupId) {
  return `/groups/${groupId}/ranking/activities`;
}

// ============================================================================
// APP-LEVEL (settings, help, admin)
// ============================================================================

export function appSettingsPath() {
  return '/settings';
}

export function appHelpPath() {
  return '/help';
}

export function userManagementPath() {
  return '/userManagement';
}

export function courseManagementPath() {
  return '/courseManagement';
}

export function statisticsPath() {
  return '/statistics';
}

export function organizationsPath() {
  return '/organizations';
}

// ============================================================================
// DEV
// ============================================================================

/** Developer-only API test workspace (Login shell). */
export function devApiTestPath() {
  return '/dev/api-test';
}

/** @deprecated Use {@link devApiTestPath}. Kept for older links. */
export function apiTestPath() {
  return devApiTestPath();
}

// ============================================================================
// LEGACY / DEPRECATED (do usunięcia po migracji)
// ============================================================================

/** @deprecated Use groupMainPath instead */
export function groupActivityPath(groupId) {
  return `/groups/${groupId}/activity`;
}

/** @deprecated Use groupStudentRanksPath for student, groupMainRanksPath for lecturer */
export function groupRanksPath(groupId) {
  return `/groups/${groupId}/ranks`;
}

/** @deprecated Use groupSettingsPath instead */
export function groupControlPath(groupId) {
  return `/groups/${groupId}/control`;
}

/** @deprecated */
export function groupControlUsersPath(groupId) {
  return `/groups/${groupId}/control/users`;
}

/** @deprecated */
export function groupControlActivityPath(groupId) {
  return `/groups/${groupId}/control/activity`;
}

/** @deprecated */
export function groupControlPostsPath(groupId) {
  return `/groups/${groupId}/control/posts`;
}

/** @deprecated */
export function groupControlRanksPath(groupId) {
  return `/groups/${groupId}/control/ranks`;
}

/** @deprecated */
export function groupControlShopItemsPath(groupId) {
  return `/groups/${groupId}/control/shopitems`;
}

/** @deprecated */
export function groupControlCurrencyPath(groupId) {
  return `/groups/${groupId}/control/currency`;
}

/** @deprecated */
export function groupControlHealthPath(groupId) {
  return `/groups/${groupId}/control/health`;
}
