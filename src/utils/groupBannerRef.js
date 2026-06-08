import { getAssetUrl } from '../constants/api.constants.js';
import { isColorBannerRef, parseColorBannerRef } from '../constants/drive.constants.js';

/**
 * Ścieżka zapisu predefiniowanego banera (np. /assets/banners/space.png).
 *
 * @param {{ id?: string | number, imageUrl?: string }} banner
 * @returns {string | null}
 */
export function getPredefinedBannerPath(banner) {
  const imageUrl = typeof banner.imageUrl === 'string' ? banner.imageUrl.trim() : '';
  if (imageUrl.startsWith('/assets/')) {
    return imageUrl;
  }

  const id = String(banner.id ?? '').trim();
  if (id.startsWith('/assets/')) {
    return id;
  }

  return imageUrl || null;
}

/**
 * URL podglądu predefiniowanego banera w galerii.
 *
 * @param {string} assetPath
 * @returns {string | null}
 */
export function getPredefinedBannerPreviewUrl(assetPath) {
  if (!assetPath) {
    return null;
  }
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://') || assetPath.startsWith('data:')) {
    return assetPath;
  }
  return getAssetUrl(assetPath);
}

/**
 * @typedef {'gallery' | 'file' | 'color' | 'none'} BannerPickerMode
 */

/**
 * @typedef {Object} BannerPickerValue
 * @property {BannerPickerMode} mode
 * @property {string | null} galleryPath
 * @property {string} color
 * @property {File | null} file
 * @property {string | null} previewUrl
 * @property {string | null} existingDriveRef
 * @property {boolean} cleared
 */

/** @returns {BannerPickerValue} */
export function createDefaultBannerPickerValue() {
  return {
    mode: 'gallery',
    galleryPath: null,
    color: '#3b82f6',
    file: null,
    previewUrl: null,
    existingDriveRef: null,
    cleared: false,
  };
}

/**
 * @param {string | null | undefined} imageRef
 * @param {string | null | undefined} bannerUrl
 * @returns {BannerPickerValue}
 */
export function parseImageRefToBannerPickerValue(imageRef, bannerUrl) {
  const base = createDefaultBannerPickerValue();
  const ref = typeof imageRef === 'string' ? imageRef.trim() : '';
  const resolvedRef = ref || (typeof bannerUrl === 'string' && isColorBannerRef(bannerUrl) ? bannerUrl.trim() : '');

  if (!resolvedRef) {
    return { ...base, mode: 'gallery', cleared: false };
  }

  if (isColorBannerRef(resolvedRef)) {
    return {
      ...base,
      mode: 'color',
      color: parseColorBannerRef(resolvedRef) ?? '#3b82f6',
    };
  }

  if (resolvedRef.startsWith('/assets/')) {
    return {
      ...base,
      mode: 'gallery',
      galleryPath: resolvedRef,
      previewUrl: getPredefinedBannerPreviewUrl(resolvedRef),
    };
  }

  return {
    ...base,
    mode: 'file',
    existingDriveRef: resolvedRef,
    previewUrl: bannerUrl && !isColorBannerRef(bannerUrl) ? bannerUrl : null,
  };
}

/**
 * Buduje imageRef do wysłania na backend (bez uploadu — ten przekaż osobno).
 *
 * @param {BannerPickerValue} value
 * @returns {string | null | undefined} null/undefined = nie nadpisuj; '' = usuń
 */
export function buildBannerImageRefPayload(value) {
  if (value.cleared) {
    return '';
  }

  if (value.mode === 'gallery' && value.galleryPath) {
    return value.galleryPath;
  }

  if (value.mode === 'color') {
    return `color:${value.color}`;
  }

  if (value.mode === 'file') {
    if (value.file) {
      return undefined;
    }
    if (value.existingDriveRef) {
      return value.existingDriveRef;
    }
  }

  return undefined;
}
