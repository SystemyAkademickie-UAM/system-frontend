import { getJson, postJson, patchJson, deleteJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';

/**
 * @typedef {Object} Rank
 * @property {number} id
 * @property {number | null} groupId
 * @property {string} name
 * @property {string | null} icon
 * @property {number} requiredPoints
 * @property {string | null} storyDescription
 * @property {string | null} globalDiscountType
 * @property {number | null} globalDiscountValue
 * @property {string[] | null} uniqueStoreItems
 */

/**
 * Mapuje pola zniżki z UI na kontrakt API (`globalDiscountType` / `globalDiscountValue`).
 * Usuwa przestarzałe `discount` i `storeDiscount`, które backend odrzuca (400).
 *
 * @param {Record<string, unknown>} rankData
 * @returns {Record<string, unknown>}
 */
function mapRankWritePayload(rankData) {
  const {
    discount,
    storeDiscount,
    globalDiscountType,
    globalDiscountValue,
    ...rest
  } = rankData;

  const payload = { ...rest };

  if (globalDiscountType !== undefined) {
    payload.globalDiscountType = globalDiscountType;
  }
  if (globalDiscountValue !== undefined) {
    payload.globalDiscountValue = globalDiscountValue;
  }

  if (globalDiscountType === undefined && globalDiscountValue === undefined) {
    const percent = Number(discount ?? storeDiscount ?? 0);
    if (Number.isFinite(percent) && percent > 0) {
      payload.globalDiscountType = 'percent';
      payload.globalDiscountValue = Math.round(percent);
    }
  }

  return payload;
}

/**
 * Pobiera wszystkie rangi dla grupy.
 * GET /groups/:groupId/ranks
 *
 * @param {string | number} groupId
 * @returns {Promise<Rank[]>}
 */
export async function fetchGroupRanks(groupId) {
  const result = await getJson(`/groups/${groupId}/ranks`);
  if (!result.ok) {
    console.error('Failed to fetch ranks:', result.status, result.data);
    return [];
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Tworzy nową rangę w grupie.
 * POST /groups/:groupId/ranks
 *
 * @param {string | number} groupId
 * @param {object} rankData
 * @param {string} rankData.name
 * @param {string} rankData.icon
 * @param {number} rankData.requiredPoints
 * @param {string} [rankData.storyDescription]
 * @param {number} [rankData.discount] — mapowane na globalDiscountType=percent
 * @param {string[]} [rankData.uniqueStoreItems]
 * @returns {Promise<{ ok: boolean, rank?: Rank, error?: string }>}
 */
export async function createRank(groupId, rankData) {
  const result = await postJson(`/groups/${groupId}/ranks`, mapRankWritePayload(rankData));
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data, 'Nie udało się utworzyć rangi') };
  }
  return { ok: true, rank: /** @type {Rank} */ (result.data) };
}

/**
 * Aktualizuje rangę.
 * PATCH /groups/:groupId/ranks/:rankId
 *
 * @param {string | number} groupId
 * @param {number} rankId
 * @param {Partial<Omit<Rank, 'id' | 'groupId'>> & { discount?: number, storeDiscount?: number }>} updates
 * @returns {Promise<{ ok: boolean, rank?: Rank, error?: string }>}
 */
export async function updateRank(groupId, rankId, updates) {
  const result = await patchJson(`/groups/${groupId}/ranks/${rankId}`, mapRankWritePayload(updates));
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data, 'Nie udało się zaktualizować rangi') };
  }
  return { ok: true, rank: /** @type {Rank} */ (result.data) };
}

/**
 * Usuwa rangę.
 * DELETE /groups/:groupId/ranks/:rankId
 *
 * @param {string | number} groupId
 * @param {number} rankId
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function deleteRank(groupId, rankId) {
  const result = await deleteJson(`/groups/${groupId}/ranks/${rankId}`);
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data, 'Nie udało się usunąć rangi') };
  }
  return { ok: true };
}
