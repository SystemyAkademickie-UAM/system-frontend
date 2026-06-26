import { getJson } from './api-client.js';
import { getAssetUrl } from '../constants/api.constants.js';
import { fetchGroupStudents } from './students.api.js';

/**
 * Lista uczestników widoczna dla studenta.
 * GET /groups/:groupId/participants
 *
 * @param {string | number} groupId
 * @returns {Promise<import('./students.api.js').StudentListItem[]>}
 */
export async function fetchGroupParticipants(groupId) {
  const result = await getJson(`/groups/${groupId}/participants`, { includeBrowserId: true });
  if (!result.ok) {
    return [];
  }

  const list = Array.isArray(result.data)
    ? result.data
    : (Array.isArray(result.data?.participants) ? result.data.participants : []);

  return list.map((student) => ({
    ...student,
    avatarUrl: getAssetUrl(student.avatarUrl),
  }));
}

/**
 * @param {string | number} groupId
 * @param {{ isStudentView?: boolean }} [options]
 * @returns {Promise<import('./students.api.js').StudentListItem[]>}
 */
export async function fetchMembersPageStudents(groupId, { isStudentView = false } = {}) {
  if (!isStudentView) {
    return fetchGroupStudents(groupId);
  }

  return fetchGroupParticipants(groupId);
}
