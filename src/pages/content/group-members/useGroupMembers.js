import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { fetchGroupStudents, fetchStudentBadges, removeStudent, bulkUpdateStudents } from '../../../services/students.api.js';

import { fetchGroupRanks } from '../../../services/ranks.api.js';

import { fetchGroupBadges } from '../../../services/badges.api.js';

import { generateMemberAvatarFallback } from '../../../utils/members/membersLecturerRow.js';
import { detectRankPromotion } from '../../../utils/ranks/rankPromotion.js';
import {
  AUTO_RANK_OPTION,
  isAutoRankEnabled,
  resolveRankIdFromTotalEarned,
  resolveRankNameFromTotalEarned,
} from '../../../utils/ranks/autoRankAssignment.js';



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
 * @property {boolean} autoRankEnabled
 */



function generateAvatarFallback(email, nickname) {
  const seed = email.split('@')[0] || nickname.replace(/\s+/g, '') || 'default';
  return generateMemberAvatarFallback(seed);
}



async function resolveBadgesCount(groupId, student) {

  if (typeof student.badgesCount === 'number') {

    return student.badgesCount;

  }



  const studentBadges = await fetchStudentBadges(groupId, student.accountId);

  return studentBadges.filter((badge) => badge.isEarned).length;

}



function mapStudentToMember(student, index, ranksMap, badgesCount) {

  return {

    id: `member-${student.enrollmentId}`,

    enrollmentId: student.enrollmentId,

    accountId: student.accountId,

    position: index + 1,

    name: `${student.name} ${student.surname}`.trim() || student.nickname || student.email,

    nickname: student.nickname,

    email: student.email,

    avatar: student.avatarUrl || generateAvatarFallback(student.email, student.nickname),

    rankId: student.rankId,

    rank: student.rankId ? (ranksMap.get(student.rankId) || 'Brak rangi') : 'Brak rangi',

    currency: student.currency,

    totalCurrency: student.totalEarned,

    badgesCount,

    autoRankEnabled: student.autoRankEnabled !== false,

  };

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



  const loadData = useCallback(async ({ silent = false } = {}) => {

    if (!groupId) {

      setError('Brak ID grupy');

      if (!silent) {

        setIsLoading(false);

      }

      return [];

    }



    if (!silent) {

      setIsLoading(true);

    }

    setError(null);



    try {

      const [studentsData, ranksData, badgesData] = await Promise.all([

        fetchGroupStudents(groupId),

        fetchGroupRanks(groupId),

        fetchGroupBadges(groupId),

      ]);



      setRanks(ranksData);

      setBadges(badgesData);



      const ranksMap = new Map(ranksData.map((rank) => [rank.id, rank.name]));



      const badgeCounts = await Promise.all(

        studentsData.map((student) => resolveBadgesCount(groupId, student)),

      );



      const mappedMembers = studentsData.map((student, index) => (

        mapStudentToMember(student, index, ranksMap, badgeCounts[index] ?? 0)

      ));

      setMembers(mappedMembers);

      return mappedMembers;

    } catch (err) {

      console.error('Failed to load group members:', err);

      setError('Nie udało się pobrać listy członków grupy');

      return [];

    } finally {

      if (!silent) {

        setIsLoading(false);

      }

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



  const syncMemberStats = useCallback(async (member) => {

    if (!groupId) return { ok: false, error: 'Brak ID grupy' };



    const studentsData = await fetchGroupStudents(groupId);

    const student = studentsData.find((item) => item.enrollmentId === member.enrollmentId);



    if (!student) {

      return { ok: false, error: 'Nie znaleziono uczestnika' };

    }



    const ranksMap = new Map(ranks.map((rank) => [rank.id, rank.name]));

    const badgesCount = await resolveBadgesCount(groupId, student);

    const freshMember = mapStudentToMember(student, member.position - 1, ranksMap, badgesCount);

    const promotedRankName = detectRankPromotion(ranks, member, freshMember);



    updateMember(member.id, {

      rankId: freshMember.rankId,

      rank: freshMember.rank,

      currency: freshMember.currency,

      totalCurrency: freshMember.totalCurrency,

      badgesCount: freshMember.badgesCount,

      autoRankEnabled: freshMember.autoRankEnabled,

    });



    return { ok: true, promotedRankName };

  }, [groupId, ranks, updateMember]);



  const refetchWithRankNotice = useCallback(async (member) => {

    if (!member) {

      await loadData({ silent: true });

      return null;

    }



    const updatedMembers = await loadData({ silent: true });

    const freshMember = updatedMembers.find((item) => item.id === member.id);

    return detectRankPromotion(ranks, member, freshMember);

  }, [loadData, ranks]);



  const deleteMember = useCallback(async (member) => {

    if (!groupId || member.isLecturer) return { ok: false, error: 'Brak ID grupy' };



    const result = await removeStudent(groupId, member.accountId);

    if (result.ok) {

      setMembers((prev) => prev.filter((item) => item.id !== member.id));

    }

    return result;

  }, [groupId]);



  const updateMemberRank = useCallback(async (member, selection) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const isAutomatic = selection === AUTO_RANK_OPTION || selection?.mode === 'auto';
    const payload = { enrollmentId: member.enrollmentId };

    if (isAutomatic) {
      payload.autoRankEnabled = true;
      payload.rankId = resolveRankIdFromTotalEarned(ranks, member.totalCurrency);
    } else {
      const rankName = typeof selection === 'string' ? selection : selection?.rankName;
      const selectedRank = ranks.find((rank) => rank.name === rankName);
      payload.autoRankEnabled = false;
      payload.rankId = selectedRank?.id ?? null;
    }

    const result = await bulkUpdateStudents(groupId, [payload]);

    if (result.ok) {
      const rankName = isAutomatic
        ? resolveRankNameFromTotalEarned(ranks, member.totalCurrency)
        : (payload.rankId
          ? (ranks.find((rank) => rank.id === payload.rankId)?.name || 'Brak rangi')
          : 'Brak rangi');

      updateMember(member.id, {
        rankId: payload.rankId,
        rank: rankName,
        autoRankEnabled: isAutomatic,
      });
    }

    return result;
  }, [groupId, ranks, updateMember]);



  const updateMemberCurrency = useCallback(async (member, currency) => {

    if (!groupId) return { ok: false, error: 'Brak ID grupy' };



    const result = await bulkUpdateStudents(groupId, [

      { enrollmentId: member.enrollmentId, currency },

    ]);



    if (!result.ok) {

      return result;

    }



    const syncResult = await syncMemberStats(member);

    if (!syncResult.ok) {

      return syncResult;

    }



    return { ok: true, promotedRankName: syncResult.promotedRankName };

  }, [groupId, syncMemberStats]);



  const updateMemberTotalEarned = useCallback(async (member, totalEarned) => {

    if (!groupId) return { ok: false, error: 'Brak ID grupy' };



    const result = await bulkUpdateStudents(groupId, [

      { enrollmentId: member.enrollmentId, totalEarned },

    ]);



    if (!result.ok) {

      return result;

    }



    const syncResult = await syncMemberStats(member);

    if (!syncResult.ok) {

      return syncResult;

    }



    return { ok: true, promotedRankName: syncResult.promotedRankName };

  }, [groupId, syncMemberStats]);



  const rankNames = ranks.map((rank) => rank.name);



  return {

    groupId,

    members,

    ranks,

    rankNames,

    badges,

    isLoading,

    error,

    isAutoRankEnabled,

    refetch: () => loadData(),

    refetchWithRankNotice,

    updateMember,

    deleteMember,

    updateMemberRank,

    updateMemberCurrency,

    updateMemberTotalEarned,

  };

}


