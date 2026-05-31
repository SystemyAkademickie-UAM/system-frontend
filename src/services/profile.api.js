import { getJson, patchJson } from './api-client.js';
import { getAssetUrl } from '../constants/api.constants.js';

/**
 * @typedef {Object} UserProfile
 * @property {number} id
 * @property {string} email
 * @property {number} studentId
 * @property {string} name
 * @property {string} surname
 * @property {string} nickname
 * @property {number} avatarId
 * @property {string | null} language
 * @property {boolean} registrationCompleted
 * @property {string | null} eulaAcceptedAt
 */

/**
 * @typedef {Object} Avatar
 * @property {number} id
 * @property {string} imageUrl
 * @property {string} name
 */

/**
 * Pobiera profil zalogowanego użytkownika.
 * GET /profile
 *
 * @returns {Promise<UserProfile | null>}
 */
export async function fetchProfile() {
  const result = await getJson('/profile');
  if (!result.ok) {
    console.error('Failed to fetch profile:', result.status, result.data);
    return null;
  }
  return /** @type {UserProfile} */ (result.data);
}

/**
 * Pobiera listę dostępnych awatarów.
 * GET /profile/avatars
 *
 * @returns {Promise<Avatar[]>}
 */
export async function fetchAvatars() {
  const result = await getJson('/profile/avatars');
  if (!result.ok) {
    console.error('Failed to fetch avatars:', result.status, result.data);
    return [];
  }
  const list = Array.isArray(result.data) ? result.data : [];
  return list.map(item => ({
    ...item,
    imageUrl: getAssetUrl(item.imageUrl)
  }));
}

/**
 * Aktualizuje profil użytkownika.
 * PATCH /profile/settings
 *
 * @param {{ nickname?: string, avatarId?: number }} updates
 * @returns {Promise<{ ok: boolean, profile?: UserProfile, error?: string }>}
 */
export async function updateProfile(updates) {
  const result = await patchJson('/profile/settings', updates);
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się zaktualizować profilu' };
  }
  return { ok: true, profile: /** @type {UserProfile} */ (result.data) };
}
