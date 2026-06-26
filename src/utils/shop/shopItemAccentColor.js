/**
 * Tymczasowy losowy ciemny akcent kafelka produktu — stabilny dla danego seeda (np. id).
 *
 * @param {string | number | null | undefined} seed
 * @returns {string}
 */
export function getShopItemAccentColor(seed) {
  const value = String(seed ?? 'default');
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }

  const normalized = Math.abs(hash);
  const hue = normalized % 360;
  const saturation = 42 + ((normalized >> 8) % 28);
  const lightness = 26 + ((normalized >> 16) % 16);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
