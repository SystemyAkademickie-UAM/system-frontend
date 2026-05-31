import { getJson } from './api-client.js';
import { getAssetUrl } from '../constants/api.constants.js';

/**
 * @typedef {Object} GroupStudentProfileBadge
 * @property {number} id
 * @property {string} name
 * @property {string | null} icon
 * @property {string} rarity
 * @property {string | null} storyDescription
 * @property {string | null} educationalDescription
 * @property {number | null} rewardAmount
 */

/**
 * @typedef {Object} GroupStudentProfile
 * @property {number} studentAccountId
 * @property {number} groupId
 * @property {string} nickname
 * @property {string} name
 * @property {string} surname
 * @property {number} avatarId
 * @property {string | null} avatarUrl
 * @property {number | null} rankId
 * @property {string | null} rankName
 * @property {number} currency
 * @property {number} totalEarned
 * @property {number} badgesCount
 * @property {string | null} groupCurrency
 * @property {number | null} groupCurrencyIcon
 * @property {string | null} lives
 * @property {number | null} livesIcon
 * @property {GroupStudentProfileBadge[]} earnedBadges
 * @property {Array<{ id: number, name: string, storyDescription: string | null, educationalDescription: string | null, currency: number, completedAt: string | null }>} completedActivities
 */

/**
 * Pobiera profil studenta w kontekście grupy.
 * GET /groups/:groupId/student-profile
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, profile?: GroupStudentProfile, error?: string }>}
 */
export async function fetchGroupStudentProfile(groupId) {
  const result = await getJson(`/groups/${groupId}/student-profile`, { includeBrowserId: true });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string, error?: string }} */ (result.data);
    return {
      ok: false,
      error: errorData?.error || errorData?.message || 'Nie udało się pobrać profilu studenta',
    };
  }

  const data = /** @type {GroupStudentProfile & { error?: string }} */ (result.data);
  if (data?.error) {
    return { ok: false, error: data.error };
  }

  return {
    ok: true,
    profile: {
      ...data,
      avatarUrl: getAssetUrl(data.avatarUrl)
    }
  };
}

/**
 * @param {number} value
 * @returns {string}
 */
export function formatProfileNumber(value) {
  return new Intl.NumberFormat('pl-PL').format(value ?? 0);
}
