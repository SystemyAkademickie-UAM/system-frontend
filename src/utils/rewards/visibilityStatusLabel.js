/**
 * @param {boolean | undefined} isPublished
 * @returns {'Publiczny' | 'Ukryty'}
 */
export function getVisibilityStatusLabel(isPublished) {
  return isPublished === false ? 'Ukryty' : 'Publiczny';
}
