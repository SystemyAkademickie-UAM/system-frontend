/** localStorage key for stable `X-Browser-ID` across reloads (API smoke test page). */
export const BROWSER_ID_LOCAL_STORAGE_KEY = 'maq.smokeTest.browserUuid';

/** Default icon ids aligned with backend API examples (docs/api.md). */
export const SMOKE_TEST_DEFAULT_CURRENCY_ICON = 21;

/** Default icon ids aligned with backend API examples (docs/api.md). */
export const SMOKE_TEST_DEFAULT_LIFE_ICON = 13;

/** Mirrors backend JSON `status` when drive is forbidden. */
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

/**
 * Student enrollment in a group.
 * @param {number|string} groupId - The public group ID
 * @returns {string} Path for POST request
 */
export function getGroupEnrollPath(groupId) {
  return `/groups/${groupId}/enroll`;
}

/** Multipart drive upload / remove (lecturer). */
export const DRIVE_PATH = '/drive';

/** Dev-only: mint HTTP-only session cookie as fake student (requires backend SAML_BYPASS_ENABLED). */
export const SAML_BYPASS_STUDENT_PATH = '/auth/saml/bypass/student';

/** Dev-only: mint session cookie as fake lecturer (`auth.konta.rola` = lecturer). */
export const SAML_BYPASS_LECTURER_PATH = '/auth/saml/bypass/lecturer';

/**
 * Dev-only: POST JSON `{ "profile": "student" | "lecturer" }` — sets `maqSamlSession` without redirect (same-origin fetch).
 */
export const SAML_BYPASS_SESSION_PATH = '/auth/saml/bypass/session';

export const AUTH_SAML_ME_PATH = '/auth/saml/me';

/** Stage management endpoint. */
export const STAGES_PATH = '/stages';

/** Activity management endpoint. */
export const ACTIVITIES_PATH = '/activities';
