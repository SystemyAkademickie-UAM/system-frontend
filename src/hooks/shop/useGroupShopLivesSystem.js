import { useCallback, useEffect, useState } from 'react';
import { fetchGroupLivesConfig } from '../../services/groupLives.api.js';
import { GROUP_LIVES_INVALIDATED } from '../../services/groupLivesEvents.js';
import { fetchGroupStudentProfile } from '../../services/studentProfile.api.js';
import { STUDENT_PROFILE_INVALIDATED, subscribeGroupScopedEvent } from '../../services/studentProfileEvents.js';

/**
 * @typedef {Object} GroupShopLivesState
 * @property {boolean} livesEnabled
 * @property {boolean} livesShopEnabled
 * @property {number | null} livesMax
 * @property {number | null} studentLives
 * @property {boolean} isGameOver
 * @property {boolean} showExtraLifeProduct
 * @property {boolean} isLoading
 * @property {() => Promise<void>} refetch
 */

/**
 * Stan systemu żyć dla sklepu — konfiguracja z /group-settings/lives + życia studenta z profilu.
 *
 * @param {string | number | null | undefined} groupId
 * @param {{ isStudentView?: boolean }} [options]
 * @returns {GroupShopLivesState}
 */
export function useGroupShopLivesSystem(groupId, { isStudentView = false } = {}) {
  const [livesEnabled, setLivesEnabled] = useState(false);
  const [livesShopEnabled, setLivesShopEnabled] = useState(false);
  const [livesMax, setLivesMax] = useState(null);
  const [studentLives, setStudentLives] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(groupId));

  const refetch = useCallback(async () => {
    if (!groupId) {
      setLivesEnabled(false);
      setLivesShopEnabled(false);
      setLivesMax(null);
      setStudentLives(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const configResult = await fetchGroupLivesConfig(groupId);
    if (configResult.ok && configResult.config) {
      setLivesEnabled(Boolean(configResult.config.livesEnabled));
      setLivesShopEnabled(Boolean(configResult.config.livesShopEnabled));
      setLivesMax(
        configResult.config.livesMax == null
          ? null
          : Number(configResult.config.livesMax),
      );
    } else {
      setLivesEnabled(false);
      setLivesShopEnabled(false);
      setLivesMax(null);
    }

    if (isStudentView) {
      const profileResult = await fetchGroupStudentProfile(groupId);
      if (profileResult.ok && profileResult.profile) {
        const livesValue = profileResult.profile.lives;
        setStudentLives(
          livesValue == null || Number.isNaN(Number(livesValue))
            ? null
            : Number(livesValue),
        );
      } else {
        setStudentLives(null);
      }
    } else {
      setStudentLives(null);
    }

    setIsLoading(false);
  }, [groupId, isStudentView]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    const unsubscribeLives = subscribeGroupScopedEvent(GROUP_LIVES_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        refetch();
      }
    });

    const unsubscribeProfile = isStudentView
      ? subscribeGroupScopedEvent(STUDENT_PROFILE_INVALIDATED, (eventGroupId) => {
        if (eventGroupId === String(groupId)) {
          refetch();
        }
      })
      : () => {};

    return () => {
      unsubscribeLives();
      unsubscribeProfile();
    };
  }, [groupId, isStudentView, refetch]);

  const isGameOver = isStudentView
    && livesEnabled
    && studentLives !== null
    && studentLives <= 0;

  const showExtraLifeProduct = livesEnabled && livesShopEnabled;

  return {
    livesEnabled,
    livesShopEnabled,
    livesMax,
    studentLives,
    isGameOver,
    showExtraLifeProduct,
    isLoading,
    refetch,
  };
}
