import { useEffect, useState } from 'react';
import { fetchGroupById } from '../groups-list/groupsList.api.js';

export function useGroupDetails(groupId) {
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadGroup() {
      if (!groupId) {
        setGroup(null);
        setErrorMessage('Brak identyfikatora grupy.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchGroupById(groupId);
        if (cancelled) return;

        if (!data) {
          setGroup(null);
          setErrorMessage('Nie znaleziono grupy o podanym identyfikatorze.');
          return;
        }

        setGroup(data);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Nie udało się pobrać danych grupy.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadGroup();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return { group, isLoading, errorMessage };
}
