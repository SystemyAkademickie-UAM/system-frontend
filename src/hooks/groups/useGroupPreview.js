import { useEffect, useState } from 'react';
import { fetchGroupPreview } from '../../services/groups.api.js';

/**
 * @typedef {Object} GroupPreviewState
 * @property {import('../../services/groups.api.js').GroupListItem | null} group
 * @property {boolean} hasAccess
 * @property {boolean} isOwner
 * @property {boolean} isEnrolled
 * @property {boolean} isLoading
 * @property {string} errorMessage
 */

/**
 * Pobiera metadane grupy i flagi dostępu z backendu.
 * @param {string | undefined} groupId
 * @returns {GroupPreviewState}
 */
export function useGroupPreview(groupId) {
  const [group, setGroup] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      if (!groupId) {
        setGroup(null);
        setHasAccess(false);
        setIsOwner(false);
        setIsEnrolled(false);
        setErrorMessage('Brak identyfikatora grupy.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchGroupPreview(groupId);
        if (cancelled) return;

        if (!data.group) {
          setGroup(null);
          setHasAccess(false);
          setIsOwner(false);
          setIsEnrolled(false);
          setErrorMessage('Nie znaleziono grupy o podanym identyfikatorze.');
          return;
        }

        setGroup(data.group);
        setHasAccess(data.hasAccess);
        setIsOwner(data.isOwner);
        setIsEnrolled(data.isEnrolled);
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

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return { group, hasAccess, isOwner, isEnrolled, isLoading, errorMessage };
}
