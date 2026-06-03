/** Najniższa ranga — zielony akcent projektu. */
export const RANK_GRADIENT_START = '#42f37d';
/** Najwyższa ranga — czerwono-pomarańczowy. */
export const RANK_GRADIENT_END = '#ff9142';
/** Zablokowana ranga (student). */
export const RANK_LOCKED_COLOR = '#859584';

/**
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number } | null}
 */
function hexToRgb(hex) {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) {
    return null;
  }
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return null;
  }
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

/**
 * @param {number} channel
 * @returns {string}
 */
function channelToHex(channel) {
  return Math.round(channel).toString(16).padStart(2, '0');
}

/**
 * @param {string} startHex
 * @param {string} endHex
 * @param {number} t 0..1
 * @returns {string}
 */
export function interpolateHexColor(startHex, endHex, t) {
  const clamped = Math.min(1, Math.max(0, t));
  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);
  if (!start || !end) {
    return startHex;
  }

  const r = start.r + (end.r - start.r) * clamped;
  const g = start.g + (end.g - start.g) * clamped;
  const b = start.b + (end.b - start.b) * clamped;

  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}

/**
 * Kolor rangi w gradientcie (index 0 = najniższa, total-1 = najwyższa).
 *
 * @param {number} index
 * @param {number} total
 * @returns {string}
 */
export function getRankGradientColor(index, total) {
  if (total <= 1) {
    return RANK_GRADIENT_START;
  }
  return interpolateHexColor(RANK_GRADIENT_START, RANK_GRADIENT_END, index / (total - 1));
}

/**
 * CSS linear-gradient dla pionowej osi (góra = najniższa ranga).
 * @returns {string}
 */
export function getRankAxisGradientCss() {
  return `linear-gradient(to bottom, ${RANK_GRADIENT_START}, ${RANK_GRADIENT_END})`;
}

/**
 * @param {string} hex
 * @param {number} alpha 0..1
 * @returns {string}
 */
export function hexToRgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return hex;
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
