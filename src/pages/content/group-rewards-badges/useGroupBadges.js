import { useCallback, useEffect, useState } from 'react';
import { formatStudentDisplayName } from '../../../utils/members/studentDisplayName.js';
import { useParams } from 'react-router-dom';
import { notifyGroupContentChanged } from '../../../utils/groupContentInvalidation.js';
import { fetchGroupBadges, createBadge, updateBadge, deleteBadge } from '../../../services/badges.api.js';
import { fetchGroupStudents } from '../../../services/students.api.js';
import { DEFAULT_BADGE_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';

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
  const icon = normalizeRankBadgeIcon(badge.icon, DEFAULT_BADGE_EMOJI);
  return {
    id: `badge-${badge.id}`,
    dbId: badge.id,
    position: index + 1,
    name: badge.name || 'Nieznana odznaka',
    icon,
    iconFile: icon,
    rarity: badge.rarity || 'common',
    storyDescription: badge.storyDescription || '',
    didacticDescription: badge.educationalDescription || '',
    rewardAmount: badge.rewardAmount || 0,
    isPublished: badge.isPublished !== false,
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
        name: formatStudentDisplayName(s),
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

    const icon = normalizeRankBadgeIcon(values.icon ?? values.iconFile, DEFAULT_BADGE_EMOJI);
    const shouldPublish = values.isPublished !== false;
    const result = await createBadge(groupId, {
      name: values.name,
      icon,
      educationalDescription: values.didacticDescription || '',
      storyDescription: values.storyDescription || '',
      rewardAmount: values.rewardAmount || 0,
      rarity: values.rarity || 'common',
    });

    if (!result.ok || !result.badge) {
      return result;
    }

    if (shouldPublish) {
      const publishResult = await updateBadge(groupId, result.badge.id, { isPublished: true });
      if (!publishResult.ok) {
        return publishResult;
      }
    }

    await loadData();
    notifyGroupContentChanged(groupId, 'badges');
    return result;
  }, [groupId, loadData]);

  const handleUpdate = useCallback(async (badgeId, values) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return { ok: false, error: 'Odznaka nie istnieje' };

    const icon = normalizeRankBadgeIcon(values.icon ?? values.iconFile, DEFAULT_BADGE_EMOJI);
    const result = await updateBadge(groupId, badge.dbId, {
      name: values.name,
      icon,
      educationalDescription: values.didacticDescription,
      storyDescription: values.storyDescription,
      rewardAmount: values.rewardAmount,
      rarity: values.rarity,
      ...(typeof values.isPublished === 'boolean' ? { isPublished: values.isPublished } : {}),
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

  const handleTogglePublished = useCallback(async (badgeId) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const badge = badges.find((item) => item.id === badgeId);
    if (!badge) return { ok: false, error: 'Odznaka nie istnieje' };

    const result = await updateBadge(groupId, badge.dbId, {
      isPublished: badge.isPublished === false,
    });

    if (result.ok && result.badge) {
      setBadges((prev) => prev.map((item) => (
        item.id === badgeId
          ? { ...item, ...mapBadge(result.badge, item.position - 1) }
          : item
      )));
      notifyGroupContentChanged(groupId, 'badges');
    }

    return result;
  }, [groupId, badges]);

  const handleToggleAllPublished = useCallback(async () => {
    if (!groupId || badges.length === 0) {
      return { ok: false, error: 'Brak odznak do aktualizacji' };
    }

    const targetPublished = badges.some((badge) => badge.isPublished === false);
    const badgesToUpdate = badges.filter((badge) => (
      (badge.isPublished !== false) !== targetPublished
    ));

    if (badgesToUpdate.length === 0) {
      return { ok: true, changed: 0, targetPublished };
    }

    const results = await Promise.all(
      badgesToUpdate.map((badge) => updateBadge(groupId, badge.dbId, {
        isPublished: targetPublished,
      })),
    );

    const failed = results.find((result) => !result.ok);
    if (failed) {
      return { ok: false, error: failed.error ?? 'Nie udało się zmienić widoczności odznak' };
    }

    const updatedByDbId = new Map(
      results
        .filter((result) => result.ok && result.badge)
        .map((result) => [result.badge.id, result.badge]),
    );

    setBadges((prev) => prev.map((badge) => {
      const updatedBadge = updatedByDbId.get(badge.dbId);
      if (!updatedBadge) {
        return badge;
      }

      return { ...badge, ...mapBadge(updatedBadge, badge.position - 1) };
    }));
    notifyGroupContentChanged(groupId, 'badges');

    return { ok: true, changed: badgesToUpdate.length, targetPublished };
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
    handleTogglePublished,
    handleToggleAllPublished,
  };
}
