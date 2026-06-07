import { useCallback, useEffect, useMemo, useState } from 'react';
import { getShopItemEffectivePrice } from './shopPricing.js';
import {
  getShopCartItemIds,
  setShopCartItemIds,
  setShopIsOpen,
  setShopLivesBlocked,
  useShopCartItemIds,
  useShopIsOpen,
  useShopLivesBlocked,
} from './groupShopState.js';
import { appendShopItems, readShopItems, writeShopItems, SHOP_ITEMS_EVENT } from './shopItemsStorage.js';

function subscribeShopItems(listener) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const onStorage = (event) => {
    if (event.key?.startsWith('maq-shop-items:')) {
      listener();
    }
  };
  const onCustom = () => listener();
  window.addEventListener('storage', onStorage);
  window.addEventListener(SHOP_ITEMS_EVENT, onCustom);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(SHOP_ITEMS_EVENT, onCustom);
  };
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function useGroupShopItems(groupId) {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }
    return subscribeShopItems(() => setRevision((value) => value + 1));
  }, [groupId]);

  const items = useMemo(() => {
    void revision;
    return readShopItems(groupId);
  }, [groupId, revision]);

  const setItems = useCallback((nextItems) => {
    if (!groupId) {
      return;
    }
    writeShopItems(groupId, nextItems);
  }, [groupId]);

  const addItems = useCallback((newItems) => {
    if (!groupId || newItems.length === 0) {
      return;
    }
    appendShopItems(groupId, newItems);
  }, [groupId]);

  const deleteItem = useCallback((itemId) => {
    if (!groupId) {
      return;
    }
    const nextItems = readShopItems(groupId).filter((item) => item.id !== itemId);
    writeShopItems(groupId, nextItems);

    const cartIds = getShopCartItemIds(groupId).filter((id) => id !== itemId);
    setShopCartItemIds(groupId, cartIds);
  }, [groupId]);

  return {
    items,
    setItems,
    addItems,
    deleteItem,
  };
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function useGroupShopCart(groupId) {
  const cartItemIds = useShopCartItemIds(groupId);
  const { items } = useGroupShopItems(groupId);

  const cartItems = useMemo(
    () => cartItemIds
      .map((id) => items.find((item) => item.id === id))
      .filter(Boolean),
    [cartItemIds, items],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + getShopItemEffectivePrice(item), 0),
    [cartItems],
  );

  const addToCart = useCallback((itemId) => {
    if (!groupId || !itemId) {
      return;
    }
    const current = getShopCartItemIds(groupId);
    if (current.includes(itemId)) {
      return;
    }
    setShopCartItemIds(groupId, [...current, itemId]);
  }, [groupId]);

  const removeFromCart = useCallback((itemId) => {
    if (!groupId) {
      return;
    }
    setShopCartItemIds(
      groupId,
      getShopCartItemIds(groupId).filter((id) => id !== itemId),
    );
  }, [groupId]);

  const clearCart = useCallback(() => {
    if (!groupId) {
      return;
    }
    setShopCartItemIds(groupId, []);
  }, [groupId]);

  return {
    cartItemIds,
    cartItems,
    cartCount: cartItemIds.length,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
  };
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function useGroupShopOpen(groupId) {
  const isShopOpen = useShopIsOpen(groupId);

  const toggleShopOpen = useCallback(() => {
    if (!groupId) {
      return;
    }
    setShopIsOpen(groupId, !isShopOpen);
  }, [groupId, isShopOpen]);

  const openShop = useCallback(() => {
    if (!groupId) {
      return;
    }
    setShopIsOpen(groupId, true);
  }, [groupId]);

  const closeShop = useCallback(() => {
    if (!groupId) {
      return;
    }
    setShopIsOpen(groupId, false);
  }, [groupId]);

  return {
    isShopOpen,
    toggleShopOpen,
    openShop,
    closeShop,
  };
}

/**
 * Tymczasowy mock systemu żyć — docelowo z API.
 *
 * @param {string | number | null | undefined} groupId
 */
export function useGroupShopLives(groupId) {
  const livesBlocked = useShopLivesBlocked(groupId);

  const toggleLivesBlocked = useCallback(() => {
    if (!groupId) {
      return;
    }
    setShopLivesBlocked(groupId, !livesBlocked);
  }, [groupId, livesBlocked]);

  const unblockLives = useCallback(() => {
    if (!groupId) {
      return;
    }
    setShopLivesBlocked(groupId, false);
  }, [groupId]);

  return {
    livesBlocked,
    toggleLivesBlocked,
    unblockLives,
  };
}
