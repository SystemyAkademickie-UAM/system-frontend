import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupStudentProfile } from '../../../services/studentProfile.api.js';

export function useGroupStudentProfile() {
  const { groupId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!groupId) {
      setError('Brak ID grupy');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await fetchGroupStudentProfile(groupId);

    setIsLoading(false);

    if (result.ok && result.profile) {
      setProfile(result.profile);
      return;
    }

    setProfile(null);
    setError(result.error || 'Nie udało się pobrać profilu studenta');
  }, [groupId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    groupId,
    profile,
    isLoading,
    error,
    refetch: loadProfile,
  };
}
