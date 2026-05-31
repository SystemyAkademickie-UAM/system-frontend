import { useCallback, useEffect, useState } from 'react';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import { useAppRole } from '../context/AppRoleContext.jsx';
import { fetchGroupStudentProfile, formatProfileNumber } from '../services/studentProfile.api.js';
import { useOptionalGroupId } from './useOptionalGroupId.js';

/**
 * Statystyki studenta w kontekście grupy (SuperBar: życia, waluta, zgromadzona).
 */
export function useStudentSuperBarStats() {
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const [livesDisplay, setLivesDisplay] = useState('0/0');
  const [currencyDisplay, setCurrencyDisplay] = useState('0');
  const [totalEarnedDisplay, setTotalEarnedDisplay] = useState('0');
  const [currencyLabel, setCurrencyLabel] = useState('Waluta');

  const loadStats = useCallback(async () => {
    if (role !== APP_ROLE.STUDENT || !groupId) {
      setLivesDisplay('0/0');
      setCurrencyDisplay('0');
      setTotalEarnedDisplay('0');
      setCurrencyLabel('Waluta');
      return;
    }

    const result = await fetchGroupStudentProfile(groupId);
    if (!result.ok || !result.profile) {
      return;
    }

    const { profile } = result;
    setLivesDisplay(profile.lives?.trim() || '0/0');
    setCurrencyDisplay(formatProfileNumber(profile.currency));
    setTotalEarnedDisplay(formatProfileNumber(profile.totalEarned));
    setCurrencyLabel(profile.groupCurrency?.trim() || 'Waluta');
  }, [role, groupId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    livesDisplay,
    currencyDisplay,
    totalEarnedDisplay,
    currencyLabel,
    refetch: loadStats,
  };
}
