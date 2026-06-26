/**
 * @param {{ name?: string, surname?: string, nickname?: string, email?: string }} student
 * @returns {string}
 */
export function formatStudentDisplayName(student) {
  const fullName = [student.name, student.surname].filter(Boolean).join(' ').trim();
  const nickname = student.nickname?.trim();

  if (nickname) {
    if (fullName && nickname !== fullName) {
      return `${nickname} (${fullName})`;
    }
    return nickname;
  }

  return fullName || student.email || 'Student';
}
