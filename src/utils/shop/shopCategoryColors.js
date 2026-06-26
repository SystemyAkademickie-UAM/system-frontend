export const DEFAULT_CATEGORY_COLOR = '#42f37d';

export const CATEGORY_LABEL_TEXT_LIGHT = '#e3e0f7';
export const CATEGORY_LABEL_TEXT_DARK = '#10101a';

/** Próg jasności tła — powyżej używamy ciemnego tekstu. */
const LIGHT_BACKGROUND_LUMINANCE_THRESHOLD = 0.58;

/**
 * @typedef {{ r: number, g: number, b: number }} RgbColor
 */

/**
 * @param {string | null | undefined} input
 * @returns {RgbColor | null}
 */
export function parseCssColor(input) {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const value = input.trim();

  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return {
        r: Number.parseInt(hex[0] + hex[0], 16),
        g: Number.parseInt(hex[1] + hex[1], 16),
        b: Number.parseInt(hex[2] + hex[2], 16),
      };
    }
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgbMatch) {
    return {
      r: Math.round(Number(rgbMatch[1])),
      g: Math.round(Number(rgbMatch[2])),
      b: Math.round(Number(rgbMatch[3])),
    };
  }

  return null;
}

/**
 * Względna luminancja (WCAG 2.x).
 * @param {{ r: number, g: number, b: number }} color
 * @returns {number}
 */
export function getRelativeLuminance(color) {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Zwraca jasny lub ciemny kolor tekstu dla danego tła kategorii.
 *
 * @param {string | null | undefined} backgroundColor
 * @returns {string}
 */
export function getContrastingCategoryTextColor(backgroundColor) {
  const parsed = parseCssColor(backgroundColor ?? DEFAULT_CATEGORY_COLOR);
  if (!parsed) {
    return CATEGORY_LABEL_TEXT_LIGHT;
  }

  return getRelativeLuminance(parsed) > LIGHT_BACKGROUND_LUMINANCE_THRESHOLD
    ? CATEGORY_LABEL_TEXT_DARK
    : CATEGORY_LABEL_TEXT_LIGHT;
}

/**
 * @param {RgbColor} color
 * @returns {string}
 */
export function rgbToHex({ r, g, b }) {
  const toHex = (channel) => channel.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Uśrednia kolory kategorii przypisanych do produktu.
 *
 * @param {Array<string | null | undefined>} colors
 * @returns {string}
 */
export function mixCategoryColors(colors = []) {
  const parsed = colors
    .map((color) => parseCssColor(color))
    .filter((color) => color !== null);

  if (parsed.length === 0) {
    return DEFAULT_CATEGORY_COLOR;
  }

  const total = parsed.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b,
    }),
    { r: 0, g: 0, b: 0 },
  );

  return rgbToHex({
    r: Math.round(total.r / parsed.length),
    g: Math.round(total.g / parsed.length),
    b: Math.round(total.b / parsed.length),
  });
}

/**
 * @param {Array<{ color?: string | null }>} categories
 * @returns {string}
 */
export function getMixedCategoryColor(categories = []) {
  return mixCategoryColors(categories.map((category) => category.color));
}

/**
 * Zmienne CSS kafelka produktu — akcent 1:1, obrys przyciemniony maską.
 *
 * @param {Array<{ color?: string | null }>} categories
 * @returns {Record<string, string>}
 */
export function getProductCardColorVars(categories = []) {
  const accentColor = getMixedCategoryColor(categories);

  return {
    '--product-card-accent-color': accentColor,
    '--product-card-stroke-color': `color-mix(in srgb, ${accentColor} 58%, black)`,
  };
}
