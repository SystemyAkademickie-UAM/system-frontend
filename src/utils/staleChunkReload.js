import {
  VITE_PRELOAD_RELOAD_FLAG_VALUE,
  VITE_PRELOAD_RELOAD_SESSION_KEY,
} from '../constants/chunkReload.constants.js';

function defaultReload() {
  window.location.reload();
}

/**
 * @param {Pick<Storage, 'getItem' | 'setItem'>} [storage]
 * @returns {boolean} true when this tab should reload to pick up a new deploy
 */
export function consumeStaleChunkReload(storage = sessionStorage) {
  if (storage.getItem(VITE_PRELOAD_RELOAD_SESSION_KEY) === VITE_PRELOAD_RELOAD_FLAG_VALUE) {
    return false;
  }
  storage.setItem(VITE_PRELOAD_RELOAD_SESSION_KEY, VITE_PRELOAD_RELOAD_FLAG_VALUE);
  return true;
}

/**
 * Allows another reload after this JS bundle has loaded (next deploy in the same tab).
 * @param {Pick<Storage, 'removeItem'>} [storage]
 */
export function clearStaleChunkReloadFlag(storage = sessionStorage) {
  storage.removeItem(VITE_PRELOAD_RELOAD_SESSION_KEY);
}

/**
 * Vite `vite:preloadError` handler: one automatic reload, no infinite loop.
 * @param {{ preventDefault: () => void }} event
 * @param {{ reload?: () => void, storage?: Pick<Storage, 'getItem' | 'setItem'> }} [options]
 */
export function handleVitePreloadError(event, options = {}) {
  const reload = options.reload ?? defaultReload;
  const storage = options.storage ?? sessionStorage;
  event.preventDefault();
  if (!consumeStaleChunkReload(storage)) {
    return;
  }
  reload();
}

/** Subscribe once at app boot (Vite official load-error handling). */
export function registerVitePreloadErrorReload() {
  window.addEventListener('vite:preloadError', (event) => {
    handleVitePreloadError(event);
  });
}

/**
 * @param {() => Promise<unknown>} factory
 * @param {{ reload?: () => void, storage?: Pick<Storage, 'getItem' | 'setItem'> }} [options]
 * @returns {Promise<unknown>}
 */
export async function importOrReload(factory, options = {}) {
  const reload = options.reload ?? defaultReload;
  const storage = options.storage ?? sessionStorage;
  try {
    return await factory();
  } catch (error) {
    if (!consumeStaleChunkReload(storage)) {
      throw error;
    }
    reload();
    return new Promise(() => {});
  }
}
