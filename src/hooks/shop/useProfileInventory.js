import { useCallback, useEffect, useState } from 'react';
import {
  fetchGroupInventory,
  fetchStudentInventory,
  useGroupInventoryItem,
} from '../../services/shop.api.js';
import {
  GROUP_INVENTORY_INVALIDATED,
  invalidateGroupInventory,
  subscribeGroupScopedEvent,
} from '../../services/studentProfileEvents.js';

/**
 * @param {string | number | null | undefined} groupId
 * @param {{ studentAccountId?: string | number | null, readOnly?: boolean }} [options]
 */
export function useProfileInventory(groupId, { studentAccountId = null, readOnly = false } = {}) {
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

    const result = studentAccountId
      ? await fetchStudentInventory(groupId, studentAccountId)
      : await fetchGroupInventory(groupId);

    setIsLoading(false);

    if (result.ok) {
      setEntries(result.entries);
      return;
    }

    setEntries([]);
    setError(result.error ?? 'Nie udało się pobrać ekwipunku');
  }, [groupId, studentAccountId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!groupId || studentAccountId || readOnly) {
      return undefined;
    }

    return subscribeGroupScopedEvent(GROUP_INVENTORY_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        refetch();
      }
    });
  }, [groupId, studentAccountId, readOnly, refetch]);

  const useItem = useCallback(async (itemId) => {
    if (!groupId || !itemId || readOnly || studentAccountId) {
      return { ok: false, error: 'Nie można użyć przedmiotu' };
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

    invalidateGroupInventory(groupId);
    return { ok: true };
  }, [groupId, readOnly, studentAccountId]);

  return {
    entries,
    isLoading,
    error,
    refetch,
    useItem,
  };
}
