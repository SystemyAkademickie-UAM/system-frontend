import { updateRank } from '../../services/ranks.api.js';

/**
 * @typedef {Object} RankUnlockRef
 * @property {number} dbId
 * @property {string} name
 * @property {string[]} [shopItems]
 */

/**
 * @param {string | number} value
 * @returns {string}
 */
export function normalizeShopItemId(value) {
  return String(value).trim();
}

/**
 * @param {{ shopItems?: string[] } | null | undefined} rank
 * @returns {string[]}
 */
export function getRankShopItemIds(rank) {
  if (!rank || !Array.isArray(rank.shopItems)) {
    return [];
  }
  return rank.shopItems.map(normalizeShopItemId).filter(Boolean);
}

/**
 * @param {string | number} itemId
 * @param {RankUnlockRef[]} ranks
 * @param {number | null | undefined} [excludeRankDbId]
 * @returns {RankUnlockRef | null}
 */
export function findRankOwningShopItem(itemId, ranks, excludeRankDbId = null) {
  const normalizedId = normalizeShopItemId(itemId);

  for (const rank of ranks) {
    if (excludeRankDbId != null && rank.dbId === excludeRankDbId) {
      continue;
    }
    if (getRankShopItemIds(rank).includes(normalizedId)) {
      return rank;
    }
  }
  return null;
}

/**
 * @param {RankUnlockRef[]} ranks
 * @param {number | null | undefined} [excludeRankDbId]
 * @returns {Map<string, RankUnlockRef>}
 */
export function buildShopItemOwnerMap(ranks, excludeRankDbId = null) {
  /** @type {Map<string, RankUnlockRef>} */
  const map = new Map();

  for (const rank of ranks) {
    if (excludeRankDbId != null && rank.dbId === excludeRankDbId) {
      continue;
    }
    for (const itemId of getRankShopItemIds(rank)) {
      map.set(itemId, rank);
    }
  }

  return map;
}

/**
 * @param {string | number} itemId
 * @param {RankUnlockRef[]} ranks
 * @returns {RankUnlockRef | null}
 */
export function findRankUnlockingItem(itemId, ranks) {
  return findRankOwningShopItem(itemId, ranks, null);
}

/**
 * @param {string[]} itemIds
 * @param {{ id: string | number, name?: string }[]} [catalogItems]
 * @returns {string[]}
 */
export function resolveShopItemLabels(itemIds, catalogItems = []) {
  const nameById = new Map(
    catalogItems.map((item) => [normalizeShopItemId(item.id), item.name || normalizeShopItemId(item.id)]),
  );

  return itemIds.map((itemId) => {
    const normalizedId = normalizeShopItemId(itemId);
    return nameById.get(normalizedId) ?? normalizedId;
  });
}

/**
 * Przypisuje przedmiot do jednej rangi (lub usuwa blokadę, gdy targetRankDbId === null).
 * Aktualizuje `uniqueStoreItems` (ID przedmiotów jako stringi) na backendzie.
 *
 * @param {string | number} groupId
 * @param {string | number} itemId
 * @param {number | null} targetRankDbId
 * @param {RankUnlockRef[]} ranks
 */
export async function syncShopItemRankUnlock(groupId, itemId, targetRankDbId, ranks) {
  const normalizedId = normalizeShopItemId(itemId);
  if (!normalizedId) {
    return { ok: true };
  }

  /** @type {{ rankId: number, uniqueStoreItems: string[] }[]} */
  const patches = [];

  for (const rank of ranks) {
    const items = getRankShopItemIds(rank);
    const hasItem = items.includes(normalizedId);
    const shouldHave = targetRankDbId != null && rank.dbId === targetRankDbId;

    if (shouldHave && !hasItem) {
      patches.push({ rankId: rank.dbId, uniqueStoreItems: [...items, normalizedId] });
    } else if (!shouldHave && hasItem) {
      patches.push({
        rankId: rank.dbId,
        uniqueStoreItems: items.filter((id) => id !== normalizedId),
      });
    }
  }

  if (patches.length === 0) {
    return { ok: true };
  }

  const results = await Promise.all(
    patches.map((patch) => updateRank(groupId, patch.rankId, {
      uniqueStoreItems: patch.uniqueStoreItems,
    })),
  );

  const failed = results.find((result) => !result.ok);
  if (failed) {
    return { ok: false, error: failed.error ?? 'Nie udało się zaktualizować przypisania rangi.' };
  }

  return { ok: true };
}
