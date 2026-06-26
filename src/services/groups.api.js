import { getJson, patchJson, postJson } from './api-client.js';
import { buildDriveBannerUrl } from '../constants/drive.constants.js';

/** Matches backend `GROUP_RESPONSE_GROUP_NOT_CREATED_ID`. */
const GROUP_RESPONSE_NOT_CREATED = 0;
/** Matches backend `GROUP_RESPONSE_GROUP_NOT_AUTHORIZED_ID`. */
const GROUP_RESPONSE_NOT_AUTHORIZED = 1;

/**
 * @typedef {Object} GroupListItem
 * @property {string} id - Public group ID (as string for routing)
 * @property {string} storyName - Display name (groupName from backend)
 * @property {string} subject - Subject name
 * @property {string} lecturer - Lecturer name(s)
 * @property {string | null} bannerUrl - Banner image URL, color ref (color:#hex) or null
 * @property {string | null} [imageRef] - Raw image_ref from backend
 * @property {string | null} description - Group description
 * @property {boolean} [isMine] - Whether the user has access to this group
 */

/**
 * Converts backend response to frontend format.
 * @param {object} backendGroup
 * @param {{ isMine?: boolean }} [options]
 * @returns {GroupListItem}
 */
function mapBackendGroup(backendGroup, options = {}) {
  const imageRef = backendGroup.imageRef ?? backendGroup.bannerId ?? null;
  return {
    id: String(backendGroup.id),
    storyName: backendGroup.groupName || backendGroup.name || '',
    // Backend nie ma jeszcze osobnej kolumny na nazwę przedmiotu —
    // zwracamy pustą wartość, żeby pole nie kopiowało się z nazwy grupy.
    subject: backendGroup.subjectName || '',
    lecturer: backendGroup.lecturers || '',
    imageRef: imageRef ? String(imageRef) : null,
    bannerUrl: buildDriveBannerUrl(imageRef),
    description: backendGroup.description || null,
    isMine: options.isMine,
    shopOpensAt: backendGroup.shopOpensAt ?? null,
    rankShowMemberAvatars: backendGroup.rankShowMemberAvatars !== false,
  };
}

/**
 * Pobiera listę grup użytkownika (tylko przypisane).
 * GET /groups
 *
 * @returns {Promise<GroupListItem[]>}
 */
export async function fetchUserGroups() {
  const result = await getJson('/groups', { includeBrowserId: true });
  if (!result.ok) {
    console.error('Failed to fetch user groups:', result.status, result.data);
    return [];
  }
  const data = /** @type {{ groups?: unknown[] }} */ (result.data);
  const groups = Array.isArray(data.groups) ? data.groups : [];
  return groups.map((group) => mapBackendGroup(group, { isMine: true }));
}

/**
 * Pobiera katalog wszystkich grup podzielony na przypisane i pozostałe.
 * GET /groups/catalog
 *
 * @returns {Promise<{ myGroups: GroupListItem[], otherGroups: GroupListItem[] }>}
 */
export async function fetchGroupsCatalog() {
  const result = await getJson('/groups/catalog', { includeBrowserId: true });
  if (!result.ok) {
    console.error('Failed to fetch groups catalog:', result.status, result.data);
    return { myGroups: [], otherGroups: [] };
  }
  const data = /** @type {{ myGroups?: unknown[], otherGroups?: unknown[] }} */ (result.data);
  const myGroups = Array.isArray(data.myGroups)
    ? data.myGroups.map((group) => mapBackendGroup(group, { isMine: true }))
    : [];
  const otherGroups = Array.isArray(data.otherGroups)
    ? data.otherGroups.map((group) => mapBackendGroup(group, { isMine: false }))
    : [];
  return { myGroups, otherGroups };
}

/**
 * @typedef {Object} GroupPreviewResult
 * @property {GroupListItem | null} group
 * @property {boolean} hasAccess
 * @property {boolean} isOwner
 * @property {boolean} isEnrolled
 */

