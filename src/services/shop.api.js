import { deleteJson, getJson, patchJson, postJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';
import {
  mapBackendInventory,
  mapBackendShopItem,
  mapBackendShopItems,
  mapBackendShopTemplates,
} from '../utils/shop/shopItemMapper.js';

/**
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, items: import('../utils/shop/shopItem.types.js').ShopItem[], error?: string }>}
 */
export async function fetchGroupShopItems(groupId) {
  const result = await getJson(`/groups/${groupId}/shop-items`, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, items: [], error: extractApiError(result.data) };
  }
  return { ok: true, items: mapBackendShopItems(result.data) };
}

/**
 * @param {string | number} groupId
 * @param {string | number} itemId
 */
export async function fetchGroupShopItem(groupId, itemId) {
  const result = await fetchGroupShopItems(groupId);
  if (!result.ok) {
    return { ok: false, item: null, error: result.error };
  }

  const item = result.items.find((entry) => entry.id === String(itemId)) ?? null;
  if (!item) {
    return { ok: false, item: null, error: 'Nie znaleziono produktu' };
  }

  return { ok: true, item };
}

/**
 * @returns {Promise<{ ok: boolean, templates: import('../utils/shop/shopItem.types.js').ShopItemTemplate[], error?: string }>}
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

  const item = mapBackendShopItem(result.data);
  if (item.isPublished === false) {
    const publishResult = await updateGroupShopItem(groupId, item.id, { isPublished: true });
    if (publishResult.ok && publishResult.item) {
      return { ok: true, item: publishResult.item };
    }
  }

  return { ok: true, item };
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
 * @param {string} message
 * @returns {string}
 */
function mapShopBuyError(message) {
  const normalized = message.trim();
  const translations = {
    'Not enough currency': 'Niewystarczająca ilość waluty.',
    'Sklep grupy jest obecnie zamknięty.': 'Sklep grupy jest obecnie zamknięty.',
    'Student is not enrolled in this group': 'Nie jesteś zapisany do tej grupy.',
    'Przedmiot jest zablokowany. Zdobądź wyższą rangę, aby go odblokować.': 'Przedmiot jest zablokowany. Zdobądź wyższą rangę, aby go odblokować.',
  };

  return translations[normalized] ?? normalized;
}

/**
 * @param {string | number} groupId
 * @param {string | number} itemId
 */
export async function buyGroupShopItem(groupId, itemId) {
  const result = await postJson(`/groups/${groupId}/shop-items/${itemId}/buy`, {}, { includeBrowserId: true });
  if (!result.ok) {
    return { ok: false, error: mapShopBuyError(extractApiError(result.data)) };
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
