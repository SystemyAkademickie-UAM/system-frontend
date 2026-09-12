import { fetchGroupShopItems } from '../../services/shop.api.js';

/** @type {Map<string, { timestamp: number, items: any[] }>} */
const shopItemsCache = new Map();
/** @type {Map<string, Promise<any[]>>} */
const inFlightRequests = new Map();
const CACHE_TTL_MS = 60 * 1000;

/**
 * @param {string | number} groupId
 * @returns {Promise<any[]>}
 */
export async function getCachedGroupShopItems(groupId) {
  if (!groupId) return [];
  const key = String(groupId);
  const cached = shopItemsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.items;
  }

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }

  const promise = fetchGroupShopItems(groupId)
    .then((res) => {
      inFlightRequests.delete(key);
      if (res.ok && res.items) {
        shopItemsCache.set(key, { timestamp: Date.now(), items: res.items });
        return res.items;
      }
      return cached?.items ?? [];
    })
    .catch(() => {
      inFlightRequests.delete(key);
      return cached?.items ?? [];
    });

  inFlightRequests.set(key, promise);
  return promise;
}

/**
 * @param {string | number} groupId
 * @param {string | number | null} itemId
 * @param {{ name?: string | null, isExtraLife?: boolean }} [matchers]
 * @returns {Promise<any | null>}
 */
export async function findCachedShopItem(groupId, itemId, matchers = {}) {
  const items = await getCachedGroupShopItems(groupId);
  if (itemId != null) {
    const byId = items.find((it) => String(it.id) === String(itemId));
    if (byId) return byId;
  }
  if (matchers.isExtraLife) {
    const extraLife = items.find((it) => it.isExtraLife === true);
    if (extraLife) return extraLife;
  }
  if (matchers.name) {
    const normalizedName = matchers.name.trim().toLowerCase();
    const byName = items.find((it) => it.name && it.name.trim().toLowerCase() === normalizedName);
    if (byName) return byName;
  }
  return null;
}
