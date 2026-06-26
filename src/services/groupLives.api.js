import { getJson, patchJson } from './api-client.js';
import { DEFAULT_LIVES_LABEL, DEFAULT_LIVES_SYMBOL } from '../constants/lives.constants.js';

/**
 * @typedef {Object} GroupLivesConfig
 * @property {boolean} livesEnabled
 * @property {number | null} livesMax
 * @property {number | null} [startingLives]
 * @property {string} livesLabel
 * @property {string} livesIcon
 * @property {boolean} livesShopEnabled
 */

/**
 * Pobiera konfigurację systemu żyć grupy.
 * GET /groups/:groupId/lives-config (prowadzący-właściciel lub zapisany student).
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, config?: GroupLivesConfig }>}
 */
export async function fetchGroupLivesConfig(groupId) {
  if (groupId == null || groupId === '') {
    return { ok: false };
  }

  const result = await getJson(`/groups/${groupId}/lives-config`);
  if (!result.ok || !result.data || typeof result.data !== 'object') {
    return { ok: false };
  }

  const data = /** @type {{
    livesEnabled?: boolean,
    livesMax?: number | null,
    startingLives?: number | null,
    livesLabel?: string | null,
    livesIcon?: string | null,
    livesShopEnabled?: boolean,
  }} */ (result.data);

  return {
    ok: true,
    config: {
      livesEnabled: Boolean(data.livesEnabled),
      livesMax: data.livesMax == null ? null : Number(data.livesMax),
      startingLives: data.startingLives == null ? null : Number(data.startingLives),
      livesLabel: data.livesLabel?.trim() || DEFAULT_LIVES_LABEL,
      livesIcon: data.livesIcon?.trim() || DEFAULT_LIVES_SYMBOL,
      livesShopEnabled: Boolean(data.livesShopEnabled),
    },
  };
}

/**
 * Zapisuje konfigurację systemu żyć grupy.
 * PATCH /groups/:groupId/lives-config
 *
 * @param {string | number} groupId
 * @param {Record<string, unknown>} payload
 * @returns {Promise<{ ok: boolean, config?: GroupLivesConfig }>}
 */
export async function updateGroupLivesConfig(groupId, payload) {
  const result = await patchJson(`/groups/${groupId}/lives-config`, payload);
  return { ok: result.ok };
}
