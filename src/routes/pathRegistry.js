/**
 * Centralne budowanie ścieżek URL (wspólne dla Sidebara, linków i testów).
 * Pełne ścieżki absolutne w obrębie aplikacji (bez domeny — zgodnie z React Router).
 */

// ============================================================================
// LOGIN / AUTH
// ============================================================================

export function loginPath() {
  return '/login';
}

export function loginTempPath() {
  return '/logintemp';
}

export function loginNikitaPath() {
  return '/loginnikita';
}

// ============================================================================
// GROUPS LIST
// ============================================================================

export function groupsListPath() {
  return '/groups';
}

// ============================================================================
// GROUP MAIN (Ekran główny) - student + lecturer
// ============================================================================

/** Ekran główny grupy — `/groups/:groupId/main`. */
export function groupMainPath(groupId) {
  return `/groups/${groupId}/main`;
}

/** Lista aktywności — `/groups/:groupId/main/activities`. */
export function groupMainActivitiesPath(groupId) {
  return `/groups/${groupId}/main/activities`;
}

/** Rangi — `/groups/:groupId/main/ranks`. */
export function groupMainRanksPath(groupId) {
  return `/groups/${groupId}/main/ranks`;
}

/** Odznaki — `/groups/:groupId/main/badges`. */
export function groupMainBadgesPath(groupId) {
  return `/groups/${groupId}/main/badges`;
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

/** System żyć — `/groups/:groupId/groupsettings/health`. */
export function groupSettingsHealthPath(groupId) {
  return `/groups/${groupId}/groupsettings/health`;
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

/** Developer-only API test page. */
export function apiTestPath() {
  return '/api-test';
}

// ============================================================================
// LEGACY / DEPRECATED (do usunięcia po migracji)
// ============================================================================

/** @deprecated Use groupMainPath instead */
export function groupActivityPath(groupId) {
  return `/groups/${groupId}/activity`;
}

/** @deprecated Use groupMainRanksPath instead */
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
