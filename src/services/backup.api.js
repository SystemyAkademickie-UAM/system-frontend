/**
 * @file backup.api.js
 * @description Moduł komunikacji z API backendu realizujący operacje dla backup.
 */

// === IMPORTY I KONFIGURACJA KLIENTA API ===
import { getApiBaseUrl } from '../constants/api.constants.js';
import {
  ADMIN_BACKUP_AUTO_DOWNLOAD_PATH,
  ADMIN_BACKUP_EXPORT_PATH,
  ADMIN_BACKUP_IMPORT_PATH,
  ADMIN_BACKUP_SCHEDULE_PATH,
  ADMIN_BACKUP_STATUS_PATH,
  ADMIN_BACKUP_TRIGGER_AUTO_PATH,
} from '../constants/adminBackup.constants.js';

// === OPERACJE I ZAPYTANIA REST API ===
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
 * Downloads manual backup export using authenticated fetch, handling HTTP errors cleanly.
 * When a password is provided, sends a POST request with password encryption.
 * @param {string} [password]
 * @returns {Promise<{ ok: boolean, filename?: string, error?: string }>}
 */
export async function downloadBackupExportFile(password) {
  try {
    const isPasswordProtected = Boolean(password && password.trim().length > 0);
    const options = isPasswordProtected
      ? {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: password.trim() }),
        }
      : {
          method: 'GET',
          credentials: 'include',
        };

    const response = await fetch(getBackupExportUrl(), options);
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json?.message) {
          errorMessage = Array.isArray(json.message) ? json.message.join(', ') : json.message;
        }
      } catch {
        // fallback
      }
      return { ok: false, error: errorMessage };
    }
    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition');
    let filename = 'backup.enc';
    if (disposition) {
      const match = /filename=["']?([^"']+)["']?/.exec(disposition);
      if (match && match[1]) {
        filename = match[1];
      }
    }
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    return { ok: true, filename };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Downloads a specific auto-backup file using authenticated fetch, handling HTTP errors cleanly.
 * @param {string} filename
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function downloadAutoBackupFile(filename) {
  try {
    const response = await fetch(getAutoBackupDownloadUrl(filename), {
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
        // fallback
      }
      return { ok: false, error: errorMessage };
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Fetches the backup status, timestamps, schedule and warning alerts.
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
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
        // fallback
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
 * Fetches automated backup schedule configuration.
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function fetchBackupSchedule() {
  try {
    const response = await fetch(`${getApiBaseUrl()}${ADMIN_BACKUP_SCHEDULE_PATH}`, {
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
        // fallback
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
 * Updates automated backup schedule configuration.
 * @param {{ enabled: boolean, interval: string, timeOfDay: string }} scheduleConfig
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function updateBackupSchedule(scheduleConfig) {
  try {
    const response = await fetch(`${getApiBaseUrl()}${ADMIN_BACKUP_SCHEDULE_PATH}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleConfig),
    });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json?.message) {
          errorMessage = Array.isArray(json.message) ? json.message.join(', ') : json.message;
        }
      } catch {
        // fallback
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
        // fallback
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
 * Uploads an encrypted backup file to restore the database, optionally passing decryption password.
 *
 * @param {File} file
 * @param {string} [password]
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function importBackup(file, password) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (password && password.trim().length > 0) {
      formData.append('password', password.trim());
    }
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
        // fallback
      }
      return { ok: false, error: errorMessage };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: message };
  }
}
