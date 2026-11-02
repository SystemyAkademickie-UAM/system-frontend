import { getApiBaseUrl } from '../constants/api.constants.js';
import {
  ADMIN_BACKUP_AUTO_DOWNLOAD_PATH,
  ADMIN_BACKUP_EXPORT_PATH,
  ADMIN_BACKUP_IMPORT_PATH,
  ADMIN_BACKUP_STATUS_PATH,
  ADMIN_BACKUP_TRIGGER_AUTO_PATH,
} from '../constants/adminBackup.constants.js';

/**
 * Same-origin (or VITE) URL for cookie-authenticated backup download.
 * @returns {string}
 */
export function getBackupExportUrl() {
  return `${getApiBaseUrl()}${ADMIN_BACKUP_EXPORT_PATH}`;
}

/**
 * Same-origin (or VITE) URL for downloading a specific automated backup from server volume.
 * @param {string} filename
 * @returns {string}
 */
export function getAutoBackupDownloadUrl(filename) {
  return `${getApiBaseUrl()}${ADMIN_BACKUP_AUTO_DOWNLOAD_PATH(filename)}`;
}

/**
 * Fetches the backup status, timestamps, and warning alerts.
 * @returns {Promise<{ ok: boolean, data?: import('../types').BackupStatus, error?: string }>}
 */
export async function fetchBackupStatus() {
  try {
    const response = await fetch(`${getApiBaseUrl()}${ADMIN_BACKUP_STATUS_PATH}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json?.message) {
          errorMessage = json.message;
        }
      } catch {
        // keep status text
      }
      return { ok: false, error: errorMessage };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: message };
  }
}

/**
 * Triggers an automated backup immediately on the host/container volume.
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function triggerAutoBackup() {
  try {
    const response = await fetch(`${getApiBaseUrl()}${ADMIN_BACKUP_TRIGGER_AUTO_PATH}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json?.message) {
          errorMessage = json.message;
        }
      } catch {
        // keep status text
      }
      return { ok: false, error: errorMessage };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: message };
  }
}

/**
 * Uploads an encrypted backup file to restore the database.
 *
 * @param {File} file
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function importBackup(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${getApiBaseUrl()}${ADMIN_BACKUP_IMPORT_PATH}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json && typeof json.message === 'string' && json.message.length > 0) {
          errorMessage = json.message;
        }
      } catch {
        // keep status text
      }
      return { ok: false, error: errorMessage };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: message };
  }
}

