/**
 * @file studentDisplayName.js
 * @description Funkcje pomocnicze i narzędziowe modułu studentDisplayName.
 */

// === IMPORTY I STAŁE MODUŁU ===
/**
 * @param {{ name?: string, surname?: string, nickname?: string, email?: string }} student
 * @returns {string}
 */
export function getStudentLegalName(student) {

return [student.name, student.surname].filter(Boolean).join(' ').trim();
}

// === GŁÓWNA LOGIKA NARZĘDZIOWA I EKSPORTY ===
/**
 * @param {{ name?: string, surname?: string, nickname?: string, email?: string }} student
 * @returns {string}
 */
export function formatStudentDisplayName(student) {
  const fullName = getStudentLegalName(student);

const nickname = student.nickname?.trim();

  if (nickname) {
    if (fullName && nickname !== fullName) {
      return `${nickname} (${fullName})`;
    }
    return nickname;
  }

  return fullName || student.email || 'Student';
}
