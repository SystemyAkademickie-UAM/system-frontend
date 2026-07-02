import { fetchAvatars } from './profile.api.js';

/** @type {import('./profile.api.js').Avatar[] | null} */
let cachedAvatarList = null;

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