/**
 * Pobiera metadane grupy i status dostępu użytkownika.
 * GET /groups/:groupId/preview
 *
 * @param {string} groupId
 * @returns {Promise<GroupPreviewResult>}
 */
export async function fetchGroupPreview(groupId) {
  const result = await getJson(`/groups/${groupId}/preview`, { includeBrowserId: true });
  if (!result.ok) {
    console.error('Failed to fetch group preview:', result.status, result.data);
    return { group: null, hasAccess: false, isOwner: false, isEnrolled: false };
  }
  const data = /** @type {{ group?: object | null, hasAccess?: boolean, isOwner?: boolean, isEnrolled?: boolean }} */ (
    result.data
  );
  return {
    group: data.group ? mapBackendGroup(data.group) : null,
    hasAccess: Boolean(data.hasAccess),
    isOwner: Boolean(data.isOwner),
    isEnrolled: Boolean(data.isEnrolled),
  };
}

/**
 * Pobiera szczegóły grupy po identyfikatorze (z podglądu dostępu).
 *
 * @param {string} groupId
 * @returns {Promise<GroupListItem | null>}
 */
export async function fetchGroupById(groupId) {
  const preview = await fetchGroupPreview(groupId);
  return preview.group;
}

/**
 * Tworzy nową grupę.
 * POST /groups/new
 *
 * @param {object} groupData
 * @param {string} groupData.name
 * @param {string} [groupData.subjectName]
 * @param {string} [groupData.description]
 * @param {string} [groupData.currency]
 * @param {number} [groupData.currencyIcon]
 * @param {string} [groupData.lives]
 * @param {number} [groupData.livesIcon]
 * @param {string} [groupData.imageRef]
 * @returns {Promise<{ ok: boolean, groupId?: number, error?: string }>}
 */
export async function createGroup(groupData) {
  const result = await postJson('/groups/new', { group: groupData }, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: 'Nie udało się utworzyć grupy' };
  }
  const data = /** @type {{ group?: number }} */ (result.data);
  if (data.group === GROUP_RESPONSE_NOT_AUTHORIZED) {
    return { ok: false, error: 'Brak uprawnień do tworzenia grup' };
  }
  if (data.group === GROUP_RESPONSE_NOT_CREATED) {
    return { ok: false, error: 'Nie udało się utworzyć grupy' };
  }
  return { ok: true, groupId: data.group };
}

/**
 * Aktualizuje istniejącą grupę.
 * PATCH /groups/:groupId
 *
 * Wysyłane są tylko pola obecne w `groupData` (partial update).
 *
 * @param {string | number} groupId
 * @param {Partial<{ name: string, subjectName: string, description: string, currency: string, currencyIcon: string, lives: number, livesIcon: string, imageRef: string }>} groupData
 * @returns {Promise<{ ok: boolean, groupId?: number, updated?: boolean, error?: string }>}
 */
export async function updateGroup(groupId, groupData) {
  const result = await patchJson(
    `/groups/${groupId}`,
    { group: groupData },
    { includeBrowserId: true },
  );
  if (!result.ok) {
    return { ok: false, error: 'Nie udało się zapisać zmian grupy' };
  }
  const data = /** @type {{ group?: number, updated?: boolean }} */ (result.data);
  if (data.group === GROUP_RESPONSE_NOT_AUTHORIZED) {
    return { ok: false, error: 'Brak uprawnień do edycji grupy' };
  }
  if (data.group === GROUP_RESPONSE_NOT_CREATED) {
    return { ok: false, error: 'Nie udało się zapisać zmian grupy' };
  }
  return { ok: true, groupId: data.group, updated: Boolean(data.updated) };
}

/**
 * Filtruje grupy po zapytaniu (nazwa fabularna, przedmiot, prowadzący).
 *
 * @param {GroupListItem[]} groups
 * @param {string} query
 * @returns {GroupListItem[]}
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
