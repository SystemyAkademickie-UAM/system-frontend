import { deleteJson, getJson, patchJson, postJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';

/**
 * @typedef {Object} ItemCategory
 * @property {number} id
 * @property {number} groupId
 * @property {string} name
 * @property {string | null} description
 * @property {number | null} displayOrder
 * @property {string | null} color
 */

/**
 * @param {unknown} raw
 * @returns {ItemCategory}
 */
function mapItemCategory(raw) {
  const row = /** @type {Record<string, unknown>} */ (raw ?? {});
  return {
    id: Number(row.id),
    groupId: Number(row.groupId),
    name: String(row.name ?? ''),
    description: row.description != null ? String(row.description) : null,
    displayOrder: row.displayOrder != null ? Number(row.displayOrder) : null,
    color: row.color != null ? String(row.color) : null,
  };
}

/**
 * GET /groups/:groupId/item-categories
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, categories: ItemCategory[], error?: string }>}
 */
export async function fetchGroupItemCategories(groupId) {
  const result = await getJson(`/groups/${groupId}/item-categories`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, categories: [], error: extractApiError(result.data) };
  }
  const categories = Array.isArray(result.data) ? result.data.map(mapItemCategory) : [];
  return { ok: true, categories };
}

/**
 * POST /groups/:groupId/item-categories
 * @param {string | number} groupId
 * @param {{ name: string, description?: string, displayOrder?: number, color?: string | null }} payload
 */
export async function createGroupItemCategory(groupId, payload) {
  const result = await postJson(`/groups/${groupId}/item-categories`, payload, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true, category: mapItemCategory(result.data) };
}

/**
 * PATCH /groups/:groupId/item-categories/:categoryId
 */
export async function updateGroupItemCategory(groupId, categoryId, payload) {
  const result = await patchJson(`/groups/${groupId}/item-categories/${categoryId}`, payload, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true, category: mapItemCategory(result.data) };
}

/**
 * DELETE /groups/:groupId/item-categories/:categoryId
 */
export async function deleteGroupItemCategory(groupId, categoryId) {
  const result = await deleteJson(`/groups/${groupId}/item-categories/${categoryId}`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true };
}
