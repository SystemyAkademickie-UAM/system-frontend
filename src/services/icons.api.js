import { getJson } from './api-client.js';

/**
 * @typedef {Object} IconCatalogItem
 * @property {string} id
 * @property {string} fileName
 * @property {string} label
 */

/**
 * Zwraca dostępne ikony z backendu.
 * @returns {Promise<IconCatalogItem[]>}
 */
export async function fetchIconCatalog() {
  const result = await getJson('/gamification/icons');
  if (!result.ok || !Array.isArray(result.data)) {
    console.error('Failed to fetch icons catalog:', result.status, result.data);
    return [];
  }

  return result.data.map((icon) => ({
    id: `backend:${icon.filename}`,
    fileName: `backend:${icon.filename}`,
    label: icon.name || icon.filename,
  }));
}
