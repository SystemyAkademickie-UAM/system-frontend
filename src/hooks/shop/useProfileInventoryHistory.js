/**
 * @file useProfileInventoryHistory.js
 * @description Niestandardowy hook React enkapsulujący logikę dla useProfileInventoryHistory.
 */

// === IMPORTY I ZALEŻNOŚCI HOOKA ===
import { useCallback, useEffect, useState } from 'react';
import {
  fetchGroupInventoryHistory,
  fetchStudentInventoryHistory,
} from '../../services/shop.api.js';
import {
  GROUP_INVENTORY_INVALIDATED,
  subscribeGroupScopedEvent,
} from '../../services/studentProfileEvents.js';

/**
 * @param {string | number | null | undefined} groupId
 * @param {{ studentAccountId?: string | number | null }} [options]
 */

// === DEFINICJA HOOKA I ZARZĄDZANIE STANEM ===
export function useProfileInventoryHistory(groupId, { studentAccountId = null, enabled = true } = {}) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(enabled);

const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!groupId || !enabled) {
      if (!enabled) {
        setIsLoading(true);
      } else {
        setHistory([]);
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError('');

    const result = studentAccountId
      ? await fetchStudentInventoryHistory(groupId, studentAccountId)
      : await fetchGroupInventoryHistory(groupId);

    setIsLoading(false);

    if (result.ok) {
      setHistory(result.history);
      return;
    }

    setHistory([]);
    setError(result.error ?? 'Nie udało się pobrać historii ekwipunku');
  }, [groupId, studentAccountId, enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    return subscribeGroupScopedEvent(GROUP_INVENTORY_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        refetch();
      }
    });
  }, [groupId, refetch]);

// === ZWRACANY STAN I INTERFEJS ===
  return {
    history,
    isLoading,
    error,
    refetch,
  };
}
