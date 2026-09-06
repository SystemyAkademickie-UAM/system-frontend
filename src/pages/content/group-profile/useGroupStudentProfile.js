import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupStudentProfile } from '../../../services/studentProfile.api.js';
import { fetchGroupStudents } from '../../../services/students.api.js';

const PARTICIPANT_NOT_FOUND_ERROR__TEXTLABEL = {
  polish: 'Nie znaleziono uczestnika w grupie.',
  english: 'Participant not found in group.'
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

async function loadStudentByAccountId(groupId, accountId) {
  const students = await fetchGroupStudents(groupId);
  const student = students.find((item) => String(item.accountId) === String(accountId));
  if (!student) {
    return { ok: false, error: PARTICIPANT_NOT_FOUND_ERROR__TEXTLABEL.polish };
  }

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
      rankName: student.rankName || NO_RANK_TEXT__TEXTLABEL.polish,
      currency: student.currency,
      totalEarned: student.totalEarned,
      badgesCount: student.badgesCount ?? 0,
      groupCurrency: null,
      lives: null,
      earnedBadges: [],
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
    setError('');

    const result = studentId
      ? await loadStudentByAccountId(groupId, studentId)
      : await fetchGroupStudentProfile(groupId);

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
