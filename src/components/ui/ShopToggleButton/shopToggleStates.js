/** Konfiguracja stanów przycisku otwarcia/zamknięcia sklepu. */

export const SHOP_TOGGLE_STATE = {
  open: 'open',
  closed: 'closed',
};

/** @type {Record<string, { label: string, variant: 'primary' | 'danger' | 'secondary', nextState: string, ariaLabel: string }>} */
export const SHOP_TOGGLE_STATE_CONFIG = {
  [SHOP_TOGGLE_STATE.open]: {
    label: 'Zamknij sklep',
    variant: 'danger',
    nextState: SHOP_TOGGLE_STATE.closed,
    ariaLabel: 'Zamknij sklep dla uczestników',
  },
  [SHOP_TOGGLE_STATE.closed]: {
    label: 'Otwórz sklep',
    variant: 'primary',
    nextState: SHOP_TOGGLE_STATE.open,
    ariaLabel: 'Otwórz sklep dla uczestników',
  },
};

/**
 * @param {boolean} isShopOpen
 * @returns {keyof typeof SHOP_TOGGLE_STATE_CONFIG}
 */
export function resolveShopToggleState(isShopOpen) {
  return isShopOpen ? SHOP_TOGGLE_STATE.open : SHOP_TOGGLE_STATE.closed;
}
