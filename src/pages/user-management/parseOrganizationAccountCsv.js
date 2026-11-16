import {
  ACCOUNT_ROLE_LECTURER,
  ACCOUNT_ROLE_STUDENT,
  ORGANIZATION_ACCOUNT_IMPORT_MAX,
} from '../../constants/organizationAdmin.constants.js';

/**
 * Reads account rows from a CSV whose first line names email, name, surname, and role.
 * @param {string} text
 * @returns {Array<{ email: string, name: string, surname: string, role: string, nickname: string }>}
 */
export function parseOrganizationAccountCsv(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const [header, ...rows] = lines;
  const columns = (header ?? '').split(',').map((part) => part.trim().toLowerCase());
  const index = {
    email: columns.indexOf('email'),
    name: columns.indexOf('name'),
    surname: columns.indexOf('surname'),
    role: columns.indexOf('role'),
    nickname: columns.indexOf('nickname'),
  };
  if (index.email < 0 || index.name < 0 || index.surname < 0 || index.role < 0) {
    return [];
  }
  return rows.slice(0, ORGANIZATION_ACCOUNT_IMPORT_MAX).map((line) => {
    const cells = line.split(',').map((part) => part.trim());
    return {
      email: cells[index.email] ?? '',
      name: cells[index.name] ?? '',
      surname: cells[index.surname] ?? '',
      role: cells[index.role] ?? '',
      nickname: index.nickname >= 0 ? cells[index.nickname] ?? '' : '',
    };
  }).filter((row) => row.role === ACCOUNT_ROLE_STUDENT || row.role === ACCOUNT_ROLE_LECTURER);
}
