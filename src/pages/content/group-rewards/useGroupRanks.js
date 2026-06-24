import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notifyGroupContentChanged } from '../../../utils/groupContentInvalidation.js';
import { fetchGroupRanks, createRank, updateRank, deleteRank } from '../../../services/ranks.api.js';
import { fetchGroupStudents, bulkUpdateStudents } from '../../../services/students.api.js';

/**
 * @typedef {Object} RankData
 * @property {string} id - Unique rank ID (as string for UI)
 * @property {number} dbId - Database ID
 * @property {number} position
 * @property {string} name
 * @property {string} icon
 * @property {string} iconFile - Icon display name
 * @property {number} costAmount - Required points
 * @property {string} costEmoji
 * @property {string} storyDescription
 * @property {string[]} shopItems
 * @property {number} storeDiscount
 * @property {number} discount
 */

/**
 * Maps backend rank to frontend format.
 * @param {object} rank
 * @param {number} index
 * @returns {RankData}
 */
function mapRank(rank, index) {
  return {
    id: `rank-${rank.id}`,
    dbId: rank.id,
    position: index + 1,
    name: rank.name || 'Nieznana ranga',
    icon: rank.icon || '⭐',
    iconFile: rank.icon ? `backend:${rank.icon}` : '⭐',
    costAmount: rank.requiredPoints || 0,
    costEmoji: '🥕',
    storyDescription: rank.storyDescription || '',
    shopItems: rank.uniqueStoreItems || [],
    storeDiscount: rank.storeDiscount || 0,
    discount: Number(rank.discount ?? 0),
  };
}

/**
 * Hook for managing group ranks with real API.
 */
export function useGroupRanks() {
  const { groupId } = useParams();
  const [ranks, setRanks] = useState([]);
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
      const [ranksData, studentsData] = await Promise.all([
        fetchGroupRanks(groupId),
        fetchGroupStudents(groupId),
      ]);

      setRanks(ranksData.map(mapRank));
      setStudents(studentsData.map((s) => ({
        id: `student-${s.accountId}`,
        accountId: s.accountId,
        enrollmentId: s.enrollmentId,
        name: `${s.name} ${s.surname}`.trim() || s.nickname,
        rankId: s.rankId ? `rank-${s.rankId}` : null,
        dbRankId: s.rankId,
      })));
    } catch (err) {
      console.error('Failed to load ranks:', err);
      setError('Nie udało się pobrać rang');
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = useCallback(async (values) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const iconVal = values.iconFile || '⭐';
    const result = await createRank(groupId, {
      name: values.name,
      icon: iconVal.replace('backend:', ''),
      requiredPoints: values.costAmount || 0,
      storyDescription: values.storyDescription || '',
      storeDiscount: values.storeDiscount || 0,
      discount: values.discount ?? 0,
      uniqueStoreItems: values.shopItems || [],
    });

    if (result.ok && result.rank) {
      await loadData();
      notifyGroupContentChanged(groupId, 'ranks');
      return result;
    }

    return result;
  }, [groupId, loadData]);

  const handleUpdate = useCallback(async (rankId, values) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const rank = ranks.find((r) => r.id === rankId);
    if (!rank) return { ok: false, error: 'Ranga nie istnieje' };

    const iconVal = values.iconFile || values.icon;
    const result = await updateRank(groupId, rank.dbId, {
      name: values.name,
      icon: iconVal.replace('backend:', ''),
      requiredPoints: values.costAmount,
      storyDescription: values.storyDescription,
      storeDiscount: values.storeDiscount,
      discount: values.discount ?? 0,
      uniqueStoreItems: values.shopItems,
    });

    if (result.ok && result.rank) {
      setRanks((prev) => prev.map((r) =>
        r.id === rankId ? { ...r, ...mapRank(result.rank, r.position - 1) } : r
      ));
      notifyGroupContentChanged(groupId, 'ranks');
    }

    return result;
  }, [groupId, ranks]);

  const handleDelete = useCallback(async (rankId) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const rank = ranks.find((r) => r.id === rankId);
    if (!rank) return { ok: false, error: 'Ranga nie istnieje' };

    const result = await deleteRank(groupId, rank.dbId);

    if (result.ok) {
      setRanks((prev) => {
        const filtered = prev.filter((r) => r.id !== rankId);
        return filtered.map((r, i) => ({ ...r, position: i + 1 }));
      });
      setStudents((prev) => prev.map((s) =>
        s.rankId === rankId ? { ...s, rankId: null, dbRankId: null } : s
      ));
      notifyGroupContentChanged(groupId, 'ranks');
    }

    return result;
  }, [groupId, ranks]);

  const handleAssign = useCallback(async (rankId, selectedStudentIds) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const rank = ranks.find((r) => r.id === rankId);
    if (!rank) return { ok: false, error: 'Ranga nie istnieje' };

    const selectedSet = new Set(selectedStudentIds);
    const studentsToUpdate = students.reduce((updates, student) => {
      const hadThisRank = student.rankId === rankId;
      const shouldHaveRank = selectedSet.has(student.id);

      if (shouldHaveRank && !hadThisRank) {
        updates.push({ enrollmentId: student.enrollmentId, rankId: rank.dbId });
        return updates;
      }

      if (!shouldHaveRank && hadThisRank) {
        updates.push({ enrollmentId: student.enrollmentId, rankId: null });
      }

      return updates;
    }, []);

    if (studentsToUpdate.length === 0) {
      return { ok: true };
    }

    const result = await bulkUpdateStudents(groupId, studentsToUpdate);

    if (result.ok) {
      setStudents((prev) => prev.map((s) => {
        if (selectedSet.has(s.id)) {
          return { ...s, rankId, dbRankId: rank.dbId };
        }
        if (s.rankId === rankId) {
          return { ...s, rankId: null, dbRankId: null };
        }
        return s;
      }));
      notifyGroupContentChanged(groupId, 'ranks');
    }

    return result;
  }, [groupId, ranks, students]);

  return {
    groupId,
    ranks,
    students,
    isLoading,
    error,
    refetch: loadData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAssign,
  };
}
