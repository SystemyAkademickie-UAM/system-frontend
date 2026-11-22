/**
 * @file reportParticipantLabel.js
 * @description Główny komponent widoku strony dla obszaru reportParticipantLabel.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { formatStudentDisplayName } from '../../../utils/members/studentDisplayName.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * @param {{ name?: string, surname?: string, nickname?: string, email?: string, accountId?: number }} student
 * @returns {string}
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export function formatReportParticipantLabel(student) {
  return formatStudentDisplayName(student);
}
