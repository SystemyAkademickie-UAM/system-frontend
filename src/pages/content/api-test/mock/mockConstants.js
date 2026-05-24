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
 * @param {number|string} groupId - Public group ID
 * @returns {string}
 */
export function getGroupRanksPath(groupId) {
  return `/groups/${groupId}/ranks`;
}
