import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { subscribeGroupContentChanges } from '../../../utils/groupContentInvalidation.js';
import { fetchGroupBadges } from '../../../services/badges.api.js';
import { fetchGroupStudents, fetchStudentBadges } from '../../../services/students.api.js';
import { fetchGroupStudentProfile } from '../../../services/studentProfile.api.js';
import {
  buildEarnersByBadgeId,
  mapBadgeForTreasury,
} from './badgeTreasuryModel.js';

export function useGroupMainBadges() {
  const { groupId } = useParams();
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  const [badges, setBadges] = useState([]);
  /** @type {[Map<number, import('./badgeTreasuryModel.js').TreasuryStudent[]>, Function]} */
  const [earnersByBadgeId, setEarnersByBadgeId] = useState(() => new Map());
  const [studentAccountId, setStudentAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!groupId) {
      setError('Brak ID grupy');
      setIsLoading(false);
      return;
    }

    if (!silent) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [badgesData, studentsData] = await Promise.all([
        fetchGroupBadges(groupId),
        fetchGroupStudents(groupId),
      ]);

      const earnersMap = await buildEarnersByBadgeId(groupId, studentsData, fetchStudentBadges);

      if (isStudentView) {
        const profileResult = await fetchGroupStudentProfile(groupId);

        if (!profileResult.ok || !profileResult.profile) {
          setError(profileResult.error || 'Nie udało się pobrać profilu studenta');
          setBadges([]);
          setEarnersByBadgeId(new Map());
          setStudentAccountId(null);
          return;
        }

        const earnedBadgeIds = new Set(
          (profileResult.profile.earnedBadges ?? []).map((badge) => badge.id),
        );

        setStudentAccountId(profileResult.profile.studentAccountId);
        setBadges(badgesData.map((badge, index) => mapBadgeForTreasury(badge, index, earnedBadgeIds)));
        setEarnersByBadgeId(earnersMap);
        return;
      }

      setStudentAccountId(null);
      setBadges(badgesData.map((badge, index) => mapBadgeForTreasury(badge, index)));
      setEarnersByBadgeId(earnersMap);
    } catch (loadError) {
      console.error('Failed to load badge treasury:', loadError);
      setError('Nie udało się pobrać skarbca odznak');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [groupId, isStudentView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    return subscribeGroupContentChanges(groupId, ['badges'], () => {
      loadData({ silent: true });
    });
  }, [groupId, loadData]);

  return {
    groupId,
    badges,
    earnersByBadgeId,
    studentAccountId,
    isLoading,
    error,
    isStudentView,
    refetch: () => loadData(),
  };
}
