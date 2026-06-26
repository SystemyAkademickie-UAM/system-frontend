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

/** Strona powitalna dla niezalogowanych użytkowników. */
export function welcomePath() {
  return '/welcome';
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

/** Czy ścieżka to ekran dołączania do grupy (wpisanie kodu) — bez podstron. */
export function isGroupJoinPath(pathname) {
  return /^\/groups\/[^/]+\/?$/.test(pathname);
}

// ============================================================================
// GROUP HOME (Strona główna) - student + lecturer
// ============================================================================

/** Strona główna grupy — `/groups/:groupId/home`. */
export function groupMainPath(groupId) {
  return `/groups/${groupId}/home`;
}

/** Profil innego użytkownika — `/groups/:groupId/studentprofile/:studentId`. */
export function groupStudentProfilePath(groupId, studentId) {
  return `/groups/${groupId}/studentprofile/${studentId}`;
}

// ============================================================================
// STUDENT FLAT ROUTES (poza /home — osobne pozycje w sidebarze)
// ============================================================================

/** Wpisy studenta — `/groups/:groupId/posts`. */
export function groupStudentPostsPath(groupId) {
  return `/groups/${groupId}/posts`;
}

/** Uczestnicy studenta — `/groups/:groupId/users`. */
export function groupStudentUsersPath(groupId) {
  return `/groups/${groupId}/users`;
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

/** Dziennik aktywności profilu — `/groups/:groupId/profile/activity`. */
export function groupProfileActivityPath(groupId) {
  return `/groups/${groupId}/profile/activity`;
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

/** Kody dostępu — `/groups/:groupId/members/codes`. */
export function groupMembersCodesPath(groupId) {
  return `/groups/${groupId}/members/codes`;
}

// ============================================================================
// ACTIVITIES (Aktywności / Etapy) - lecturer only
// ============================================================================

/** Aktywności / Etapy — `/groups/:groupId/activities`. */
export function groupActivitiesPath(groupId) {
  return `/groups/${groupId}/activities`;
}

/** Raporty aktywności — `/groups/:groupId/activities/tools`. */
export function groupActivitiesToolsPath(groupId) {
  return `/groups/${groupId}/activities/tools`;
}

// ============================================================================
// POSTS (Wpisy) - lecturer only
// ============================================================================

/** Wpisy prowadzącego — `/groups/:groupId/activities/posts`. */
export function groupPostsPath(groupId) {
  return `/groups/${groupId}/activities/posts`;
}

// ============================================================================
// REWARDS (Systemy nagród) - lecturer only
// ============================================================================

/** Systemy nagród / Odznaki (index) — `/groups/:groupId/rewards`. */
export function groupRewardsPath(groupId) {
  return `/groups/${groupId}/rewards`;
}

/** Rangi — `/groups/:groupId/rewards/ranks`. */
export function groupRewardsRanksPath(groupId) {
  return `/groups/${groupId}/rewards/ranks`;
}

/** Przedmioty sklepowe — `/groups/:groupId/rewards/shop-items`. */
export function groupShopItemsPath(groupId) {
  return `/groups/${groupId}/rewards/shop-items`;
}

// ============================================================================
// GROUP SETTINGS (Ustawienia grupy) - lecturer only
// ============================================================================

/** Ustawienia grupy / Kreator — `/groups/:groupId/group-settings`. */
export function groupSettingsPath(groupId) {
  return `/groups/${groupId}/group-settings`;
}

/** Waluta — `/groups/:groupId/group-settings/currency`. */
export function groupSettingsCurrencyPath(groupId) {
  return `/groups/${groupId}/group-settings/currency`;
}

/** System żyć — `/groups/:groupId/group-settings/lives`. */
export function groupSettingsHealthPath(groupId) {
  return `/groups/${groupId}/group-settings/lives`;
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

/** Galeria szablonów — `/templates`. */
export function templatesPath() {
  return '/templates';
}

/** Publiczna galeria szablonów — `/templates/gallery`. */
export function templatesGalleryPath() {
  return '/templates/gallery';
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

/** @deprecated Use groupStudentRanksPath */
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
