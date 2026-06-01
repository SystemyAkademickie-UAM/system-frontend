import { APP_ROLE } from '../navigation/shellTemplates.config.js';

function buildLegalName(user) {
  if (!user) {
    return '';
  }
  const firstName = user.givenName || user.name || '';
  const lastName = user.surname || '';
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

/**
 * Preferuje imię i nazwisko prowadzącego zamiast ksywki, gdy wyłączono ją w ustawieniach.
 * Backend zawsze zwraca sformatowany `lecturers` z ksywką — ta funkcja koryguje widok własnych grup.
 *
 * @param {import('../pages/content/groups-list/groupsList.api.js').GroupListItem} group
 * @param {{ role?: string, showNickname?: boolean, user?: object | null }} options
 */
export function resolveGroupLecturerDisplay(group, { role, showNickname, user } = {}) {
  if (!group?.lecturer) {
    return '';
  }

  if (role !== APP_ROLE.LECTURER || showNickname !== false || !group.isMine) {
    return group.lecturer;
  }

  const legalName = buildLegalName(user);
  return legalName || group.lecturer;
}
