/** Word the superadmin must type before a destructive restore. */
export const ADMIN_BACKUP_CONFIRM_WORD = 'RESTORE';

export const ADMIN_BACKUP_EXPORT_PATH = '/admin/backup/export';

export const ADMIN_BACKUP_IMPORT_PATH = '/admin/backup/import';

export const ADMIN_BACKUP_STATUS_PATH = '/admin/backup/status';

export const ADMIN_BACKUP_TRIGGER_AUTO_PATH = '/admin/backup/auto-backup';

export const ADMIN_BACKUP_AUTO_DOWNLOAD_PATH = (filename) =>
  `/admin/backup/auto-backups/${encodeURIComponent(filename)}`;

export const BYTES_PER_MIB = 1024 * 1024;

