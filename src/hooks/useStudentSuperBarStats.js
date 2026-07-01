import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGroupCurrency } from '../context/GroupCurrencyContext.jsx';
import { useGroupLives } from '../context/GroupLivesContext.jsx';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import { useAppRole } from '../context/AppRoleContext.jsx';
import { GROUP_CURRENCY_INVALIDATED } from '../services/groupCurrencyEvents.js';
import { GROUP_LIVES_INVALIDATED } from '../services/groupLivesEvents.js';
import { fetchGroupStudentProfile, formatProfileNumber } from '../services/studentProfile.api.js';
import {
  STUDENT_PROFILE_INVALIDATED,
  subscribeGroupScopedEvent,
} from '../services/studentProfileEvents.js';
import { useOptionalGroupId } from './useOptionalGroupId.js';

const DEFAULT_CURRENCY_LABEL = 'Waluta';
const DEFAULT_LIVES_LABEL = 'Życia';

/**
 * @param {number | string | null | undefined} lives
 * @returns {string}
 */
function formatLivesCount(lives) {
  if (lives == null || Number.isNaN(Number(lives))) {
    return '0';
  }
  return formatProfileNumber(Number(lives));
}

/**
 * @param {string | null | undefined} profileCurrency
 * @param {string | null | undefined} contextCurrency
 * @returns {string}
 */
function resolveCurrencyLabel(profileCurrency, contextCurrency) {
  const fromProfile = profileCurrency?.trim();
  if (fromProfile) {
    return fromProfile;
  }
  const fromContext = contextCurrency?.trim();
  if (fromContext) {
    return fromContext;
  }
  return DEFAULT_CURRENCY_LABEL;
}

/**
 * Statystyki studenta w kontekście grupy (SuperBar: życia, waluta, zgromadzona).
 */
export function useStudentSuperBarStats() {
  const { pathname } = useLocation();
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const { name: groupCurrencyName } = useGroupCurrency();
  const {
    label: groupLivesLabel,
    livesEnabled,
    livesMax,
    livesShopEnabled,
  } = useGroupLives();
  const [livesDisplay, setLivesDisplay] = useState('0');
  const [currencyDisplay, setCurrencyDisplay] = useState('0');
  const [totalEarnedDisplay, setTotalEarnedDisplay] = useState('0');
  const [currencyLabel, setCurrencyLabel] = useState(DEFAULT_CURRENCY_LABEL);
  const [livesLabel, setLivesLabel] = useState(DEFAULT_LIVES_LABEL);

  const loadStats = useCallback(async () => {
    if (role !== APP_ROLE.STUDENT || !groupId) {
      setLivesDisplay('0');
      setCurrencyDisplay('0');
      setTotalEarnedDisplay('0');
      setCurrencyLabel(DEFAULT_CURRENCY_LABEL);
      setLivesLabel(DEFAULT_LIVES_LABEL);
      return;
    }

    const result = await fetchGroupStudentProfile(groupId);
    if (!result.ok || !result.profile) {
      return;
    }

    const { profile } = result;
    setLivesDisplay(formatLivesCount(profile.lives));
    setCurrencyDisplay(formatProfileNumber(profile.currency));
    setTotalEarnedDisplay(formatProfileNumber(profile.totalEarned));
    setCurrencyLabel(resolveCurrencyLabel(profile.groupCurrency, groupCurrencyName));
    setLivesLabel(groupLivesLabel?.trim() || DEFAULT_LIVES_LABEL);
  }, [role, groupId, groupCurrencyName, groupLivesLabel]);

  useEffect(() => {
    loadStats();
  }, [loadStats, pathname, livesEnabled]);

  useEffect(() => {
    if (role !== APP_ROLE.STUDENT || !groupId) {
      return;
    }
    setLivesLabel(groupLivesLabel?.trim() || DEFAULT_LIVES_LABEL);
  }, [role, groupId, groupLivesLabel]);

  useEffect(() => {
    if (role !== APP_ROLE.STUDENT || !groupId) {
      return undefined;
    }

    const invalidate = () => loadStats();

    const unsubscribeProfile = subscribeGroupScopedEvent(STUDENT_PROFILE_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        invalidate();
      }
    });
    const unsubscribeCurrency = subscribeGroupScopedEvent(GROUP_CURRENCY_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        invalidate();
      }
    });
    const unsubscribeLives = subscribeGroupScopedEvent(GROUP_LIVES_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        invalidate();
      }
    });

    return () => {
      unsubscribeProfile();
      unsubscribeCurrency();
      unsubscribeLives();
    };
  }, [role, groupId, loadStats]);

  useEffect(() => {
    if (role !== APP_ROLE.STUDENT || !groupId || typeof document === 'undefined') {
      return undefined;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [role, groupId, loadStats]);

  useEffect(() => {
    if (!groupCurrencyName?.trim()) {
      return;
    }
    setCurrencyLabel((current) => (
      current === DEFAULT_CURRENCY_LABEL ? groupCurrencyName.trim() : current
    ));
  }, [groupCurrencyName]);

  return {
    livesDisplay,
    currencyDisplay,
    totalEarnedDisplay,
    currencyLabel,
    livesLabel,
    livesEnabled,
    livesMax,
    livesShopEnabled,
    refetch: loadStats,
  };
}
