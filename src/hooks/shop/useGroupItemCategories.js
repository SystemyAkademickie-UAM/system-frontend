import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchGroupItemCategories } from '../../services/itemCategories.api.js';

/**
 * @param {string | number | undefined} groupId
 */
export function useGroupItemCategories(groupId) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!groupId) {
      setCategories([]);
      return { ok: true, categories: [] };
    }

    setIsLoading(true);
    setError('');
    const result = await fetchGroupItemCategories(groupId);
    if (!result.ok) {
      setCategories([]);
      setError(result.error ?? 'Nie udało się pobrać kategorii.');
      setIsLoading(false);
      return result;
    }

    setCategories(result.categories);
    setIsLoading(false);
    return result;
  }, [groupId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category])),
    [categories],
  );

  return {
    categories,
    categoriesById,
    isLoading,
    error,
    refetch,
  };
}
