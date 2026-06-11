import { deleteJson, getJson, patchJson, postJson } from './api-client.js';
import {
  mapBackendInventory,
  mapBackendShopItem,
  mapBackendShopItems,
  mapBackendShopTemplates,
} from '../pages/content/group-shop/shopItemMapper.js';

/**
 * @param {unknown} data
 * @returns {string}
 */
function extractApiError(data) {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }
  if (typeof data === 'object' && data !== null) {
    const record = /** @type {{ message?: string | string[], error?: string }} */ (data);
    if (Array.isArray(record.message)) {
      return record.message.join(', ');
    }
    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message.trim();
    }
    if (typeof record.error === 'string' && record.error.trim()) {
      return record.error.trim();
    }
  }
  return 'Operacja nie powiodła się';
}

/**
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, items: import('../pages/content/group-shop/shopItem.types.js').ShopItem[], error?: string }>}
 */
export async function fetchGroupShopItems(groupId) {
  const result = await getJson(`/groups/${groupId}/shop-items`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, items: [], error: extractApiError(result.data) };
  }
  return { ok: true, items: mapBackendShopItems(result.data) };
}

/**
 * @returns {Promise<{ ok: boolean, templates: import('../pages/content/group-shop/shopItem.types.js').ShopItemTemplate[], error?: string }>}
 */
export async function fetchShopTemplates() {
  const result = await getJson('/shop-templates');
  if (!result.ok) {
    return { ok: false, templates: [], error: extractApiError(result.data) };
  }
  return { ok: true, templates: mapBackendShopTemplates(result.data) };
}

/**
 * @param {string | number} groupId
 * @param {Record<string, unknown>} payload
 */
export async function createGroupShopItem(groupId, payload) {
  const result = await postJson(`/groups/${groupId}/shop-items`, payload, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true, item: mapBackendShopItem(result.data) };
}

/**
 * @param {string | number} groupId
 * @param {Record<string, unknown>} payload
 */
export async function createGroupShopItemFromTemplate(groupId, payload) {
  const result = await postJson(`/groups/${groupId}/shop-items/from-template`, payload, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true, item: mapBackendShopItem(result.data) };
}

/**
 * @param {string | number} groupId
 * @param {string | number} itemId
 * @param {Record<string, unknown>} payload
 */
export async function updateGroupShopItem(groupId, itemId, payload) {
  const result = await patchJson(`/groups/${groupId}/shop-items/${itemId}`, payload, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true, item: mapBackendShopItem(result.data) };
}

/**
 * @param {string | number} groupId
 * @param {string | number} itemId
 */
export async function deleteGroupShopItem(groupId, itemId) {
  const result = await deleteJson(`/groups/${groupId}/shop-items/${itemId}`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true };
}

/**
 * @param {string | number} groupId
 * @param {string | number} itemId
 */
export async function buyGroupShopItem(groupId, itemId) {
  const result = await postJson(`/groups/${groupId}/shop-items/${itemId}/buy`, {}, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true };
}

/**
 * @param {string | number} groupId
 */
export async function fetchGroupInventory(groupId) {
  const result = await getJson(`/groups/${groupId}/inventory`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, entries: [], error: extractApiError(result.data) };
  }
  return { ok: true, entries: mapBackendInventory(result.data) };
}

/**
 * @param {string | number} groupId
 * @param {string | number} itemId
 */
export async function useGroupInventoryItem(groupId, itemId) {
  const result = await postJson(`/groups/${groupId}/inventory/${itemId}/use`, {}, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true };
}

/**
 * @param {string | number} groupId
 */
export async function fetchGroupShopOpenStatus(groupId) {
  const preview = await getJson(`/groups/${groupId}/preview`, { includeBrowserId: true });
  if (preview.ok && typeof preview.data === 'object' && preview.data !== null) {
    const group = /** @type {{ group?: { shopOpen?: boolean } }} */ (preview.data).group;
    if (group && typeof group.shopOpen === 'boolean') {
      return { ok: true, shopOpen: group.shopOpen };
    }
  }

  const profile = await getJson(`/groups/${groupId}/student-profile`, { includeBrowserId: true });
  if (profile.ok && typeof profile.data === 'object' && profile.data !== null) {
    const shopOpen = /** @type {{ shopOpen?: boolean }} */ (profile.data).shopOpen;
    if (typeof shopOpen === 'boolean') {
      return { ok: true, shopOpen };
    }
  }

  return { ok: true, shopOpen: true };
}

/**
 * @param {string | number} groupId
 * @param {boolean} shopOpen
 */
export async function updateGroupShopOpenStatus(groupId, shopOpen) {
  const result = await patchJson(`/groups/${groupId}/shop-status`, { shopOpen }, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: extractApiError(result.data) };
  }
  return { ok: true, shopOpen };
}
