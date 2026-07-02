import { NAME_MAX_LENGTH } from '../../constants/fieldLimits.js';

export const DEFAULT_TEMPLATE_NAME_SUFFIX = ' — szablon';

/**
 * Buduje domyślną nazwę szablonu z nazwy grupy, obcinając końcówkę gdy przekracza limit.
 *
 * @param {string} storyName
 * @param {number} [maxLength]
 * @param {string} [suffix]
 * @returns {string}
 */
export function buildDefaultTemplateName(
  storyName,
  maxLength = NAME_MAX_LENGTH,
  suffix = DEFAULT_TEMPLATE_NAME_SUFFIX,
) {
  const base = String(storyName ?? '').trim();
  if (base.length + suffix.length <= maxLength) {
    return `${base}${suffix}`;
  }

  const allowedBaseLength = Math.max(0, maxLength - suffix.length);
  return `${base.slice(0, allowedBaseLength).trimEnd()}${suffix}`;
}
