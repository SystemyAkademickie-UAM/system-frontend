import { deleteJson, getJson, patchJson, postJson, putJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';

/**
 * @typedef {Object} GroupTemplateListItem
 * @property {number} id
 * @property {string} name
 * @property {string | null} description
 * @property {boolean} isPublic
 * @property {number} creatorAccountId
 * @property {number | null} baseGroupId
 * @property {string} createdAt
 * @property {boolean} [isFavorite]
 */

/**
 * @typedef {Object} GroupTemplateData
 * @property {object} group
 * @property {object[]} badges
 * @property {object[]} ranks
 * @property {object[]} itemCategories
 * @property {object[]} items
 * @property {object[]} posts
 * @property {object[]} stages
 */

/**
 * @typedef {GroupTemplateListItem & { data?: GroupTemplateData }} GroupTemplateDetails
 */

/**
 * @typedef {Object} PaginatedGroupTemplates
 * @property {GroupTemplateListItem[]} items
 * @property {number} total
 * @property {number} limit
 * @property {number} offset
 */

function mapListItem(raw) {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ''),
    description: raw.description != null ? String(raw.description) : null,
    isPublic: Boolean(raw.isPublic),
    creatorAccountId: Number(raw.creatorAccountId),
    baseGroupId: raw.baseGroupId != null ? Number(raw.baseGroupId) : null,
    createdAt: String(raw.createdAt ?? ''),
    isFavorite: Boolean(raw.isFavorite),
  };
}

/**
 * GET /group-templates
 * @param {{ scope?: 'public' | 'my', limit?: number, offset?: number }} [params]
 * @returns {Promise<PaginatedGroupTemplates>}
 */
export async function fetchGroupTemplates({ scope = 'public', limit = 100, offset = 0 } = {}) {
  const query = new URLSearchParams({
    scope,
    limit: String(limit),
    offset: String(offset),
  });
  const result = await getJson(`/group-templates?${query.toString()}`);
  if (!result.ok) {
    console.error('Failed to fetch group templates:', result.status, result.data);
    return { items: [], total: 0, limit, offset };
  }
  const data = /** @type {{ items?: unknown[], total?: number, limit?: number, offset?: number }} */ (result.data);
  const items = Array.isArray(data.items) ? data.items.map(mapListItem) : [];
  return {
    items,
    total: Number(data.total ?? items.length),
    limit: Number(data.limit ?? limit),
    offset: Number(data.offset ?? offset),
  };
}

/**
 * GET /group-templates/:id
 * @param {number} templateId
 * @returns {Promise<GroupTemplateDetails | null>}
 */
export async function fetchGroupTemplateDetails(templateId) {
  const result = await getJson(`/group-templates/${templateId}`);
  if (!result.ok) {
    console.error('Failed to fetch group template:', result.status, result.data);
    return null;
  }
  const raw = /** @type {Record<string, unknown>} */ (result.data);
  return {
    ...mapListItem(raw),
    data: raw.data && typeof raw.data === 'object' ? /** @type {GroupTemplateData} */ (raw.data) : undefined,
  };
}

/**
 * POST /groups/:groupId/save-as-template
 * @param {string | number} groupId
 * @param {{ name: string, description?: string, isPublic?: boolean }} payload
 */
export async function saveGroupAsTemplate(groupId, payload) {
  const result = await postJson(`/groups/${groupId}/save-as-template`, payload);
  if (!result.ok) {
    const data = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: data?.message || 'Nie udało się zapisać szablonu' };
  }
  const raw = /** @type {Record<string, unknown>} */ (result.data);
  return { ok: true, template: { ...mapListItem(raw), data: raw.data } };
}

/**
 * POST /groups/from-template/:templateId
 * @param {number} templateId
 * @param {{ name: string, subjectName?: string }} payload
 */
export async function createGroupFromTemplate(templateId, payload) {
  const result = await postJson(`/groups/from-template/${templateId}`, payload);
  if (!result.ok) {
    const data = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: data?.message || 'Nie udało się utworzyć grupy ze szablonu' };
  }
  const data = /** @type {{ group?: number }} */ (result.data);
  if (!data.group) {
    return { ok: false, error: 'Nie udało się utworzyć grupy ze szablonu' };
  }
  return { ok: true, groupId: data.group };
}

/**
 * PATCH /group-templates/:id
 * @param {number} templateId
 * @param {{ name?: string, description?: string, isPublic?: boolean }} payload
 */
export async function updateGroupTemplate(templateId, payload) {
  const result = await patchJson(`/group-templates/${templateId}`, payload);
  if (!result.ok) {
    const data = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: data?.message || 'Nie udało się zaktualizować szablonu' };
  }
  return { ok: true, template: mapListItem(/** @type {Record<string, unknown>} */ (result.data)) };
}

/**
 * DELETE /group-templates/:id
 * @param {number} templateId
 */
export async function deleteGroupTemplate(templateId) {
  const result = await deleteJson(`/group-templates/${templateId}`);
  if (!result.ok) {
    const data = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: data?.message || 'Nie udało się usunąć szablonu' };
  }
  return { ok: true };
}

/**
 * PUT /group-templates/:id/favorite
 * @param {number} templateId
 * @param {boolean} favorite
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function setGroupTemplateFavorite(templateId, favorite) {
  const result = await putJson(`/group-templates/${templateId}/favorite`, { favorite });
  if (!result.ok) {
    return {
      ok: false,
      error: extractApiError(result.data, 'Nie udało się zaktualizować ulubionych'),
    };
  }
  return { ok: true };
}

/**
 * @param {GroupTemplateListItem[]} templates
 * @param {string} query
 */
export function filterTemplatesByName(templates, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return templates;
  return templates.filter((template) => {
    const haystack = [template.name, template.description ?? ''].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}
