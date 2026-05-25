import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchGroupsCatalog, filterGroups } from './groupsList.api.js';

export function useGroupsList() {
  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadGroups = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchGroupsCatalog();
      setMyGroups(data.myGroups);
      setOtherGroups(data.otherGroups);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nie udało się pobrać listy grup.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const visibleMyGroups = useMemo(
    () => filterGroups(myGroups, searchQuery),
    [myGroups, searchQuery],
  );
  const visibleOtherGroups = useMemo(
    () => filterGroups(otherGroups, searchQuery),
    [otherGroups, searchQuery],
  );

  return {
    myGroups: visibleMyGroups,
    otherGroups: visibleOtherGroups,
    searchQuery,
    setSearchQuery,
    isLoading,
    errorMessage,
    totalCount: myGroups.length + otherGroups.length,
    refetch: loadGroups,
  };
}
