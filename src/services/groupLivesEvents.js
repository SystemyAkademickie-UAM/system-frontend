/**
 * @file groupLivesEvents.js
 * @description Moduł komunikacji z API backendu realizujący operacje dla groupLivesEvents.
 */

// === IMPORTY I KONFIGURACJA KLIENTA API ===
export const GROUP_LIVES_INVALIDATED = 'maq-group-lives-invalidated';

/**
 * @param {string | number | null | undefined} groupId
 */

// === OPERACJE I ZAPYTANIA REST API ===
export function invalidateGroupLives(groupId) {
  if (typeof window === 'undefined' || groupId == null) {
    return;
  }

window.dispatchEvent(new CustomEvent(GROUP_LIVES_INVALIDATED, {
    detail: { groupId: String(groupId) },
  }));
}
