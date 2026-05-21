import { MOCK_GROUPS_LIST } from './groupsList.mock.js';

/**
 * Pobiera listę grup zalogowanego użytkownika.
 * Docelowo: GET /groups (lub endpoint z backendu).
 *
 * @returns {Promise<import('./groupsList.mock.js').GroupListItem[]>}
 */
export async function fetchUserGroups() {
  // TODO: podpiąć backend — np. getJson('/groups') z api-client
  return MOCK_GROUPS_LIST;
}

/**
 * Filtruje grupy po zapytaniu (nazwa fabularna, przedmiot, prowadzący).
 *
 * @param {import('./groupsList.mock.js').GroupListItem[]} groups
 * @param {string} query
 */
export function filterGroups(groups, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return groups;
  }

  return groups.filter((group) => {
    const haystack = [group.storyName, group.subject, group.lecturer].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}
