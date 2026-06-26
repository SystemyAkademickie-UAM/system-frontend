export const GROUP_CURRENCY_INVALIDATED = 'maq-group-currency-invalidated';

/**
 * @param {string | number | null | undefined} groupId
 */
export function invalidateGroupCurrency(groupId) {
  if (typeof window === 'undefined' || groupId == null) {
    return;
  }
  window.dispatchEvent(new CustomEvent(GROUP_CURRENCY_INVALIDATED, {
    detail: { groupId: String(groupId) },
  }));
}
