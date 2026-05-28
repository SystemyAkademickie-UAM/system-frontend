import { publicAssetPath } from './publicAssetUrl.js';

export const SVG_PLACEHOLDER_FILENAME = 'placeholder.svg';

/**
 * Ścieżka do pliku SVG w public/assets/svg/.
 * @param {string} filename — np. "rocket.svg" lub "rocket"
 */
export function svgAssetPath(filename) {
  const normalized = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  return publicAssetPath(`assets/svg/${normalized}`);
}

export function svgPlaceholderPath() {
  return svgAssetPath(SVG_PLACEHOLDER_FILENAME);
}
