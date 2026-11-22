/**
 * @file maintenance.api.js
 * @description Moduł komunikacji z API weryfikujący stan przerwy technicznej (maintenance mode).
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { getJson } from './api-client.js';

export const SYSTEM_STATUS_PATH = '/system/status';
export const SYSTEM_MAINTENANCE_PATH = '/system/maintenance';
const MAINTENANCE_STORAGE_KEY = 'maq_maintenance_notice';

/**
 * @typedef {Object} MaintenanceStatus
 * @property {boolean} enabled
 * @property {string} message
 * @property {string | null} [estimatedEndAt]
 * @property {string | null} [updatedAt]
 */

/**
 * Pamięć podręczna stanu przerwy technicznej w pamięci procesu SPA.
 * @type {MaintenanceStatus | null}
 */
let cachedMaintenanceStatus = null;

/** @type {Set<(status: MaintenanceStatus | null) => void>} */
const maintenanceListeners = new Set();

/**
 * Pobiera bieżący stan przerwy technicznej z serwera.
 * @returns {Promise<MaintenanceStatus | null>}
 */
export async function fetchMaintenanceStatus() {
  try {
    const result = await getJson(SYSTEM_STATUS_PATH);
    if (!result.ok || !result.data || typeof result.data !== 'object') {
      return cachedMaintenanceStatus;
    }
    const raw = /** @type {Record<string, unknown>} */ (result.data);
    const m = /** @type {Record<string, unknown> | null} */ (raw.maintenance);
    if (!m) {
      return null;
    }
    const status = {
      enabled: m.enabled === true,
      message: typeof m.message === 'string' ? m.message : '',
      estimatedEndAt: typeof m.estimatedEndAt === 'string' ? m.estimatedEndAt : null,
      updatedAt: typeof m.updatedAt === 'string' ? m.updatedAt : null,
    };
    updateCachedMaintenanceStatus(status);
    return status;
  } catch {
    return cachedMaintenanceStatus;
  }
}

/**
 * Sprawdza czy według pamięci podręcznej przerwa techniczna jest aktywna.
 * @returns {boolean}
 */
export function isCachedMaintenanceActive() {
  return cachedMaintenanceStatus?.enabled === true;
}

/**
 * Zwraca aktualnie zapamiętany stan przerwy technicznej.
 * @returns {MaintenanceStatus | null}
 */
export function getCachedMaintenanceStatus() {
  if (cachedMaintenanceStatus) {
    return cachedMaintenanceStatus;
  }
  try {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem(MAINTENANCE_STORAGE_KEY);
      if (stored) {
        cachedMaintenanceStatus = JSON.parse(stored);
        return cachedMaintenanceStatus;
      }
    }
  } catch {
  }
  return null;
}

/**
 * Aktualizuje pamięć podręczną i powiadamia subskrybentów.
 * @param {MaintenanceStatus | null} status
 */
export function updateCachedMaintenanceStatus(status) {
  cachedMaintenanceStatus = status;
  try {
    if (typeof sessionStorage !== 'undefined') {
      if (status && status.enabled) {
        sessionStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(status));
      } else {
        sessionStorage.removeItem(MAINTENANCE_STORAGE_KEY);
      }
    }
  } catch {
  }
  maintenanceListeners.forEach((listener) => {
    try {
      listener(status);
    } catch {
    }
  });
}

/**
 * Rejestruje nasłuchiwacz zmian stanu przerwy technicznej.
 * @param {(status: MaintenanceStatus | null) => void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribeMaintenanceStatus(listener) {
  maintenanceListeners.add(listener);
  return () => {
    maintenanceListeners.delete(listener);
  };
}

