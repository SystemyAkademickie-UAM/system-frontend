import { useEffect, useMemo, useState } from 'react';
import { fetchUserGroups, filterGroups } from './groupsList.api.js';

export function useGroupsList() {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await fetchUserGroups();
        if (!cancelled) {
          setGroups(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Nie udało się pobrać listy grup.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadGroups();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleGroups = useMemo(() => filterGroups(groups, searchQuery), [groups, searchQuery]);

  return {
    groups: visibleGroups,
    searchQuery,
    setSearchQuery,
    isLoading,
    errorMessage,
    totalCount: groups.length,
  };
}
