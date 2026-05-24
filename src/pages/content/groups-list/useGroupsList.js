import { useEffect, useMemo, useState } from 'react';
import { fetchGroupsCatalog, filterGroups } from './groupsList.api.js';

export function useGroupsList() {
  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await fetchGroupsCatalog();
        if (!cancelled) {
          setMyGroups(data.myGroups);
          setOtherGroups(data.otherGroups);
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
  };
}
