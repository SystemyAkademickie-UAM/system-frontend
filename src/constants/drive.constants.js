import { getApiBaseUrl } from './api.constants.js';

const HTTP_URL_PATTERN = /^https?:\/\//i;

/**
 * Builds an absolute URL for a drive object stored on the backend.
 * @param {string | null | undefined} driveRef
 * @returns {string | null}
 */
export function buildDriveBannerUrl(driveRef) {
  if (driveRef == null) {
    return null;
  }
  const trimmed = String(driveRef).trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (HTTP_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }
  const base = getApiBaseUrl();
  if (base.length === 0) {
    return null;
  }
  return `${base.replace(/\/+$/, '')}/drive/${encodeURIComponent(trimmed)}`;
}
