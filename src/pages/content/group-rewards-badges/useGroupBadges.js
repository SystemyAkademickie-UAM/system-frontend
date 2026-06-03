import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notifyGroupContentChanged } from '../../../utils/groupContentInvalidation.js';
import { fetchGroupBadges, createBadge, updateBadge, deleteBadge } from '../../../services/badges.api.js';
import { fetchGroupStudents } from '../../../services/students.api.js';

/**
 * @typedef {Object} BadgeData
 * @property {string} id - Unique badge ID (as string for UI)
 * @property {number} dbId - Database ID
 * @property {number} position
 * @property {string} name
 * @property {string} icon
 * @property {string} iconFile - Icon display name
 * @property {string} rarity
 * @property {string} storyDescription
 * @property {string} didacticDescription
 * @property {number} rewardAmount
 * @property {string} rewardEmoji
 */

/**
 * Maps backend badge to frontend format.
 * @param {object} badge
 * @param {number} index
 * @returns {BadgeData}
 */
function mapBadge(badge, index) {
  return {
    id: `badge-${badge.id}`,
    dbId: badge.id,
    position: index + 1,
    name: badge.name || 'Nieznana odznaka',
    icon: badge.icon || '🏅',
    iconFile: badge.icon || '🏅',
    rarity: badge.rarity || 'common',
    storyDescription: badge.storyDescription || '',
    didacticDescription: badge.educationalDescription || '',
    rewardAmount: badge.rewardAmount || 0,
    rewardEmoji: '🥕',
  };
}

/**
 * Hook for managing group badges with real API.
 */
export function useGroupBadges() {
  const { groupId } = useParams();
  const [badges, setBadges] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!groupId) {
      setError('Brak ID grupy');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [badgesData, studentsData] = await Promise.all([
        fetchGroupBadges(groupId),
        fetchGroupStudents(groupId),
      ]);

      setBadges(badgesData.map(mapBadge));
      setStudents(studentsData.map((s) => ({
        id: `student-${s.accountId}`,
        accountId: s.accountId,
        enrollmentId: s.enrollmentId,
        name: `${s.name} ${s.surname}`.trim() || s.nickname,
        earnedBadgeIds: [],
      })));
    } catch (err) {
      console.error('Failed to load badges:', err);
      setError('Nie udało się pobrać odznak');
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = useCallback(async (values) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const result = await createBadge(groupId, {
      name: values.name,
      icon: values.iconFile || '🏅',
      educationalDescription: values.didacticDescription || '',
      storyDescription: values.storyDescription || '',
      rewardAmount: values.rewardAmount || 0,
      rarity: values.rarity || 'common',
    });

    if (result.ok && result.badge) {
      await loadData();
      notifyGroupContentChanged(groupId, 'badges');
      return result;
    }

    return result;
  }, [groupId, loadData]);

  const handleUpdate = useCallback(async (badgeId, values) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return { ok: false, error: 'Odznaka nie istnieje' };

    const result = await updateBadge(groupId, badge.dbId, {
      name: values.name,
      icon: values.iconFile || values.icon,
      educationalDescription: values.didacticDescription,
      storyDescription: values.storyDescription,
      rewardAmount: values.rewardAmount,
      rarity: values.rarity,
    });

    if (result.ok && result.badge) {
      setBadges((prev) => prev.map((b) =>
        b.id === badgeId ? { ...b, ...mapBadge(result.badge, b.position - 1) } : b
      ));
      notifyGroupContentChanged(groupId, 'badges');
    }

    return result;
  }, [groupId, badges]);

  const handleDelete = useCallback(async (badgeId) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return { ok: false, error: 'Odznaka nie istnieje' };

    const result = await deleteBadge(groupId, badge.dbId);

    if (result.ok) {
      setBadges((prev) => {
        const filtered = prev.filter((b) => b.id !== badgeId);
        return filtered.map((b, i) => ({ ...b, position: i + 1 }));
      });
      setStudents((prev) => prev.map((s) => ({
        ...s,
        earnedBadgeIds: s.earnedBadgeIds.filter((id) => id !== badgeId),
      })));
      notifyGroupContentChanged(groupId, 'badges');
    }

    return result;
  }, [groupId, badges]);

  return {
    groupId,
    badges,
    students,
    isLoading,
    error,
    refetch: loadData,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
