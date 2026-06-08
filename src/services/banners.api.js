import { getJson } from './api-client.js';

/**
 * @typedef {Object} PredefinedBanner
 * @property {string | number} id
 * @property {string} [imageUrl]
 * @property {string} [name]
 */

/**
 * Zwraca listę predefiniowanych banerów z backendu.
 * GET /banners
 *
 * @returns {Promise<PredefinedBanner[]>}
 */
export async function fetchPredefinedBanners() {
  const result = await getJson('/banners');
  if (!result.ok || !Array.isArray(result.data)) {
    console.error('Failed to fetch predefined banners:', result.status, result.data);
    return [];
  }
  return result.data;
}
