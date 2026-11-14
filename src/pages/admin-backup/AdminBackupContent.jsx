/**
 * @file AdminBackupContent.jsx
 * @description Główny komponent widoku strony dla obszaru AdminBackupContent (zarządzanie kopiami zapasowymi).
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, useToast, LoadingSpinner, Modal } from '../../components/ui/index.js';
import {
  ADMIN_BACKUP_CONFIRM_WORD,
  BACKUP_PASSWORD_MIN_LENGTH,
  BYTES_PER_MIB,
  AUTO_BACKUP_INTERVAL_OPTIONS,
} from '../../constants/adminBackup.constants.js';
import {
  downloadAutoBackupFile,
  downloadBackupExportFile,
  fetchBackupStatus,
  importBackup,
  triggerAutoBackup,
  updateBackupSchedule,
} from '../../services/backup.api.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './AdminBackupContent.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const TEXTS = {
  polish: {
    pageTitle: 'Kopia zapasowa',
    pageSubtitle: 'Zarządzanie automatycznymi oraz ręcznymi kopiami zapasowymi bazy danych.',

    // Warning banner
    alertOverdueTitle: 'Wymagane działanie: Baza danych dawno nie była zabezpieczana ręczną kopią zapasową',
    alertOverdueDesc: (days, threshold) =>
      `Od ostatniego ręcznego pobrania kopii zapasowej minęło już ${days} dni (zalecany interwał: maksymalnie ${threshold} dni). Zaleca się niezwłoczne pobranie kopii zapasowej na zewnętrzny nośnik, aby zagwarantować niezależne bezpieczeństwo danych.`,
    alertNeverDesc:
      'W systemie nie odnotowano jeszcze żadnej ręcznej kopii zapasowej bazy danych. Zaleca się niezwłoczne pobranie kopii zapasowej na zewnętrzny nośnik, aby zagwarantować niezależne bezpieczeństwo danych.',
    alertActionButton: 'Wykonaj i pobierz kopię teraz',

    // Stats
    statLastBackup: 'Ostatnia kopia (ogółem)',
    statLastBackupHint: 'Najświeższy stan bazy danych',
    statLastManual: 'Ostatnia kopia ręczna',
    statLastManualOverdue: 'Wymaga odświeżenia',
    statLastManualOk: 'Stan aktualny',
    statAutoCount: 'Automatyczne na serwerze',
    statAutoHint: (retentionDays) => `Retencja: ${retentionDays} dni (automatyczne czyszczenie)`,
    none: 'Brak',

    // Schedule section
    scheduleSectionTitle: 'Harmonogram automatycznych kopii zapasowych',
    scheduleSectionDesc:
      'Skonfiguruj częstotliwość oraz godzinę wykonywania automatycznych kopii zapasowych na wolumenie serwera systemowego.',
    scheduleEnabledLabel: 'Włącz automatyczne wykonywanie kopii zapasowych na serwerze',
    scheduleIntervalLabel: 'Częstotliwość:',
    scheduleTimeLabel: 'Godzina wykonania (czas serwera):',
    scheduleNextRunLabel: 'Najbliższe planowane wykonanie:',
    scheduleDisabledHint: 'Harmonogram jest obecnie wyłączony. Żadne kopie automatyczne nie będą tworzone.',
    scheduleSaveButton: 'Zapisz harmonogram',
    scheduleSaving: 'Zapisywanie...',
    scheduleSuccess: 'Zaktualizowano harmonogram automatycznych kopii zapasowych.',

    // Server backups list
    serverSectionTitle: 'Kopie automatyczne na serwerze',
    serverSectionDesc: (retentionDays) =>
      `Automatyczne kopie zapasowe zapisywane są na wolumenie serwera systemowego w zaszyfrowanej postaci (AES-256-GCM). Pliki starsze niż ${retentionDays} dni są automatycznie usuwane, aby zapobiec przepełnieniu pamięci.`,
    serverCreateNow: 'Utwórz kopię na serwerze teraz',
    serverCreating: 'Tworzenie kopii...',
    serverCreatedSuccess: 'Utworzono automatyczną kopię zapasową na serwerze.',
    tableColFile: 'Plik',
    tableColDate: 'Data utworzenia',
    tableColSize: 'Rozmiar',
    tableColAction: 'Akcja',
    tableEmpty: 'Brak zapisanych kopii automatycznych na serwerze.',
    tableDownloadBtn: 'Pobierz',
    downloadStarting: (filename) => `Rozpoczęto pobieranie ${filename}...`,

    // Manual export section
    exportSectionTitle: 'Ręczny eksport bazy danych',
    exportSectionDesc:
      'Pobierz bezpośrednio zaszyfrowaną kopię zapasową całej bazy danych na swój komputer. Podczas pobierania zdefiniuj hasło szyfrowania — zabezpiecza ono kopię algorytmem AES-256-GCM z kluczem wygenerowanym przez PBKDF2.',
    exportButton: 'Pobierz kopię zapasową',
    exportModalTitle: 'Zabezpieczenie kopii zapasowej hasłem',
    exportModalSubtitle: 'Zdefiniuj hasło, którym zostanie zaszyfrowana pobierana kopia bazy danych.',
    exportPasswordLabel: 'Hasło szyfrowania (minimum 8 znaków):',
    exportPasswordConfirmLabel: 'Powtórz hasło szyfrowania:',
    exportPasswordPlaceholder: 'Wpisz hasło szyfrowania...',
    exportPasswordConfirmPlaceholder: 'Powtórz hasło szyfrowania...',
    exportPasswordHint:
      'Hasło jest niezbędne do późniejszego odszyfrowania i przywrócenia kopii. Zapisz je w bezpiecznym menedżerze haseł.',
    exportPasswordMismatch: 'Podane hasła nie są identyczne.',
    exportPasswordTooShort: `Hasło musi zawierać co najmniej ${BACKUP_PASSWORD_MIN_LENGTH} znaków.`,
    exportModalCancel: 'Anuluj',
    exportModalConfirm: 'Pobierz zaszyfrowaną kopię',
    exportInProgress: 'Generowanie i szyfrowanie kopii...',
    exportSuccess: 'Kopia zapasowa została pomyślnie pobrana.',

    // Restore section
    restoreSectionTitle: 'Przywracanie bazy danych',
    restoreSectionDesc:
      'Prześlij plik kopii zapasowej (.enc) oraz podaj hasło szyfrowania ustalone podczas eksportu. Ta operacja jest destrukcyjna — istniejące dane w bazie zostaną zastąpione danymi z kopii.',
    restoreFileLabel: 'Wybierz plik kopii zapasowej (.enc):',
    restorePasswordLabel: 'Hasło odszyfrowania kopii:',
    restorePasswordPlaceholder: 'Wpisz hasło użyte przy tworzeniu kopii...',
    restorePasswordHelp: 'W przypadku kopii wygenerowanych automatycznie na serwerze pole to może pozostać puste.',
    restoreButton: 'Przywróć bazę danych',
    restoreConfirmTitle: 'Potwierdzenie przywrócenia bazy danych',
    restoreConfirmWarning:
      'Ta operacja nieodwracalnie nadpisze wszystkie dane w bazie danych danymi z wybranego pliku kopii zapasowej.',
    restoreConfirmPrompt: (word) => `Aby kontynuować, wpisz słowo ${word} poniżej:`,
    restoreConfirmInputPlaceholder: `Wpisz ${ADMIN_BACKUP_CONFIRM_WORD}`,
    restoreConfirmCancel: 'Anuluj',
    restoreConfirmSubmit: 'Przywróć bazę danych',
    restoreProgress: 'Przywracanie bazy danych...',
    restoreSuccess: 'Baza danych została pomyślnie przywrócona.',
    selectFileError: 'Wybierz plik kopii zapasowej (.enc).',
  },
  english: {
    pageTitle: 'Database Backup',
    pageSubtitle: 'Manage automated and manual database backups.',

    // Warning banner
    alertOverdueTitle: 'Action Required: Database has not been manually backed up recently',
    alertOverdueDesc: (days, threshold) =>
      `It has been ${days} days since the last manual backup download (recommended interval: up to ${threshold} days). It is strongly advised to download a manual backup to external storage immediately to safeguard data independently.`,
    alertNeverDesc:
      'No manual database backup has been recorded in the system yet. It is strongly advised to download a manual backup to external storage immediately.',
    alertActionButton: 'Create and download backup now',

    // Stats
    statLastBackup: 'Last Backup (Overall)',
    statLastBackupHint: 'Most recent database state',
    statLastManual: 'Last Manual Backup',
    statLastManualOverdue: 'Refresh required',
    statLastManualOk: 'Up to date',
    statAutoCount: 'Automated on Server',
    statAutoHint: (retentionDays) => `Retention: ${retentionDays} days (auto clean-up)`,
    none: 'None',

    // Schedule section
    scheduleSectionTitle: 'Automated Backup Schedule',
    scheduleSectionDesc:
      'Configure the frequency and time for automated backups executed on the host system volume.',
    scheduleEnabledLabel: 'Enable automated database backups on server',
    scheduleIntervalLabel: 'Backup frequency:',
    scheduleTimeLabel: 'Execution time (server time):',
    scheduleNextRunLabel: 'Next scheduled execution:',
    scheduleDisabledHint: 'Automated backup schedule is currently disabled. No automatic backups will run.',
    scheduleSaveButton: 'Save Schedule',
    scheduleSaving: 'Saving...',
    scheduleSuccess: 'Automated backup schedule updated successfully.',

    // Server backups list
    serverSectionTitle: 'Automated Backups on Server',
    serverSectionDesc: (retentionDays) =>
      `Automated backups are stored on the system server volume in encrypted format (AES-256-GCM). Files older than ${retentionDays} days are automatically deleted to prevent storage overflow.`,
    serverCreateNow: 'Create server backup now',
    serverCreating: 'Creating backup...',
    serverCreatedSuccess: 'Automated server backup created successfully.',
    tableColFile: 'File',
    tableColDate: 'Creation Date',
    tableColSize: 'Size',
    tableColAction: 'Action',
    tableEmpty: 'No automated backups found on server.',
    tableDownloadBtn: 'Download',
    downloadStarting: (filename) => `Starting download of ${filename}...`,

    // Manual export section
    exportSectionTitle: 'Manual Database Export',
    exportSectionDesc:
      'Download an encrypted backup of the entire database to your computer. When downloading, define an encryption password — the file will be protected with AES-256-GCM using a PBKDF2-derived key.',
    exportButton: 'Download Database Backup',
    exportModalTitle: 'Protect Backup with Password',
    exportModalSubtitle: 'Define the password to encrypt this database backup file.',
    exportPasswordLabel: 'Encryption password (minimum 8 characters):',
    exportPasswordConfirmLabel: 'Confirm encryption password:',
    exportPasswordPlaceholder: 'Enter encryption password...',
    exportPasswordConfirmPlaceholder: 'Repeat encryption password...',
    exportPasswordHint:
      'This password is required to decrypt and restore this backup in the future. Save it in a secure password manager.',
    exportPasswordMismatch: 'Passwords do not match.',
    exportPasswordTooShort: `Password must be at least ${BACKUP_PASSWORD_MIN_LENGTH} characters.`,
    exportModalCancel: 'Cancel',
    exportModalConfirm: 'Download Encrypted Backup',
    exportInProgress: 'Generating and encrypting backup...',
    exportSuccess: 'Database backup downloaded successfully.',

    // Restore section
    restoreSectionTitle: 'Database Restore',
    restoreSectionDesc:
      'Upload a backup file (.enc) and enter the decryption password set during export. This operation is destructive — existing database data will be overwritten.',
    restoreFileLabel: 'Select backup file (.enc):',
    restorePasswordLabel: 'Backup decryption password:',
    restorePasswordPlaceholder: 'Enter the password used when creating this backup...',
    restorePasswordHelp: 'For automated backups generated on the server, this field may be left blank.',
    restoreButton: 'Restore Database',
    restoreConfirmTitle: 'Confirm Database Restore',
    restoreConfirmWarning:
      'This operation will permanently overwrite all database tables and records with the data from the selected backup file.',
    restoreConfirmPrompt: (word) => `To continue, type the word ${word} below:`,
    restoreConfirmInputPlaceholder: `Type ${ADMIN_BACKUP_CONFIRM_WORD}`,
    restoreConfirmCancel: 'Cancel',
    restoreConfirmSubmit: 'Restore Database',
    restoreProgress: 'Restoring database...',
    restoreSuccess: 'Database restored successfully.',
    selectFileError: 'Please select a backup file (.enc).',
  },
};

function formatDate(isoString, lang = 'polish') {
  if (!isoString) {
    return lang === 'english' ? 'None' : 'Brak';
  }
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) {
      return isoString;
    }
    return d.toLocaleString(lang === 'english' ? 'en-US' : 'pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) {
    return '0 MB';
  }
  const mib = bytes / BYTES_PER_MIB;
  if (mib < 0.1) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${mib.toFixed(2)} MB`;
}

// === ZARZĄDZANIE KOPIĄ BAZY DANYCH (OSOBA NADZORUJĄCA: /backups) ===
/**
 * Rola: Osoba nadzorująca.
 * Ścieżka: /backups.
 * Uprawnienia:
 * - Zarządzanie harmonogramem automatycznych kopii zapasowych
 * - Wykonywanie i pobieranie ręcznych kopii zapasowych bazy danych z szyfrowaniem hasłem
 * - Wyzwalanie i pobieranie automatycznych kopii zapasowych
 * - Przywracanie stanu bazy danych z pliku zaszyfrowanego
 */
