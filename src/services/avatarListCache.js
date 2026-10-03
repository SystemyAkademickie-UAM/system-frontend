import { fetchAvatars } from './profile.api.js';
import { pickRandomAvatars } from '../utils/avatarCategories.js';

/** @type {import('./profile.api.js').Avatar[] | null} */
let cachedAvatarList = null;

/** @type {import('./profile.api.js').Avatar[] | null} */
let cachedPopularAvatars = null;

/** @type {Promise<import('./profile.api.js').Avatar[]> | null} */
let inFlightRequest = null;

/**
 * Zwraca listę awatarów z pamięci podręcznej (jeśli już pobrano).
 * @returns {import('./profile.api.js').Avatar[] | null}
 */
export function getCachedAvatarList() {
  return cachedAvatarList;
}

/**
 * Zwraca stabilną listę przykładowych awatarów (wylosowaną raz i pamiętaną w trakcie całej sesji).
 * @param {import('./profile.api.js').Avatar[]} [avatars]
 * @param {number} [count=4]
 * @returns {import('./profile.api.js').Avatar[]}
 */
export function getStablePopularAvatars(avatars, count = 4) {
  if (cachedPopularAvatars && cachedPopularAvatars.length === count) {
    return cachedPopularAvatars;
  }
  const source = Array.isArray(avatars) && avatars.length > 0 ? avatars : cachedAvatarList;
  if (!Array.isArray(source) || source.length === 0) {
    return [];
  }
  cachedPopularAvatars = pickRandomAvatars(source, count);
  return cachedPopularAvatars;
}

/**
 * Rozpoczyna wczytywanie grafik awatarów do pamięci podręcznej przeglądarki.
 * @param {import('./profile.api.js').Avatar[]} list
 * @param {number} [limit=16]
 */
export function prefetchAvatarImages(list, limit = 16) {
  if (!Array.isArray(list) || typeof window === 'undefined' || typeof Image === 'undefined') {
    return;
  }
  const toPrefetch = list.slice(0, limit);
  for (const avatar of toPrefetch) {
    if (avatar.imageUrl) {
      const img = new Image();
      img.src = avatar.imageUrl;
    }
  }
}

/**
 * Pobiera listę awatarów raz i współdzieli wynik między widokami logowania / ustawień.
 * @returns {Promise<import('./profile.api.js').Avatar[]>}
 */
export function loadAvatarList() {
  if (cachedAvatarList) {
    return Promise.resolve(cachedAvatarList);
  }

  if (!inFlightRequest) {
    inFlightRequest = fetchAvatars()
      .then((list) => {
        cachedAvatarList = list;
        getStablePopularAvatars(list, 4);
        prefetchAvatarImages(list);
        return list;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}

/** Uruchamia pobieranie awatarów w tle (bez oczekiwania w UI). */
export function prefetchAvatarList() {
  void loadAvatarList();
}
