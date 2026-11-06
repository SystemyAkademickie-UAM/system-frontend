/**
 * @file groupCurrencyEvents.js
 * @description Moduł komunikacji z API backendu realizujący operacje dla groupCurrencyEvents.
 */

// === IMPORTY I KONFIGURACJA KLIENTA API ===
export const GROUP_CURRENCY_INVALIDATED = 'maq-group-currency-invalidated';

/**
 * @param {string | number | null | undefined} groupId
 */

// === OPERACJE I ZAPYTANIA REST API ===
export function invalidateGroupCurrency(groupId) {
  if (typeof window === 'undefined' || groupId == null) {
    return;
  }

window.dispatchEvent(new CustomEvent(GROUP_CURRENCY_INVALIDATED, {
    detail: { groupId: String(groupId) },
  }));
}
