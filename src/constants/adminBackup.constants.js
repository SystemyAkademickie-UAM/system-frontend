/**
 * @file adminBackup.constants.js
 * @description Zestaw stałych konfiguracyjnych i parametrów systemowych dla modułu adminBackup.
 */

// === STAŁE BAZOWE I PARAMETRY SYSTEMOWE ===
/** Word the superadmin must type before a destructive restore. */
export const ADMIN_BACKUP_CONFIRM_WORD = 'RESTORE';

export const ADMIN_BACKUP_EXPORT_PATH = '/admin/backup/export';
export const ADMIN_BACKUP_IMPORT_PATH = '/admin/backup/import';
export const ADMIN_BACKUP_STATUS_PATH = '/admin/backup/status';
export const ADMIN_BACKUP_SCHEDULE_PATH = '/admin/backup/schedule';
export const ADMIN_BACKUP_TRIGGER_AUTO_PATH = '/admin/backup/auto-backup';

export const ADMIN_BACKUP_AUTO_DOWNLOAD_PATH = (filename) =>
  `/admin/backup/auto-backups/${encodeURIComponent(filename)}`;

export const BYTES_PER_MIB = 1024 * 1024;
export const BACKUP_PASSWORD_MIN_LENGTH = 8;

export const AUTO_BACKUP_INTERVAL_OPTIONS = [
  { value: 'daily', label: { polish: 'Codziennie', english: 'Daily' } },
  { value: 'every_3_days', label: { polish: 'Co 3 dni', english: 'Every 3 days' } },
  { value: 'weekly', label: { polish: 'Co tydzień', english: 'Weekly' } },
  { value: 'every_2_weeks', label: { polish: 'Co 2 tygodnie', english: 'Every 2 weeks' } },
];
