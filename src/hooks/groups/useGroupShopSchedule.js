import { useCallback, useEffect, useState } from 'react';
import { fetchGroupPreview, updateGroup } from '../../services/groups.api.js';

/**
 * @param {string | number | null | undefined} groupId
 */
export function useGroupRankPathSettings(groupId) {
  const [showMemberAvatars, setShowMemberAvatars] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!groupId) {
      setShowMemberAvatars(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const preview = await fetchGroupPreview(groupId);
    setShowMemberAvatars(preview.group?.rankShowMemberAvatars !== false);
    setIsLoading(false);
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleShowMemberAvatars = useCallback(async () => {
    if (!groupId) {
      return { ok: false, error: 'Brak ID grupy' };
    }

    const nextValue = !showMemberAvatars;
    const result = await updateGroup(groupId, { rankShowMemberAvatars: nextValue });
    if (!result.ok) {
      return { ok: false, error: result.error ?? 'Nie udało się zapisać ustawienia.' };
    }

    setShowMemberAvatars(nextValue);
    return { ok: true };
  }, [groupId, showMemberAvatars]);

  return {
    showMemberAvatars,
    isLoading,
    toggleShowMemberAvatars,
    refetch: load,
  };
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function useGroupShopSchedule(groupId) {
  const [shopOpensAt, setShopOpensAt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!groupId) {
      setShopOpensAt(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const preview = await fetchGroupPreview(groupId);
    setShopOpensAt(preview.group?.shopOpensAt ?? null);
    setIsLoading(false);
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  const scheduleShopOpen = useCallback(async (isoDate) => {
    if (!groupId) {
      return { ok: false, error: 'Brak ID grupy' };
    }

    const result = await updateGroup(groupId, { shopOpensAt: isoDate });
    if (result.ok) {
      setShopOpensAt(isoDate);
      return { ok: true };
    }
    return { ok: false, error: result.error ?? 'Nie udało się zapisać harmonogramu otwarcia sklepu.' };
  }, [groupId]);

  return {
    shopOpensAt,
    isLoading,
    scheduleShopOpen,
    refetch: load,
  };
}
