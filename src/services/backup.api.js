import { getApiBaseUrl } from '../constants/api.constants.js';
import { ADMIN_BACKUP_EXPORT_PATH, ADMIN_BACKUP_IMPORT_PATH } from '../constants/adminBackup.constants.js';

/**
 * Same-origin (or VITE) URL for cookie-authenticated backup download.
 * @returns {string}
 */
export function getBackupExportUrl() {
  return `${getApiBaseUrl()}${ADMIN_BACKUP_EXPORT_PATH}`;
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
