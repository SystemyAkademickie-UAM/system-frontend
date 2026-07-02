import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buyGroupShopItem,
  deleteGroupShopItem,
  fetchGroupInventory,
  fetchGroupShopItems,
  fetchGroupShopOpenStatus,
  updateGroupShopItem,
  updateGroupShopOpenStatus,
  useGroupInventoryItem,
} from '../../services/shop.api.js';
import { getShopItemEffectivePrice } from '../../utils/shop/shopPricing.js';
import {
  getShopCartItemIds,
  setShopCartItemIds,
  setShopLivesBlocked,
  useShopCartItemIds,
  useShopLivesBlocked,
} from './groupShopState.js';

/**
 * @param {string | number | null | undefined} groupId
 */
export function useGroupShopItems(groupId) {
  const [items, setItemsState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async (options = {}) => {
    const silent = options.silent === true;

    if (!groupId) {
      setItemsState([]);
      if (!silent) {
        setIsLoading(false);
      }
      return { ok: false, error: 'Brak identyfikatora grupy' };
    }

    if (!silent) {
      setIsLoading(true);
      setError('');
    }

    const result = await fetchGroupShopItems(groupId);

    if (!silent) {
      setIsLoading(false);
    }

    if (result.ok) {
      setItemsState(result.items);
      return { ok: true };
    }

    setItemsState([]);
    const errorMessage = result.error ?? 'Nie udało się pobrać produktów sklepu';
    setError(errorMessage);
    return { ok: false, error: errorMessage };
  }, [groupId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteItem = useCallback(async (itemId) => {
    if (!groupId || !itemId) {
      return { ok: false, error: 'Brak identyfikatora produktu' };
    }

    const result = await deleteGroupShopItem(groupId, itemId);
    if (!result.ok) {
      return result;
    }

    setItemsState((current) => current.filter((item) => item.id !== String(itemId)));
    const cartIds = getShopCartItemIds(groupId).filter((id) => id !== String(itemId));
    setShopCartItemIds(groupId, cartIds);
    return { ok: true };
  }, [groupId]);

  const updateItem = useCallback(async (itemId, payload) => {
    if (!groupId || !itemId) {
      return { ok: false, error: 'Brak identyfikatora produktu' };
    }

    const result = await updateGroupShopItem(groupId, itemId, payload);
    if (!result.ok || !result.item) {
      return { ok: false, error: result.error ?? 'Nie udało się zapisać produktu' };
    }

    setItemsState((current) => current.map((item) => (
      item.id === String(itemId) ? result.item : item
    )));
    return { ok: true, item: result.item };
  }, [groupId]);

  const toggleAllPublished = useCallback(async (itemsToUpdate) => {
    if (!groupId || !Array.isArray(itemsToUpdate) || itemsToUpdate.length === 0) {
      return { ok: false, error: 'Brak produktów do aktualizacji' };
    }

    const targetPublished = itemsToUpdate.some((item) => item.isPublished === false);
    const itemsNeedingUpdate = itemsToUpdate.filter((item) => (
      (item.isPublished !== false) !== targetPublished
    ));

    if (itemsNeedingUpdate.length === 0) {
      return { ok: true, changed: 0, targetPublished };
    }

    const results = await Promise.all(
      itemsNeedingUpdate.map((item) => updateGroupShopItem(groupId, item.id, {
        isPublished: targetPublished,
      })),
    );

    const failed = results.find((result) => !result.ok);
    if (failed) {
      return { ok: false, error: failed.error ?? 'Nie udało się zmienić widoczności produktów' };
    }

    const updatedById = new Map(
      results
        .filter((result) => result.ok && result.item)
        .map((result) => [result.item.id, result.item]),
    );

    setItemsState((current) => current.map((item) => updatedById.get(item.id) ?? item));

    return { ok: true, changed: itemsNeedingUpdate.length, targetPublished };
  }, [groupId]);

  const buyItem = useCallback(async (itemId) => {
    if (!groupId || !itemId) {
      return { ok: false, error: 'Brak identyfikatora produktu' };
    }

    const result = await buyGroupShopItem(groupId, itemId);
    if (!result.ok) {
      return result;
    }

    await refetch();
    return { ok: true };
  }, [groupId, refetch]);

  return {
    items,
    isLoading,
    error,
    refetch,
    deleteItem,
    updateItem,
    toggleAllPublished,
    buyItem,
  };
}

/**
 * @param {string | number | null | undefined} groupId
 * @param {import('../../utils/shop/shopItem.types.js').ShopItem[]} [items]
 */
export function useGroupShopCart(groupId, items = []) {
  const cartItemIds = useShopCartItemIds(groupId);

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
    const normalizedId = String(itemId);
    const current = getShopCartItemIds(groupId);
    if (current.includes(normalizedId)) {
      return;
    }
    setShopCartItemIds(groupId, [...current, normalizedId]);
  }, [groupId]);

  const removeFromCart = useCallback((itemId) => {
    if (!groupId) {
      return;
    }
    setShopCartItemIds(
      groupId,
      getShopCartItemIds(groupId).filter((id) => id !== String(itemId)),
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
  const [isShopOpen, setIsShopOpenState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async (options = {}) => {
    const silent = options.silent === true;

    if (!groupId) {
      setIsShopOpenState(true);
      if (!silent) {
        setIsLoading(false);
      }
      return { ok: false, error: 'Brak identyfikatora grupy' };
    }

    if (!silent) {
      setIsLoading(true);
    }

    const result = await fetchGroupShopOpenStatus(groupId);

    if (!silent) {
      setIsLoading(false);
    }

    if (result.ok) {
      setIsShopOpenState(result.shopOpen);
      return { ok: true };
    }

    return { ok: false, error: result.error ?? 'Nie udało się pobrać statusu sklepu' };
  }, [groupId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleShopOpen = useCallback(async () => {
    if (!groupId) {
      return { ok: false };
    }

    const nextValue = !isShopOpen;
    const result = await updateGroupShopOpenStatus(groupId, nextValue);
    if (result.ok) {
      setIsShopOpenState(nextValue);
    }
    return result;
  }, [groupId, isShopOpen]);

  const openShop = useCallback(async () => {
    if (!groupId || isShopOpen) {
      return { ok: true };
    }
    return toggleShopOpen();
  }, [groupId, isShopOpen, toggleShopOpen]);

  const closeShop = useCallback(async () => {
    if (!groupId || !isShopOpen) {
      return { ok: true };
    }
    return toggleShopOpen();
  }, [groupId, isShopOpen, toggleShopOpen]);

  return {
    isShopOpen,
    isLoading,
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

/**
 * @param {string | number | null | undefined} groupId
 */
export function useGroupInventory(groupId) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!groupId) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await fetchGroupInventory(groupId);
    setIsLoading(false);

    if (result.ok) {
      setEntries(result.entries);
      return;
    }

    setEntries([]);
    setError(result.error ?? 'Nie udało się pobrać ekwipunku');
  }, [groupId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const useItem = useCallback(async (itemId) => {
    if (!groupId || !itemId) {
      return { ok: false, error: 'Brak identyfikatora przedmiotu' };
    }

    const result = await useGroupInventoryItem(groupId, itemId);
    if (!result.ok) {
      return result;
    }

    setEntries((current) => current
      .map((entry) => {
        if (entry.itemId !== Number(itemId)) {
          return entry;
        }
        const nextQuantity = entry.quantity - 1;
        if (nextQuantity <= 0) {
          return null;
        }
        return { ...entry, quantity: nextQuantity };
      })
      .filter(Boolean));

    return { ok: true };
  }, [groupId]);

  return {
    entries,
    isLoading,
    error,
    refetch,
    useItem,
  };
}
