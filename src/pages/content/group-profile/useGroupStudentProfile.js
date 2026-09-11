import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupStudentProfile } from '../../../services/studentProfile.api.js';
import { fetchGroupStudents, fetchStudentBadges } from '../../../services/students.api.js';
import { fetchGroupRanks } from '../../../services/ranks.api.js';

const PARTICIPANT_NOT_FOUND_ERROR__TEXTLABEL = {
  polish: 'Nie znaleziono uczestnika w tej grupie.',
  english: 'Participant not found in this group.'
};

const MISSING_GROUP_ID_ERROR__TEXTLABEL = {
  polish: 'Brak ID grupy',
  english: 'Group ID missing'
};

const NO_RANK_TEXT__TEXTLABEL = {
  polish: 'Brak rangi',
  english: 'No rank'
};

const PROFILE_LOAD_ERROR__TEXTLABEL = {
  polish: 'Nie udało się pobrać profilu studenta',
  english: 'Failed to load student profile'
};

async function loadStudentByIdentifier(groupId, studentId) {
  const [students, ranks] = await Promise.all([
    fetchGroupStudents(groupId),
    fetchGroupRanks(groupId).catch(() => []),
  ]);

  let student = students.find((item) => String(item.accountId) === String(studentId))
    ?? students.find((item) => String(item.enrollmentId) === String(studentId));

  if (!student && typeof studentId === 'string' && studentId.startsWith('student-')) {
    const idx = parseInt(studentId.replace('student-', ''), 10) - 1;
    if (!Number.isNaN(idx) && idx >= 0 && idx < students.length) {
      student = students[idx];
    }
  }

  if (!student) {
    return { ok: false, error: PARTICIPANT_NOT_FOUND_ERROR__TEXTLABEL.polish };
  }

  let earnedBadges = [];
  try {
    const studentBadges = await fetchStudentBadges(groupId, student.accountId);
    earnedBadges = (studentBadges || [])
      .filter((b) => b.isEarned)
      .map((b) => ({
        id: b.id,
        name: b.name,
        icon: b.icon,
        rarity: b.rarity,
        storyDescription: b.storyDescription,
        educationalDescription: b.educationalDescription,
        rewardAmount: b.rewardAmount,
      }));
  } catch {
    // fallback
  }

  const rankObj = ranks.find((r) => r.id === student.rankId);
  const rankName = rankObj?.name || student.rankName || NO_RANK_TEXT__TEXTLABEL.polish;

  return {
    ok: true,
    profile: {
      studentAccountId: student.accountId,
      groupId: Number(groupId),
      nickname: student.nickname,
      name: student.name,
      surname: student.surname,
      avatarId: student.avatarId,
      avatarUrl: student.avatarUrl,
      rankId: student.rankId,
      rankName,
      currency: student.currency ?? 0,
      totalEarned: student.totalEarned ?? 0,
      badgesCount: student.badgesCount ?? earnedBadges.length,
      purchasedItemsCount: student.purchasedItemsCount ?? 0,
      usedItemsCount: student.usedItemsCount ?? 0,
      lostLivesCount: student.lostLivesCount ?? 0,
      groupCurrency: null,
      lives: student.lives ?? null,
      livesEnabled: student.livesEnabled ?? null,
      earnedBadges,
      completedActivities: [],
    },
  };
}

export function useGroupStudentProfile() {
  const { groupId, studentId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!groupId) {
      setError(MISSING_GROUP_ID_ERROR__TEXTLABEL.polish);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let result = studentId
      ? await fetchGroupStudentProfile(groupId, studentId)
      : await fetchGroupStudentProfile(groupId);

    if (!result.ok && studentId) {
      result = await loadStudentByIdentifier(groupId, studentId);
    }

    setIsLoading(false);

    if (result.ok && result.profile) {
      setProfile(result.profile);
      return;
    }

    setProfile(null);
    setError(result.error || PROFILE_LOAD_ERROR__TEXTLABEL.polish);
  }, [groupId, studentId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    groupId,
    studentId: studentId ?? null,
    profile,
    isLoading,
    error,
    refetch: loadProfile,
  };
}
