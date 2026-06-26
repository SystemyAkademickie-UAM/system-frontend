import { getJson, patchJson } from './api-client.js';
import { DEFAULT_CURRENCY_SYMBOL } from '../constants/currency.constants.js';

/**
 * @typedef {Object} GroupCurrencyConfig
 * @property {string} currency
 * @property {string} currencyEmoji
 */

/**
 * Pobiera konfigurację waluty grupy.
 * Najpierw próbuje GET /groups/:id/currency (prowadzący-właściciel),
 * potem GET /groups/:id/preview (wszyscy z dostępem do grupy).
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, config?: GroupCurrencyConfig }>}
 */
export async function fetchGroupCurrencyConfig(groupId) {
  if (groupId == null || groupId === '') {
    return { ok: false };
  }

  const currencyResult = await getJson(`/groups/${groupId}/currency`);
  if (currencyResult.ok && currencyResult.data && typeof currencyResult.data === 'object') {
    const data = /** @type {{ currency?: string | null, currencyEmoji?: string | null }} */ (
      currencyResult.data
    );
    if (data.currency != null || data.currencyEmoji != null) {
      return {
        ok: true,
        config: {
          currency: data.currency?.trim() ?? '',
          currencyEmoji: data.currencyEmoji?.trim() || DEFAULT_CURRENCY_SYMBOL,
        },
      };
    }
  }

  const previewResult = await getJson(`/groups/${groupId}/preview`);
  if (previewResult.ok && previewResult.data && typeof previewResult.data === 'object') {
    const preview = /** @type {{ group?: { currency?: string | null, currencyEmoji?: string | null } | null }} */ (
      previewResult.data
    );
    if (preview.group) {
      return {
        ok: true,
        config: {
          currency: preview.group.currency?.trim() ?? '',
          currencyEmoji: preview.group.currencyEmoji?.trim() || DEFAULT_CURRENCY_SYMBOL,
        },
      };
    }
  }

  return { ok: false };
}

/**
 * Zapisuje konfigurację waluty grupy.
 * PATCH /groups/:groupId/currency
 *
 * @param {string | number} groupId
 * @param {{ currency?: string, currencyEmoji?: string }} payload
 * @returns {Promise<{ ok: boolean, config?: GroupCurrencyConfig }>}
 */
export async function updateGroupCurrencyConfig(groupId, payload) {
  const result = await patchJson(`/groups/${groupId}/currency`, payload);
  if (!result.ok || !result.data || typeof result.data !== 'object') {
    return { ok: false };
  }

  const data = /** @type {{ currency?: string | null, currencyEmoji?: string | null }} */ (result.data);
  return {
    ok: true,
    config: {
      currency: data.currency?.trim() ?? '',
      currencyEmoji: data.currencyEmoji?.trim() || DEFAULT_CURRENCY_SYMBOL,
    },
  };
}
