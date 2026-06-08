import { publicAssetPath } from './publicAssetUrl.js';
import { SVG_PLACEHOLDER } from '../constants/svgIcons.js';
import { getAssetUrl } from '../constants/api.constants.js';

export { SVG_PLACEHOLDER as SVG_PLACEHOLDER_FILENAME };

/**
 * Zwraca ścieżkę względną pliku SVG albo placeholder, gdy brak prawidłowego pliku .svg.
 * Emoji, puste wartości i nazwy bez rozszerzenia .svg → shared/placeholder.svg.
 *
 * @param {string | null | undefined} filename — np. "actions/add.svg"
 * @returns {string}
 */
export function resolveSvgAssetName(filename) {
  if (filename == null || typeof filename !== 'string') {
    return SVG_PLACEHOLDER;
  }

  const trimmed = filename.trim();
  if (!trimmed.endsWith('.svg')) {
    return SVG_PLACEHOLDER;
  }

  return trimmed;
}

/**
 * URL do pliku SVG w public/assets/svg/ (obsługuje podfoldery).
 * @param {string} filename — np. "actions/add.svg"
 */
export function svgAssetPath(filename) {
  const resolved = resolveSvgAssetName(filename);

  if (resolved.startsWith('backend:')) {
    const backendFilename = resolved.replace('backend:', '');
    return getAssetUrl(`assets/icons/${backendFilename}`);
  }

  return publicAssetPath(`assets/svg/${resolved}`);
}

export function svgPlaceholderPath() {
  return svgAssetPath(SVG_PLACEHOLDER);
}
