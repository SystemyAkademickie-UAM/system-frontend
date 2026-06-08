/**
 * Awatary z /assets/avatars/ mają większy margines w grafice — lekko powiększamy je w kółku.
 *
 * @param {string | null | undefined} imageUrl
 * @returns {boolean}
 */
export function isScaledAvatarImage(imageUrl) {
  return typeof imageUrl === 'string' && imageUrl.includes('/assets/avatars/');
}

/**
 * @param {string} [className]
 * @param {string | null | undefined} imageUrl
 * @returns {string}
 */
export function getAvatarImageClassName(imageUrl, className = '') {
  return [
    className,
    isScaledAvatarImage(imageUrl) ? 'maq-avatar-image--scaled' : '',
  ]
    .filter(Boolean)
    .join(' ');
}
