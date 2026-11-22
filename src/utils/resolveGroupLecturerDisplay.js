/**
 * @file resolveGroupLecturerDisplay.js
 * @description Funkcje pomocnicze i narzędziowe modułu resolveGroupLecturerDisplay.
 */

// === IMPORTY I STAŁE MODUŁU ===
/**
 * Zwraca etykietę prowadzącej grupy z API (`group.lecturer`).
 * Backend uwzględnia preferencję `showNickname` prowadzącego dla wszystkich odbiorców.
 *
 * @param {import('../services/groups.api.js').GroupListItem} group
 */

export function resolveGroupLecturerDisplay(group) {
  return group?.lecturer?.trim() || '';
}

// === GŁÓWNA LOGIKA NARZĘDZIOWA I EKSPORTY ===
/**
 * @deprecated Użyj resolveGroupLecturerDisplay(group) — backend zwraca już poprawną etykietę.
 */

export function resolveGroupLecturerDisplayLegacy(group, _options = {}) {
  return resolveGroupLecturerDisplay(group);
}
