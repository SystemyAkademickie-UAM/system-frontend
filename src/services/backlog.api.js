import { getJson, patchJson, deleteJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';

/**
 * @typedef {Object} BacklogItem
 * @property {number} id
 * @property {string} type
 * @property {string} date
 * @property {string | null} value
 * @property {number} accountId
 * @property {boolean} isRead
 */

/**
 * @param {unknown} raw
 * @returns {BacklogItem | null}
 */
function mapBacklogItem(raw) {
  const row = /** @type {Record<string, unknown>} */ (raw ?? {});
  const id = Number(row.id);
  if (!Number.isFinite(id)) {
    return null;
  }

  return {
    id,
    type: typeof row.type === 'string' ? row.type : 'UNKNOWN',
    date: typeof row.date === 'string' ? row.date : new Date().toISOString(),
    value: typeof row.value === 'string' ? row.value : null,
    accountId: Number(row.accountId ?? 0),
    isRead: row.isRead === true,
  };
}

/**
 * @param {string | number} groupId
 * @param {{ take?: number, skip?: number, studentView?: boolean }} [options]
 */
export async function fetchGroupBacklog(groupId, { take = 50, skip = 0, studentView = false } = {}) {
  const path = studentView
    ? `/groups/${groupId}/backlog/me?take=${take}&skip=${skip}`
    : `/groups/${groupId}/backlog?take=${take}&skip=${skip}`;
  const result = await getJson(path, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, items: [], error: extractApiError(result.data) };
  }

  const items = Array.isArray(result.data)
    ? result.data.map(mapBacklogItem).filter((item) => item !== null)
    : [];

  return { ok: true, items };
}

/**
 * @param {string | number} groupId
 */
export async function fetchGroupBacklogUnreadCount(groupId) {
  const result = await getJson(`/groups/${groupId}/backlog/unread-count`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, count: 0, error: extractApiError(result.data) };
  }

  const count = typeof result.data === 'object' && result.data !== null
    ? Number(/** @type {{ count?: number }} */ (result.data).count ?? 0)
    : 0;

  return { ok: true, count: Number.isFinite(count) ? count : 0 };
}

/**
 * @param {string | number} groupId
 */
export async function fetchGroupBacklogTotalCount(groupId) {
  const result = await getJson(`/groups/${groupId}/backlog/count`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, count: 0, error: extractApiError(result.data) };
  }

  const count = typeof result.data === 'object' && result.data !== null
    ? Number(/** @type {{ count?: number }} */ (result.data).count ?? 0)
    : 0;

  return { ok: true, count: Number.isFinite(count) ? count : 0 };
}

/**
 * @param {string | number} groupId
 */
export async function markAllGroupBacklogRead(groupId) {
  const result = await patchJson(`/groups/${groupId}/backlog/read-all`, {}, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true };
}

/**
 * @param {string | number} groupId
 * @param {string | number} backlogId
 */
export async function markGroupBacklogItemRead(groupId, backlogId) {
  const result = await patchJson(`/groups/${groupId}/backlog/${backlogId}/read`, {}, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true };
}

/**
 * @param {string | number} groupId
 * @param {{ excludeItemUses?: boolean }} [options]
 */
export async function clearGroupBacklog(groupId, { excludeItemUses = false } = {}) {
  const query = excludeItemUses ? '?excludeItemUses=true' : '';
  const result = await deleteJson(`/groups/${groupId}/backlog/clear${query}`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data), deleted: 0 };
  }

  const deleted = typeof result.data === 'object' && result.data !== null
    ? Number(/** @type {{ deleted?: number }} */ (result.data).deleted ?? 0)
    : 0;

  return { ok: true, deleted: Number.isFinite(deleted) ? deleted : 0 };
}
