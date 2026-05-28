export { BROWSER_ID_LOCAL_STORAGE_KEY } from '../../../../constants/browserId.constants.js';

/** Default icon ids aligned with backend API examples (docs/api.md). */
export const SMOKE_TEST_DEFAULT_CURRENCY_ICON = 21;

/** Default icon ids aligned with backend API examples (docs/api.md). */
export const SMOKE_TEST_DEFAULT_LIFE_ICON = 13;

/** Mirrors backend JSON `statusCode` when drive is forbidden. */
export const DRIVE_JSON_STATUS_FORBIDDEN = 403;

/** Mirrors backend `DRIVE_FORBIDDEN_REASON_AUTH_OR_BROWSER`. */
export const DRIVE_JSON_REASON_AUTH_OR_BROWSER = 'AUTH_OR_BROWSER';

/** Mirrors backend `DRIVE_FORBIDDEN_REASON_NOT_LECTURER`. */
export const DRIVE_JSON_REASON_NOT_LECTURER = 'NOT_LECTURER';

/**
 * @param {string | undefined} reason
 * @returns {string}
 */
export function describeDriveForbiddenReason(reason) {
  if (reason === DRIVE_JSON_REASON_NOT_LECTURER) {
    return 'Drive is lecturer-only. Use "Establish dev session (lecturer)" then POST /login with the same X-Browser-ID.';
  }
  if (reason === DRIVE_JSON_REASON_AUTH_OR_BROWSER) {
    return 'Opaque token or browser binding failed. POST /login again with the same X-Browser-ID (do not click "New browser id" after login).';
  }
  if (reason !== undefined && reason !== '') {
    return `Drive returned ${DRIVE_JSON_STATUS_FORBIDDEN} (reason: ${reason}).`;
  }
  return `Drive returned ${DRIVE_JSON_STATUS_FORBIDDEN}.`;
}

/** Resource path only (no /api); base URL must already include the API prefix, e.g. .../api. */
export const COUNTER_INCREMENT_PATH = '/counter/increment';

/** Opaque bearer issuance after SAML session cookie + `X-Browser-ID`. */
export const LOGIN_PATH = '/login';

/** Clears auth cookies (logout). */
export const LOGOUT_PATH = '/logout';

/** Lecturer group creation. */
export const GROUPS_NEW_PATH = '/groups/new';

/** List groups for authenticated user. */
export const GROUPS_PATH = '/groups';

/** All groups split into myGroups / otherGroups. */
export const GROUPS_CATALOG_PATH = '/groups/catalog';

/**
 * @param {number|string} groupId - Public group ID
 * @param {string} [auth]
 * @returns {string}
 */
export function getGroupPreviewPath(groupId, auth) {
  const params = new URLSearchParams();
  const trimmedAuth = typeof auth === 'string' ? auth.trim() : '';
  if (trimmedAuth !== '') {
    params.set('auth', trimmedAuth);
  }
  const query = params.toString();
  const base = `/groups/${groupId}/preview`;
  return query ? `${base}?${query}` : base;
}

/**
 * @param {number|string} groupId - Public group ID
 * @param {string} [auth]
 * @returns {string}
 */
export function getGroupAccessCodePath(groupId, auth) {
  const params = new URLSearchParams();
  const trimmedAuth = typeof auth === 'string' ? auth.trim() : '';
  if (trimmedAuth !== '') {
    params.set('auth', trimmedAuth);
  }
  const query = params.toString();
  const base = `/groups/${groupId}/access-code`;
  return query ? `${base}?${query}` : base;
}

/**
 * @param {number|string} groupId - Public group ID
 * @returns {string}
 */
export function getGroupStudentProfilePath(groupId) {
  return `/groups/${groupId}/student-profile`;
}

/** Student join group by code. */
export const GROUPS_INVITE_PATH = '/groups/invite';

/**
 * Student enrollment in a group.
 * @param {number|string} groupId - The public group ID
 * @returns {string} Path for POST request
 */
export function getGroupEnrollPath(groupId) {
  return `/groups/${groupId}/enroll`;
}

/**
 * @param {number|string} groupId - Public group ID
 * @param {string} code - 6-character entry code
 * @param {string} [auth] - Optional plaintext bearer (also via cookie)
 * @returns {string}
 */
