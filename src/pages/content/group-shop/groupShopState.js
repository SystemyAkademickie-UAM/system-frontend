import { useCallback, useMemo, useSyncExternalStore } from 'react';

const SHOP_OPEN_PREFIX = 'maq-shop-open:';
const SHOP_CART_PREFIX = 'maq-shop-cart:';
const SHOP_LIVES_BLOCKED_PREFIX = 'maq-shop-lives-blocked:';
const SHOP_STATE_EVENT = 'maq-shop-state-change';

/** @type {Set<() => void>} */
const listeners = new Set();

function emitShopStateChange() {
  listeners.forEach((listener) => listener());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SHOP_STATE_EVENT));
  }
}

function subscribeShopState(listener) {
  listeners.add(listener);

  if (typeof window !== 'undefined') {
    const onStorage = (event) => {
      if (
        event.key?.startsWith(SHOP_OPEN_PREFIX)
        || event.key?.startsWith(SHOP_CART_PREFIX)
        || event.key?.startsWith(SHOP_LIVES_BLOCKED_PREFIX)
      ) {
        listener();
      }
    };
    const onCustom = () => listener();
    window.addEventListener('storage', onStorage);
    window.addEventListener(SHOP_STATE_EVENT, onCustom);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SHOP_STATE_EVENT, onCustom);
    };
  }

  return () => listeners.delete(listener);
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function getShopIsOpen(groupId) {
  if (!groupId || typeof window === 'undefined') {
    return true;
  }
  return sessionStorage.getItem(`${SHOP_OPEN_PREFIX}${groupId}`) !== 'closed';
}

/**
 * @param {string | number} groupId
 * @param {boolean} isOpen
 */
export function setShopIsOpen(groupId, isOpen) {
  sessionStorage.setItem(`${SHOP_OPEN_PREFIX}${groupId}`, isOpen ? 'open' : 'closed');
  emitShopStateChange();
}

/**
 * @param {string | number | null | undefined} groupId
 * @returns {string[]}
 */
export function getShopCartItemIds(groupId) {
  if (!groupId || typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(`${SHOP_CART_PREFIX}${groupId}`);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Snapshot dla useSyncExternalStore — musi zwracać stabilną wartość (string),
 * bo nowa tablica [] !== poprzednia [] i powoduje nieskończony re-render.
 *
 * @param {string | number | null | undefined} groupId
 */
function getShopCartItemIdsSnapshot(groupId) {
  if (!groupId || typeof window === 'undefined') {
    return '[]';
  }
  return sessionStorage.getItem(`${SHOP_CART_PREFIX}${groupId}`) ?? '[]';
}

/**
 * @param {string | number} groupId
 * @param {string[]} itemIds
 */
export function setShopCartItemIds(groupId, itemIds) {
  sessionStorage.setItem(`${SHOP_CART_PREFIX}${groupId}`, JSON.stringify(itemIds));
  emitShopStateChange();
}

/**
 * Tymczasowy mock braku żyć — docelowo z API użytkownika.
 * @param {string | number | null | undefined} groupId
 */
export function getShopLivesBlocked(groupId) {
  if (!groupId || typeof window === 'undefined') {
    return false;
  }
  return sessionStorage.getItem(`${SHOP_LIVES_BLOCKED_PREFIX}${groupId}`) === 'true';
}

/**
 * @param {string | number} groupId
 * @param {boolean} blocked
 */
export function setShopLivesBlocked(groupId, blocked) {
  sessionStorage.setItem(`${SHOP_LIVES_BLOCKED_PREFIX}${groupId}`, blocked ? 'true' : 'false');
  emitShopStateChange();
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function useShopLivesBlocked(groupId) {
  const getSnapshot = useCallback(
    () => getShopLivesBlocked(groupId),
    [groupId],
  );

  return useSyncExternalStore(subscribeShopState, getSnapshot, () => false);
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function useShopIsOpen(groupId) {
  const getSnapshot = useCallback(
    () => getShopIsOpen(groupId),
    [groupId],
  );

  return useSyncExternalStore(subscribeShopState, getSnapshot, () => true);
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function useShopCartItemIds(groupId) {
  const getSnapshot = useCallback(
    () => getShopCartItemIdsSnapshot(groupId),
    [groupId],
  );

  const snapshot = useSyncExternalStore(subscribeShopState, getSnapshot, () => '[]');

  return useMemo(() => {
    try {
      const parsed = JSON.parse(snapshot);
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }, [snapshot]);
}
