import { getJson, postJson, patchJson, deleteJson } from './api-client.js';

/**
 * @typedef {Object} Rank
 * @property {number} id
 * @property {number | null} groupId
 * @property {string} name
 * @property {string | null} icon
 * @property {number} requiredPoints
 * @property {string | null} storyDescription
 * @property {number | null} storeDiscount
 * @property {string[] | null} uniqueStoreItems
 */

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
 * @param {number} [rankData.storeDiscount]
 * @param {string[]} [rankData.uniqueStoreItems]
 * @returns {Promise<{ ok: boolean, rank?: Rank, error?: string }>}
 */
export async function createRank(groupId, rankData) {
  const result = await postJson(`/groups/${groupId}/ranks`, rankData);
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się utworzyć rangi' };
  }
  return { ok: true, rank: /** @type {Rank} */ (result.data) };
}

/**
 * Aktualizuje rangę.
 * PATCH /groups/:groupId/ranks/:rankId
 *
 * @param {string | number} groupId
 * @param {number} rankId
 * @param {Partial<Omit<Rank, 'id' | 'groupId'>>} updates
 * @returns {Promise<{ ok: boolean, rank?: Rank, error?: string }>}
 */
export async function updateRank(groupId, rankId, updates) {
  const result = await patchJson(`/groups/${groupId}/ranks/${rankId}`, updates);
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się zaktualizować rangi' };
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
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się usunąć rangi' };
  }
  return { ok: true };
}
