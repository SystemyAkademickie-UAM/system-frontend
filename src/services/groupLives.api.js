import { getJson } from './api-client.js';
import { DEFAULT_LIVES_LABEL, DEFAULT_LIVES_SYMBOL } from '../constants/lives.constants.js';

/**
 * @typedef {Object} GroupLivesConfig
 * @property {string} livesLabel
 * @property {string} livesIcon
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

  const data = /** @type {{ livesLabel?: string | null, livesIcon?: string | null }} */ (result.data);

  return {
    ok: true,
    config: {
      livesLabel: data.livesLabel?.trim() || DEFAULT_LIVES_LABEL,
      livesIcon: data.livesIcon?.trim() || DEFAULT_LIVES_SYMBOL,
    },
  };
}