export function getGroupInvitePath(groupId, code, auth) {
  const params = new URLSearchParams();
  params.set('code', code);
  const trimmedAuth = typeof auth === 'string' ? auth.trim() : '';
  if (trimmedAuth !== '') {
    params.set('auth', trimmedAuth);
  }
  return `/groups/${groupId}/invite?${params.toString()}`;
}

/** Backend requires exactly 6 characters for group entry codes. */
export const GROUP_INVITE_CODE_LENGTH = 6;

/** Random 6-character group entry code generation. */
export const GROUPS_GENERATE_CODE_PATH = '/groups/generate-code';

/** Multipart drive upload / remove (lecturer). */
export const DRIVE_PATH = '/drive';

/** Dev-only: POST JSON `{ "persona": "student1" | … }` — sets `maqSamlSession` without redirect. */
export const SAML_BYPASS_SESSION_PATH = '/auth/saml/bypass/session';

/** Dev-only: bypass availability and persona list. */
export const SAML_BYPASS_STATUS_PATH = '/auth/saml/bypass/status';

export const AUTH_SAML_ME_PATH = '/auth/saml/me';

/** Stage management endpoint. */
export const STAGES_PATH = '/stages';

/** Activity management endpoint. */
export const ACTIVITIES_PATH = '/activities';

/**
 * @param {number|string} groupId - Public group ID
 * @returns {string}
 */
export function getGroupBadgesPath(groupId) {
  return `/groups/${groupId}/badges`;
}

/**
 * @param {number|string} groupId
 * @param {number|string} badgeId
 * @returns {string}
 */
export function getGroupBadgeByIdPath(groupId, badgeId) {
  return `/groups/${groupId}/badges/${badgeId}`;
}

/**
 * @param {number|string} groupId - Public group ID
 * @returns {string}
 */
export function getGroupRanksPath(groupId) {
  return `/groups/${groupId}/ranks`;
}

/**
 * @param {number|string} groupId
 * @param {number|string} rankId
 * @returns {string}
 */
export function getGroupRankByIdPath(groupId, rankId) {
  return `/groups/${groupId}/ranks/${rankId}`;
}

// ── Student Management endpoints ────────────────────────────────────

/** @param {number|string} groupId */
export function getGroupStudentsPath(groupId) {
  return `/groups/${groupId}/students`;
}

/** @param {number|string} groupId */
export function getGroupStudentsBulkUpdatePath(groupId) {
  return `/groups/${groupId}/students/bulk-update`;
}

/**
 * @param {number|string} groupId
 * @param {number|string} accountId
 */
export function getGroupStudentDeletePath(groupId, accountId) {
  return `/groups/${groupId}/students/${accountId}`;
}

/**
 * @param {number|string} groupId
 * @param {number|string} accountId
 */
export function getGroupStudentBadgesPath(groupId, accountId) {
  return `/groups/${groupId}/students/${accountId}/badges`;
}

/**
 * @param {number|string} groupId
 * @param {number|string} accountId
 * @param {number|string} badgeId
 */
export function getGroupStudentBadgeTogglePath(groupId, accountId, badgeId) {
  return `/groups/${groupId}/students/${accountId}/badges/${badgeId}/toggle`;
}

/**
 * @param {number|string} groupId
 * @param {number|string} accountId
 */
export function getGroupStudentProgressPath(groupId, accountId) {
  return `/groups/${groupId}/students/${accountId}/progress`;
}

/**
 * @param {number|string} groupId
 * @param {number|string} accountId
 * @param {number|string} activityId
 */
export function getGroupStudentActivityTogglePath(groupId, accountId, activityId) {
  return `/groups/${groupId}/students/${accountId}/activities/${activityId}/toggle`;
}

// ── Profile Settings endpoints ──────────────────────────────────────

/** GET /profile - Get current user profile */
export const PROFILE_PATH = '/profile';

/** GET /profile/avatars - List of available avatars */
export const PROFILE_AVATARS_PATH = '/profile/avatars';

/** PATCH /profile/settings - Update profile nickname/avatar */
export const PROFILE_SETTINGS_PATH = '/profile/settings';

