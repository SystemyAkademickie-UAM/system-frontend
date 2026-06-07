/** TYMCZASOWE — magazyn produktów sklepu w localStorage (do podmiany na API). */

const STORAGE_PREFIX = 'maq-shop-items:';
const SHOP_ITEMS_EVENT = 'maq-shop-items-change';

function emitShopItemsChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SHOP_ITEMS_EVENT));
  }
}

/**
 * @param {string | number} groupId
 * @returns {string}
 */
function storageKey(groupId) {
  return `${STORAGE_PREFIX}${groupId}`;
}

/**
 * @param {string | number} groupId
 * @returns {import('./shopItem.types.js').ShopItem[]}
 */
export function readShopItems(groupId) {
  if (!groupId) {
    return [];
  }

  try {
    const raw = localStorage.getItem(storageKey(groupId));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @param {string | number} groupId
 * @param {import('./shopItem.types.js').ShopItem[]} items
 */
export function writeShopItems(groupId, items) {
  if (!groupId) {
    return;
  }
  localStorage.setItem(storageKey(groupId), JSON.stringify(items));
  emitShopItemsChange();
}

/**
 * @param {string | number} groupId
 * @param {import('./shopItem.types.js').ShopItem[]} items
 */
export function appendShopItems(groupId, items) {
  const existing = readShopItems(groupId);
  writeShopItems(groupId, [...existing, ...items]);
}

export { SHOP_ITEMS_EVENT };
