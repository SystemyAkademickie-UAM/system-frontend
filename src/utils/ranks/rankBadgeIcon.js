const DEFAULT_RANK_EMOJI = '⭐';
const DEFAULT_BADGE_EMOJI = '🏅';

/**
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
export function isSvgIconReference(value) {
  if (value == null || typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.endsWith('.svg') || trimmed.startsWith('backend:');
}

/**
 * Normalizuje ikonę rangi lub odznaki do emoji (stare referencje SVG → domyślne emoji).
 *
 * @param {string | null | undefined} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function normalizeRankBadgeIcon(value, fallback = DEFAULT_RANK_EMOJI) {
  if (value == null || typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed || isSvgIconReference(trimmed)) {
    return fallback;
  }

  return trimmed.replace(/^backend:/, '');
}

export { DEFAULT_RANK_EMOJI, DEFAULT_BADGE_EMOJI };
