/**
 * Centralne budowanie ścieżek URL (wspólne dla Sidebara, linków i testów).
 * Pełne ścieżki absolutne w obrębie aplikacji (bez domeny — zgodnie z React Router).
 */

/** Przykładowe ID grupy zgodne z backendem (od 100001). */
export const DEMO_GROUP_ID = '100001';

export function loginPath() {
  return '/login';
}

export function loginTempPath() {
  return '/logintemp';
}

export function loginNikitaPath() {
  return devApiTestPath();
}

export function groupsListPath() {
  return '/groups';
}

export function groupMainPath(groupId) {
  return `/groups/${groupId}/main`;
}

export function groupActivityPath(groupId) {
  return `/groups/${groupId}/main/activity`;
}

export function groupRanksAndBadgesPath(groupId) {
  return `/groups/${groupId}/main/ranksandbadges`;
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

export function groupControlPanelPath(groupId) {
  return `/groups/${groupId}/controlPanel`;
}

export function groupControlPanelUsersPath(groupId) {
  return `/groups/${groupId}/controlPanel/users`;
}

export function groupControlPanelActivityPath(groupId) {
  return `/groups/${groupId}/controlPanel/activity`;
}

export function groupControlPanelPostsPath(groupId) {
  return `/groups/${groupId}/controlPanel/posts`;
}

export function groupControlPanelRanksAndBadgesPath(groupId) {
  return `/groups/${groupId}/controlPanel/ranksandbadges`;
}

export function groupControlPanelShopItemsPath(groupId) {
  return `/groups/${groupId}/controlPanel/shopitems`;
}

export function groupControlPanelCurrencyPath(groupId) {
  return `/groups/${groupId}/controlPanel/currency`;
}

export function groupControlPanelHealthPath(groupId) {
  return `/groups/${groupId}/controlPanel/health`;
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

export function organizationManagementPath() {
  return '/organizationManagement';
}

/** Developer-only API test workspace (Login shell). */
export function devApiTestPath() {
  return '/dev/api-test';
}

/** @deprecated Use {@link devApiTestPath}. Kept for older links. */
export function apiTestPath() {
  return devApiTestPath();
}
