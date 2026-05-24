import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupStudents, removeStudent, bulkUpdateStudents } from '../../../services/students.api.js';
import { fetchGroupRanks } from '../../../services/ranks.api.js';
import { fetchGroupBadges } from '../../../services/badges.api.js';

/**
 * @typedef {Object} MemberData
 * @property {string} id - Unique member ID (enrollment ID as string)
 * @property {number} enrollmentId
 * @property {number} accountId
 * @property {number} position
 * @property {string} name - Full name (name + surname)
 * @property {string} nickname
 * @property {string} email
 * @property {string} avatar
 * @property {number | null} rankId
 * @property {string} rank - Rank name (resolved from rankId)
 * @property {number} currency
 * @property {number} totalCurrency
 * @property {number} badgesCount
 */

const AVATAR_BASE = 'https://api.dicebear.com/7.x/adventurer/svg?seed=';

/**
 * Generates avatar URL from email or name.
 * @param {string} email
 * @param {string} name
 * @returns {string}
 */
function generateAvatar(email, name) {
  const seed = email.split('@')[0] || name.replace(/\s+/g, '') || 'default';
  return `${AVATAR_BASE}${encodeURIComponent(seed)}`;
}

/**
 * Hook for managing group members with real API.
 */
export function useGroupMembers() {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [badges, setBadges] = useState([]);
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
      const [studentsData, ranksData, badgesData] = await Promise.all([
        fetchGroupStudents(groupId),
        fetchGroupRanks(groupId),
        fetchGroupBadges(groupId),
      ]);

      setRanks(ranksData);
      setBadges(badgesData);

      const ranksMap = new Map(ranksData.map((r) => [r.id, r.name]));

      const mappedMembers = studentsData.map((student, index) => ({
        id: `member-${student.enrollmentId}`,
        enrollmentId: student.enrollmentId,
        accountId: student.accountId,
        position: index + 1,
        name: `${student.name} ${student.surname}`.trim() || student.nickname || student.email,
        nickname: student.nickname,
        email: student.email,
        avatar: generateAvatar(student.email, student.nickname),
        rankId: student.rankId,
        rank: student.rankId ? (ranksMap.get(student.rankId) || 'Brak rangi') : 'Brak rangi',
        currency: student.currency,
        totalCurrency: student.totalEarned,
        badgesCount: 0,
      }));

      setMembers(mappedMembers);
    } catch (err) {
      console.error('Failed to load group members:', err);
      setError('Nie udało się pobrać listy członków grupy');
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateMember = useCallback((memberId, patch) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === memberId ? { ...item, ...patch } : item))
    );
  }, []);

  const deleteMember = useCallback(async (member) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const result = await removeStudent(groupId, member.accountId);
    if (result.ok) {
      setMembers((prev) => prev.filter((item) => item.id !== member.id));
    }
    return result;
  }, [groupId]);

  const updateMemberRank = useCallback(async (member, newRankId) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const result = await bulkUpdateStudents(groupId, [
      { enrollmentId: member.enrollmentId, rankId: newRankId },
    ]);

    if (result.ok) {
      const rankName = newRankId
        ? (ranks.find((r) => r.id === newRankId)?.name || 'Brak rangi')
        : 'Brak rangi';
      updateMember(member.id, { rankId: newRankId, rank: rankName });
    }
    return result;
  }, [groupId, ranks, updateMember]);

  const updateMemberCurrency = useCallback(async (member, currency, totalEarned) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const result = await bulkUpdateStudents(groupId, [
      { enrollmentId: member.enrollmentId, currency, totalEarned },
    ]);

    if (result.ok) {
      updateMember(member.id, { currency, totalCurrency: totalEarned });
    }
    return result;
  }, [groupId, updateMember]);

  const rankNames = ranks.map((r) => r.name);

  return {
    groupId,
    members,
    ranks,
    rankNames,
    badges,
    isLoading,
    error,
    refetch: loadData,
    updateMember,
    deleteMember,
    updateMemberRank,
    updateMemberCurrency,
  };
}
