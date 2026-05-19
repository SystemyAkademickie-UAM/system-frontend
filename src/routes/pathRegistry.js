/**
 * Centralne budowanie ścieżek URL (wspólne dla Sidebara, linków i testów).
 * Pełne ścieżki absolutne w obrębie aplikacji (bez domeny — zgodnie z React Router).
 */

export function loginPath() {
  return '/login';
}

export function loginTempPath() {
  return '/logintemp';
}

export function loginNikitaPath() {
  return '/loginnikita';
}

export function groupsListPath() {
  return '/groups';
}

/** Ekran główny grupy — `/groups/:groupId`. */
export function groupMainPath(groupId) {
  return `/groups/${groupId}`;
}

export function groupActivityPath(groupId) {
  return `/groups/${groupId}/activity`;
}

export function groupRanksPath(groupId) {
  return `/groups/${groupId}/ranks`;
}

export function groupProfilePath(groupId) {
  return `/groups/${groupId}/profile`;
}

export function groupShopPath(groupId) {
  return `/groups/${groupId}/shop`;
}

export function groupShopAddPath(groupId) {
  return `/groups/${groupId}/shop/add`;
}

export function groupRankingPath(groupId) {
  return `/groups/${groupId}/ranking`;
}

export function groupControlPath(groupId) {
  return `/groups/${groupId}/control`;
}

export function groupControlUsersPath(groupId) {
  return `/groups/${groupId}/control/users`;
}

export function groupControlActivityPath(groupId) {
  return `/groups/${groupId}/control/activity`;
}

export function groupControlPostsPath(groupId) {
  return `/groups/${groupId}/control/posts`;
}

export function groupControlRanksPath(groupId) {
  return `/groups/${groupId}/control/ranks`;
}

export function groupControlShopItemsPath(groupId) {
  return `/groups/${groupId}/control/shopitems`;
}

export function groupControlCurrencyPath(groupId) {
  return `/groups/${groupId}/control/currency`;
}

export function groupControlHealthPath(groupId) {
  return `/groups/${groupId}/control/health`;
}

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
  return '/Statistics';
}

export function organizationsPath() {
  return '/organizations';
}

/** Developer-only API test page. */
export function apiTestPath() {
  return '/api-test';
}
