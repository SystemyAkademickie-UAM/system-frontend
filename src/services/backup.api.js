import { getJson } from './api-client.js';

/**
 * Uploads an encrypted backup file to restore the database.
 *
 * @param {File} file - The `.enc` backup file from the user's filesystem.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function importBackup(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/backup/import', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        errorMessage = json.message || errorMessage;
      } catch {
        // ignore parse error
      }
      return { ok: false, error: errorMessage };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || 'Network error' };
  }
}
