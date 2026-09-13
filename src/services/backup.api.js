import { getJson } from './api-client.js';

/**
 * Initiates a database backup download.
 * The server returns an encrypted `.enc` file as a binary blob.
 *
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function exportBackup() {
  try {
    const response = await fetch('/api/admin/backup/export', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return { ok: false, error: text || `HTTP ${response.status}` };
    }

    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition') || '';
    const filenameMatch = disposition.match(/filename="?([^";\s]+)"?/);
    const filename = filenameMatch?.[1] || `backup-${Date.now()}.enc`;

    // Trigger browser download
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || 'Network error' };
  }
}

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