export default function AdminBackupContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const t = TEXTS[LANGUAGE] || TEXTS.polish;
  const { showSuccess, showError } = useToast();

  const [backupStatus, setBackupStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Schedule settings
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleInterval, setScheduleInterval] = useState('daily');
  const [scheduleTime, setScheduleTime] = useState('02:00');
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // Auto backup trigger
  const [isTriggeringAuto, setIsTriggeringAuto] = useState(false);

  // Manual export state & modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exportPasswordConfirm, setExportPasswordConfirm] = useState('');
  const [exportPasswordError, setExportPasswordError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  // Restore state
  const [selectedFile, setSelectedFile] = useState(null);
  const [restorePassword, setRestorePassword] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  // Confirm modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const fileInputRef = useRef(null);

  const loadStatus = useCallback(async () => {
    const result = await fetchBackupStatus();
    if (result.ok && result.data) {
      setBackupStatus(result.data);
      if (result.data.schedule) {
        setScheduleEnabled(Boolean(result.data.schedule.enabled));
        setScheduleInterval(result.data.schedule.interval || 'daily');
        setScheduleTime(result.data.schedule.timeOfDay || '02:00');
      }
    }
    setIsLoadingStatus(false);
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // === HANDLERY: HARMONOGRAM ===
  const handleSaveSchedule = async () => {
    setIsSavingSchedule(true);
    try {
      const result = await updateBackupSchedule({
        enabled: scheduleEnabled,
        interval: scheduleInterval,
        timeOfDay: scheduleTime,
      });
      if (result.ok) {
        showSuccess(t.scheduleSuccess);
        await loadStatus();
      } else {
        showError(result.error || 'Nie udało się zaktualizować harmonogramu.');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd zapisu harmonogramu.');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  // === HANDLERY: AUTO BACKUP ===
  const handleTriggerAutoBackup = async () => {
    setIsTriggeringAuto(true);
    try {
      const result = await triggerAutoBackup();
      if (result.ok) {
        showSuccess(t.serverCreatedSuccess);
        await loadStatus();
      } else {
        showError(result.error || 'Nie udało się utworzyć kopii zapasowej.');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd tworzenia kopii.');
    } finally {
      setIsTriggeringAuto(false);
    }
  };

  const handleDownloadAutoBackup = async (filename) => {
    showSuccess(t.downloadStarting(filename));
    const result = await downloadAutoBackupFile(filename);
    if (!result.ok) {
      showError(result.error || `Błąd pobierania ${filename}.`);
    }
  };

  // === HANDLERY: RĘCZNY EKSPORT (HASŁO) ===
  const handleOpenExportModal = () => {
    setExportPassword('');
    setExportPasswordConfirm('');
    setExportPasswordError('');
    setShowExportModal(true);
  };

  const handleConfirmExportWithPassword = async () => {
    const trimmed = exportPassword.trim();
    const trimmedConfirm = exportPasswordConfirm.trim();

    if (trimmed.length < BACKUP_PASSWORD_MIN_LENGTH) {
      setExportPasswordError(t.exportPasswordTooShort);
      return;
    }
    if (trimmed !== trimmedConfirm) {
      setExportPasswordError(t.exportPasswordMismatch);
      return;
    }

    setExportPasswordError('');
    setShowExportModal(false);
    setIsExporting(true);
    setExportStatus(null);

    const result = await downloadBackupExportFile(trimmed);
    if (result.ok) {
      setExportStatus({ type: 'success', message: t.exportSuccess });
      showSuccess(t.exportSuccess);
      await loadStatus();
    } else {
      setExportStatus({ type: 'error', message: result.error || 'Błąd pobierania kopii.' });
      showError(result.error || 'Nie udało się pobrać kopii.');
    }
    setIsExporting(false);
  };

  // === HANDLERY: PRZYWRACANIE (IMPORT) ===
  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setImportStatus(null);
  };

  const handleImportClick = () => {
    if (!selectedFile) {
      showError(t.selectFileError);
      return;
    }
    setConfirmInput('');
    setShowConfirmModal(true);
  };

  const handleConfirmRestore = async () => {
    if (confirmInput !== ADMIN_BACKUP_CONFIRM_WORD) {
      return;
    }

    setShowConfirmModal(false);
    setIsImporting(true);
    setImportStatus(null);

    const result = await importBackup(selectedFile, restorePassword);

    setIsImporting(false);

    if (result.ok) {
      setImportStatus({ type: 'success', message: t.restoreSuccess });
      showSuccess(t.restoreSuccess);
      setSelectedFile(null);
      setRestorePassword('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadStatus();
    } else {
      setImportStatus({
        type: 'error',
        message: result.error || 'Nie udało się przywrócić bazy danych.',
      });
      showError(result.error || 'Błąd importu.');
    }
  };

  // === RENDEROWANIE WIDOKU ===
  return (
    <div className="admin-backup">
      <h1 className="admin-backup__title">{t.pageTitle}</h1>
      <p className="admin-backup__subtitle">{t.pageSubtitle}</p>

      {/* ── Warning Alert (Manual Backup Overdue) ────────────────────── */}
      {backupStatus?.isManualBackupOverdue ? (
        <div className="admin-backup__alert admin-backup__alert--warning" role="alert">
          <div className="admin-backup__alert-icon" aria-hidden="true">[!]</div>
          <div className="admin-backup__alert-body">
            <h3 className="admin-backup__alert-title">{t.alertOverdueTitle}</h3>
            <p className="admin-backup__alert-desc">
              {backupStatus.lastManualBackupAt
                ? t.alertOverdueDesc(backupStatus.daysSinceLastManualBackup, backupStatus.manualBackupThresholdDays)
                : t.alertNeverDesc}
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenExportModal}
              disabled={isExporting}
            >
              {isExporting ? t.exportInProgress : t.alertActionButton}
            </Button>
          </div>
        </div>
      ) : null}

      {/* ── Overview Statistics Cards ───────────────────────────────── */}
      <div className="admin-backup__overview-grid">
        <div className="admin-backup__overview-card">
          <span className="admin-backup__overview-card-label">{t.statLastBackup}</span>
          <span className="admin-backup__overview-card-value">
            {isLoadingStatus ? <LoadingSpinner size="sm" /> : formatDate(backupStatus?.lastBackupAt, LANGUAGE)}
          </span>
          <span className="admin-backup__overview-card-hint">{t.statLastBackupHint}</span>
        </div>

        <div className="admin-backup__overview-card">
          <span className="admin-backup__overview-card-label">{t.statLastManual}</span>
          <span
            className={`admin-backup__overview-card-value ${
              backupStatus?.isManualBackupOverdue
                ? 'admin-backup__overview-card-value--overdue'
                : 'admin-backup__overview-card-value--ok'
            }`}
          >
            {isLoadingStatus ? <LoadingSpinner size="sm" /> : formatDate(backupStatus?.lastManualBackupAt, LANGUAGE)}
          </span>
          <span className="admin-backup__overview-card-hint">
            {backupStatus?.isManualBackupOverdue ? t.statLastManualOverdue : t.statLastManualOk}
          </span>
        </div>

        <div className="admin-backup__overview-card">
          <span className="admin-backup__overview-card-label">{t.statAutoCount}</span>
          <span className="admin-backup__overview-card-value">
            {isLoadingStatus ? (
              <LoadingSpinner size="sm" />
            ) : (
              `${backupStatus?.autoBackupsCount ?? 0} (${formatBytes(backupStatus?.totalStorageSizeBytes)})`
            )}
          </span>
          <span className="admin-backup__overview-card-hint">
            {t.statAutoHint(backupStatus?.retentionDays ?? 14)}
          </span>
        </div>
      </div>

      {/* ── Automated Backup Schedule Configuration ─────────────────── */}
      <section className="admin-backup__section">
        <div className="admin-backup__section-header">
          <h2 className="admin-backup__section-title">{t.scheduleSectionTitle}</h2>
        </div>
        <p className="admin-backup__section-desc">{t.scheduleSectionDesc}</p>

        <div className="admin-backup__schedule-form">
          <label className="admin-backup__toggle-label">
            <input
              type="checkbox"
              className="admin-backup__checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
            />
            <span className="admin-backup__toggle-text">{t.scheduleEnabledLabel}</span>
          </label>

          <div className="admin-backup__schedule-fields">
            <div className="admin-backup__form-group">
              <label htmlFor="schedule-interval-select" className="admin-backup__field-label">
                {t.scheduleIntervalLabel}
              </label>
              <select
                id="schedule-interval-select"
                className="admin-backup__select"
                value={scheduleInterval}
                disabled={!scheduleEnabled}
                onChange={(e) => setScheduleInterval(e.target.value)}
              >
                {AUTO_BACKUP_INTERVAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label[LANGUAGE] || opt.label.polish}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-backup__form-group">
              <label htmlFor="schedule-time-input" className="admin-backup__field-label">
                {t.scheduleTimeLabel}
              </label>
              <input
                id="schedule-time-input"
                type="time"
                className="admin-backup__time-input"
                value={scheduleTime}
                disabled={!scheduleEnabled}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-backup__schedule-next-run">
            <span className="admin-backup__next-run-label">{t.scheduleNextRunLabel}</span>{' '}
            <span className="admin-backup__next-run-value">
              {scheduleEnabled
                ? formatDate(backupStatus?.schedule?.nextRunAt, LANGUAGE)
                : t.scheduleDisabledHint}
            </span>
          </div>

          <div className="admin-backup__schedule-actions">
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isSavingSchedule}
              onClick={handleSaveSchedule}
            >
              {isSavingSchedule ? t.scheduleSaving : t.scheduleSaveButton}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Automated Backups List on Server ────────────────────────── */}
      <section className="admin-backup__section">
        <div className="admin-backup__section-header">
          <h2 className="admin-backup__section-title">{t.serverSectionTitle}</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isTriggeringAuto}
            onClick={handleTriggerAutoBackup}
          >
            {isTriggeringAuto ? t.serverCreating : t.serverCreateNow}
          </Button>
        </div>
        <p className="admin-backup__section-desc">
          {t.serverSectionDesc(backupStatus?.retentionDays ?? 14)}
        </p>

        <div className="admin-backup__table-wrapper">
          <table className="admin-backup__table">
            <thead>
              <tr>
                <th>{t.tableColFile}</th>
                <th>{t.tableColDate}</th>
                <th>{t.tableColSize}</th>
                <th>{t.tableColAction}</th>
              </tr>
            </thead>
            <tbody>
              {backupStatus?.autoBackups && backupStatus.autoBackups.length > 0 ? (
                backupStatus.autoBackups.map((item) => (
                  <tr key={item.filename}>
                    <td>
                      <code className="admin-backup__file-code">{item.filename}</code>
                    </td>
                    <td>{formatDate(item.createdAt, LANGUAGE)}</td>
                    <td>{formatBytes(item.sizeBytes)}</td>
                    <td>
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => handleDownloadAutoBackup(item.filename)}
                      >
                        {t.tableDownloadBtn}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="admin-backup__table-empty">
                    {t.tableEmpty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Export section (Manual Download with Password) ─────────── */}
      <section className="admin-backup__section">
        <h2 className="admin-backup__section-title">{t.exportSectionTitle}</h2>
        <p className="admin-backup__section-desc">{t.exportSectionDesc}</p>
        <Button
          type="button"
          variant="primary"
          disabled={isExporting}
          onClick={handleOpenExportModal}
        >
          {isExporting ? t.exportInProgress : t.exportButton}
        </Button>

        {exportStatus ? (
          <div className={`admin-backup__status admin-backup__status--${exportStatus.type}`}>
            {exportStatus.message}
          </div>
        ) : null}
      </section>

      {/* ── Import section (Restore) ────────────────────────────────── */}
      <section className="admin-backup__section admin-backup__section--danger">
        <h2 className="admin-backup__section-title">{t.restoreSectionTitle}</h2>
        <p className="admin-backup__section-desc">{t.restoreSectionDesc}</p>

        <div className="admin-backup__form-group">
          <label htmlFor="restore-file-input" className="admin-backup__field-label">
            {t.restoreFileLabel}
          </label>
          <div className="admin-backup__file-row">
            <input
              id="restore-file-input"
              ref={fileInputRef}
              type="file"
              accept=".enc"
              onChange={handleFileChange}
              className="admin-backup__file-input"
              disabled={isImporting}
            />
            {selectedFile ? (
              <span className="admin-backup__file-name">
                {selectedFile.name} ({(selectedFile.size / BYTES_PER_MIB).toFixed(2)} MB)
              </span>
            ) : null}
          </div>
        </div>

        <div className="admin-backup__form-group admin-backup__form-group--spaced">
          <label htmlFor="restore-password-input" className="admin-backup__field-label">
            {t.restorePasswordLabel}
          </label>
          <input
            id="restore-password-input"
            type="password"
            className="admin-backup__input"
            value={restorePassword}
            onChange={(e) => setRestorePassword(e.target.value)}
            placeholder={t.restorePasswordPlaceholder}
            disabled={isImporting}
            autoComplete="current-password"
          />
          <p className="admin-backup__field-hint">{t.restorePasswordHelp}</p>
        </div>

        <div className="admin-backup__restore-actions">
          <Button
            type="button"
            variant="danger"
            disabled={isImporting || !selectedFile}
            onClick={handleImportClick}
          >
            {isImporting ? t.restoreProgress : t.restoreButton}
          </Button>
        </div>

        {importStatus ? (
          <div className={`admin-backup__status admin-backup__status--${importStatus.type}`}>
            {importStatus.message}
          </div>
        ) : null}
      </section>

      {/* ── Modal: Eksport hasła do ręcznej kopii zapasowej ─────────── */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={t.exportModalTitle}
        subtitle={t.exportModalSubtitle}
        onConfirm={handleConfirmExportWithPassword}
        confirmLabel={t.exportModalConfirm}
        confirmVariant="primary"
        confirmDisabled={
          exportPassword.trim().length < BACKUP_PASSWORD_MIN_LENGTH ||
          exportPassword.trim() !== exportPasswordConfirm.trim()
        }
        size="md"
      >
        <div className="admin-backup__modal-form">
          <div className="admin-backup__form-group">
            <label htmlFor="export-password-input" className="admin-backup__field-label">
              {t.exportPasswordLabel}
            </label>
            <input
              id="export-password-input"
              type="password"
              className="admin-backup__input"
              value={exportPassword}
              onChange={(e) => {
                setExportPassword(e.target.value);
                setExportPasswordError('');
              }}
              placeholder={t.exportPasswordPlaceholder}
              autoComplete="new-password"
              autoFocus
            />
          </div>

          <div className="admin-backup__form-group">
            <label htmlFor="export-password-confirm-input" className="admin-backup__field-label">
              {t.exportPasswordConfirmLabel}
            </label>
            <input
              id="export-password-confirm-input"
              type="password"
              className="admin-backup__input"
              value={exportPasswordConfirm}
              onChange={(e) => {
                setExportPasswordConfirm(e.target.value);
                setExportPasswordError('');
              }}
              placeholder={t.exportPasswordConfirmPlaceholder}
              autoComplete="new-password"
            />
          </div>

          {exportPasswordError ? (
            <p className="admin-backup__error-text" role="alert">{exportPasswordError}</p>
          ) : (
            <p className="admin-backup__field-hint">{t.exportPasswordHint}</p>
          )}
        </div>
      </Modal>

      {/* ── Modal: Potwierdzenie destrukcyjnego przywrócenia bazy danych ─ */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={t.restoreConfirmTitle}
        onConfirm={handleConfirmRestore}
        confirmLabel={t.restoreConfirmSubmit}
        confirmVariant="danger"
        confirmDisabled={confirmInput !== ADMIN_BACKUP_CONFIRM_WORD}
        size="md"
      >
        <div className="admin-backup__modal-form">
          <p className="admin-backup__modal-warning">{t.restoreConfirmWarning}</p>
          <p className="admin-backup__modal-instruction">
            {t.restoreConfirmPrompt(ADMIN_BACKUP_CONFIRM_WORD)}
          </p>
          <input
            type="text"
            className="admin-backup__input admin-backup__input--confirm"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={t.restoreConfirmInputPlaceholder}
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
