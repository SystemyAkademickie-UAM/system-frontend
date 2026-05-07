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
    return 'Drive is lecturer-only. Use “Establish dev session (lecturer)” then POST /login with the same X-Browser-ID.';
  }
  if (reason === DRIVE_JSON_REASON_AUTH_OR_BROWSER) {
    return 'Opaque token or browser binding failed. POST /login again with the same X-Browser-ID (do not click “New browser id” after login).';
  }
  if (reason !== undefined && reason !== '') {
    return `Drive returned ${DRIVE_JSON_STATUS_FORBIDDEN} (reason: ${reason}).`;
  }
  return `Drive returned ${DRIVE_JSON_STATUS_FORBIDDEN}.`;
}
