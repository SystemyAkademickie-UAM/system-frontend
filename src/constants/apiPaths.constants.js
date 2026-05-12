/** Resource path only (no /api); base URL must already include the API prefix, e.g. .../api. */
export const COUNTER_INCREMENT_PATH = '/counter/increment';

/** Opaque bearer issuance after SAML session cookie + `X-Browser-ID`. */
export const LOGIN_PATH = '/login';

/** Clears auth cookies (logout). */
export const LOGOUT_PATH = '/login/logout';

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
