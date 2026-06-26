import { formatStudentDisplayName } from '../../../utils/members/studentDisplayName.js';

/**
 * @param {{ name?: string, surname?: string, nickname?: string, email?: string, accountId?: number }} student
 * @returns {string}
 */
export function formatReportParticipantLabel(student) {
  return formatStudentDisplayName(student);
}
