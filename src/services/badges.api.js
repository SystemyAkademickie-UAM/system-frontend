import { getJson, postJson, patchJson, deleteJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';

/**
 * @typedef {Object} Badge
 * @property {number} id
 * @property {number | null} groupId
 * @property {string} name
 * @property {string | null} icon
 * @property {string | null} educationalDescription
 * @property {string | null} storyDescription
 * @property {number | null} rewardAmount
 * @property {'common' | 'uncommon' | 'rare' | 'epic'} rarity
 */

/**
 * Pobiera wszystkie odznaki dla grupy.
 * GET /groups/:groupId/badges
 *
 * @param {string | number} groupId
 * @returns {Promise<Badge[]>}
 */
export async function fetchGroupBadges(groupId) {
  const result = await getJson(`/groups/${groupId}/badges`);
  if (!result.ok) {
    console.error('Failed to fetch badges:', result.status, result.data);
    return [];
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Tworzy nową odznakę w grupie.
 * POST /groups/:groupId/badges
 *
 * @param {string | number} groupId
 * @param {object} badgeData
 * @param {string} badgeData.name
 * @param {string} badgeData.icon
 * @param {string} badgeData.educationalDescription
 * @param {string} [badgeData.storyDescription]
 * @param {number} [badgeData.rewardAmount]
 * @param {'common' | 'uncommon' | 'rare' | 'epic'} [badgeData.rarity]
 * @returns {Promise<{ ok: boolean, badge?: Badge, error?: string }>}
 */
export async function createBadge(groupId, badgeData) {
  const result = await postJson(`/groups/${groupId}/badges`, badgeData);
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data, 'Nie udało się utworzyć odznaki') };
  }
  return { ok: true, badge: /** @type {Badge} */ (result.data) };
}

/**
 * Aktualizuje odznakę.
 * PATCH /groups/:groupId/badges/:badgeId
 *
 * @param {string | number} groupId
 * @param {number} badgeId
 * @param {Partial<Omit<Badge, 'id' | 'groupId'>>} updates
 * @returns {Promise<{ ok: boolean, badge?: Badge, error?: string }>}
 */
export async function updateBadge(groupId, badgeId, updates) {
  const result = await patchJson(`/groups/${groupId}/badges/${badgeId}`, updates);
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data, 'Nie udało się zaktualizować odznaki') };
  }
  return { ok: true, badge: /** @type {Badge} */ (result.data) };
}

/**
 * Usuwa odznakę.
 * DELETE /groups/:groupId/badges/:badgeId
 *
 * @param {string | number} groupId
 * @param {number} badgeId
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function deleteBadge(groupId, badgeId) {
  const result = await deleteJson(`/groups/${groupId}/badges/${badgeId}`);
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data, 'Nie udało się usunąć odznaki') };
  }
  return { ok: true };
}
