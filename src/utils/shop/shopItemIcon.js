import { buildDriveBannerUrl } from '../../constants/drive.constants.js';

const DEFAULT_ICON_BG = 'rgb(40, 40, 52)';
const DEFAULT_EMOJI = '📦';

/**
 * @param {string | null | undefined} imageRef
 * @returns {{ emoji: string, iconBackground: string, imageUrl: string | null }}
 */
export function parseShopItemImageRef(imageRef) {
  if (imageRef == null || typeof imageRef !== 'string') {
    return { emoji: DEFAULT_EMOJI, iconBackground: DEFAULT_ICON_BG, imageUrl: null };
  }

  const trimmed = imageRef.trim();
  if (trimmed.length === 0) {
    return { emoji: DEFAULT_EMOJI, iconBackground: DEFAULT_ICON_BG, imageUrl: null };
  }

  const starIndex = trimmed.indexOf('*');
  if (starIndex >= 0) {
    const emoji = trimmed.slice(0, starIndex).trim() || DEFAULT_EMOJI;
    const iconBackground = trimmed.slice(starIndex + 1).trim() || DEFAULT_ICON_BG;
    return { emoji, iconBackground, imageUrl: null };
  }

  const imageUrl = buildDriveBannerUrl(trimmed);
  if (imageUrl && !imageUrl.startsWith('color:')) {
    return { emoji: null, iconBackground: DEFAULT_ICON_BG, imageUrl };
  }

  if (trimmed.length <= 12) {
    return { emoji: trimmed, iconBackground: DEFAULT_ICON_BG, imageUrl: null };
  }

  return { emoji: DEFAULT_EMOJI, iconBackground: DEFAULT_ICON_BG, imageUrl: null };
}
