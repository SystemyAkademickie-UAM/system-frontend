import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { subscribeGroupContentChanges } from '../../../utils/groupContentInvalidation.js';
import { fetchGroupPreview } from '../../../services/groups.api.js';
import { fetchGroupRanks } from '../../../services/ranks.api.js';
import { fetchGroupStudents } from '../../../services/students.api.js';
import { fetchGroupStudentProfile } from '../../../services/studentProfile.api.js';
import { fetchGroupShopItems } from '../../../services/shop.api.js';
import { resolveShopItemLabels } from '../../../utils/ranks/rankShopItemUnlock.js';
import {
  applyManualStudentRankStates,
  applyRankPathColors,
  applyStudentRankStates,
  mapStudentForRankPath,
  sortAndMapRanks,
} from './rankPathModel.js';

export function useGroupMainRanks() {
  const { groupId } = useParams();
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  const [ranks, setRanks] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [showMemberAvatars, setShowMemberAvatars] = useState(true);
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
      const ranksData = await fetchGroupRanks(groupId);
      const shopResult = await fetchGroupShopItems(groupId);
      const shopCatalog = shopResult.ok ? shopResult.items : [];
      const mappedRanks = sortAndMapRanks(ranksData).map((rank) => ({
        ...rank,
        shopItems: resolveShopItemLabels(rank.shopItems, shopCatalog),
      }));
      const preview = await fetchGroupPreview(groupId);
      const memberAvatarsVisible = preview.group?.rankShowMemberAvatars !== false;
      setShowMemberAvatars(memberAvatarsVisible);

      if (isStudentView) {
        const profileResult = await fetchGroupStudentProfile(groupId);
        if (!profileResult.ok || !profileResult.profile) {
          setError(profileResult.error || 'Nie udało się pobrać profilu studenta');
          setRanks([]);
          setStudentProfile(null);
          return;
        }

        setStudentProfile(profileResult.profile);
        setStudents([]);
        const profile = profileResult.profile;
        const isManualRank = profile.autoRankEnabled === false;
        if (isManualRank && profile.rankId != null) {
          setRanks(applyManualStudentRankStates(mappedRanks, profile.rankId));
        } else {
          setRanks(applyStudentRankStates(mappedRanks, profile.totalEarned ?? 0));
        }
        return;
      }

      const studentsData = await fetchGroupStudents(groupId);
      const coloredRanks = applyRankPathColors(mappedRanks);
      setRanks(coloredRanks);
      setStudents(studentsData.map((student) => mapStudentForRankPath(student, coloredRanks)));
      setStudentProfile(null);
    } catch (loadError) {
      console.error('Failed to load rank path:', loadError);
      setError('Nie udało się pobrać ścieżki rozwoju');
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
    return subscribeGroupContentChanges(groupId, ['ranks'], () => {
      loadData({ silent: true });
    });
  }, [groupId, loadData]);

  return {
    groupId,
    ranks,
    students,
    studentProfile,
    isLoading,
    error,
    isStudentView,
    showMemberAvatars,
    refetch: () => loadData(),
  };
}

