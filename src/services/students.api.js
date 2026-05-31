import { getJson, patchJson, deleteJson } from './api-client.js';
import { getAssetUrl } from '../constants/api.constants.js';

/**
 * @typedef {Object} StudentListItem
 * @property {number} enrollmentId
 * @property {number} accountId
 * @property {string} name
 * @property {string} surname
 * @property {string} nickname
 * @property {string} email
 * @property {number | null} rankId
 * @property {number} currency
 * @property {number} totalEarned
 * @property {number} avatarId
 * @property {string | null} avatarUrl
 */

/**
 * Pobiera listę studentów w grupie.
 * GET /groups/:groupId/students
 *
 * @param {string | number} groupId
 * @returns {Promise<StudentListItem[]>}
 */
export async function fetchGroupStudents(groupId) {
  const result = await getJson(`/groups/${groupId}/students`);
  if (!result.ok) {
    console.error('Failed to fetch students:', result.status, result.data);
    return [];
  }
  const list = Array.isArray(result.data) ? result.data : [];
  return list.map(student => ({
    ...student,
    avatarUrl: getAssetUrl(student.avatarUrl)
  }));
}

/**
 * Masowa aktualizacja studentów.
 * PATCH /groups/:groupId/students/bulk-update
 *
 * @param {string | number} groupId
 * @param {Array<{ enrollmentId: number, rankId?: number | null, currency?: number, totalEarned?: number }>} students
 * @returns {Promise<{ ok: boolean, updated?: number, error?: string }>}
 */
export async function bulkUpdateStudents(groupId, students) {
  const result = await patchJson(`/groups/${groupId}/students/bulk-update`, { students });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się zaktualizować studentów' };
  }
  const data = /** @type {{ updated?: number }} */ (result.data);
  return { ok: true, updated: data.updated };
}

/**
 * Usuwa studenta z grupy.
 * DELETE /groups/:groupId/students/:accountId
 *
 * @param {string | number} groupId
 * @param {number} accountId
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function removeStudent(groupId, accountId) {
  const result = await deleteJson(`/groups/${groupId}/students/${accountId}`);
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się usunąć studenta' };
  }
  return { ok: true };
}

/**
 * @typedef {Object} StudentBadge
 * @property {number} id
 * @property {string} name
 * @property {string | null} icon
 * @property {boolean} isEarned
 */

/**
 * Pobiera odznaki studenta (z flagą isEarned).
 * GET /groups/:groupId/students/:accountId/badges
 *
 * @param {string | number} groupId
 * @param {number} accountId
 * @returns {Promise<StudentBadge[]>}
 */
export async function fetchStudentBadges(groupId, accountId) {
  const result = await getJson(`/groups/${groupId}/students/${accountId}/badges`);
  if (!result.ok) {
    console.error('Failed to fetch student badges:', result.status, result.data);
    return [];
  }
  const data = /** @type {{ badges?: StudentBadge[] }} */ (result.data);
  return Array.isArray(data?.badges) ? data.badges : [];
}

/**
 * Przełącza odznakę studenta (nadaje/odbiera).
 * POST /groups/:groupId/students/:accountId/badges/:badgeId/toggle
 *
 * @param {string | number} groupId
 * @param {number} accountId
 * @param {number} badgeId
 * @returns {Promise<{ ok: boolean, isEarned?: boolean, error?: string }>}
 */
export async function toggleStudentBadge(groupId, accountId, badgeId) {
  const { postJson } = await import('./api-client.js');
  const result = await postJson(`/groups/${groupId}/students/${accountId}/badges/${badgeId}/toggle`, {});
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się zmienić odznaki' };
  }
  const data = /** @type {{ isEarned?: boolean }} */ (result.data);
  return { ok: true, isEarned: data.isEarned };
}

/**
 * @typedef {Object} ProgressActivity
 * @property {number} id
 * @property {string} name
 * @property {number} currency
 * @property {string} storyDescription
 * @property {string} educationalDescription
 * @property {boolean} isCompleted
 */

/**
 * @typedef {Object} ProgressStage
 * @property {number} id
 * @property {string} name
 * @property {ProgressActivity[]} activities
 */

/**
 * Pobiera postęp studenta w aktywnościach grupy.
 * GET /groups/:groupId/students/:accountId/progress
 *
 * @param {string | number} groupId
 * @param {number} accountId
 * @returns {Promise<ProgressStage[]>}
 */
export async function fetchStudentProgress(groupId, accountId) {
  const result = await getJson(`/groups/${groupId}/students/${accountId}/progress`);
  if (!result.ok) {
    console.error('Failed to fetch student progress:', result.status, result.data);
    return [];
  }
  const data = /** @type {{ stages?: ProgressStage[] }} */ (result.data);
  return Array.isArray(data?.stages) ? data.stages : [];
}

/**
 * Przełącza ukończenie aktywności studenta.
 * POST /groups/:groupId/students/:accountId/activities/:activityId/toggle
 *
 * @param {string | number} groupId
 * @param {number} accountId
 * @param {number} activityId
 * @returns {Promise<{ ok: boolean, isCompleted?: boolean, error?: string }>}
 */
export async function toggleStudentActivity(groupId, accountId, activityId) {
  const { postJson } = await import('./api-client.js');
  const result = await postJson(
    `/groups/${groupId}/students/${accountId}/activities/${activityId}/toggle`,
    {},
  );
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się zmienić postępu aktywności' };
  }
  const data = /** @type {{ isCompleted?: boolean }} */ (result.data);
  return { ok: true, isCompleted: data.isCompleted };
}
