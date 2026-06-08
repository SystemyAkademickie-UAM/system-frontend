import { getApiBaseUrl, getAssetUrl } from './api.constants.js';

const HTTP_URL_PATTERN = /^https?:\/\//i;

/**
 * @param {string | null | undefined} ref
 * @returns {boolean}
 */
export function isColorBannerRef(ref) {
  return typeof ref === 'string' && ref.trim().startsWith('color:');
}

/**
 * @param {string | null | undefined} ref
 * @returns {string | null}
 */
export function parseColorBannerRef(ref) {
  if (!isColorBannerRef(ref)) {
    return null;
  }
  const color = ref.trim().slice('color:'.length);
  return color || null;
}

/**
 * Builds an absolute URL for a drive object stored on the backend,
 * or resolves predefined asset paths and color references.
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
  if (isColorBannerRef(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('/assets/')) {
    return getAssetUrl(trimmed);
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
