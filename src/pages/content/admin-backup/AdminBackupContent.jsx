import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, useToast, LoadingSpinner } from '../../../components/ui/index.js';
import {
  ADMIN_BACKUP_CONFIRM_WORD,
  BYTES_PER_MIB,
} from '../../../constants/adminBackup.constants.js';
import {
  downloadAutoBackupFile,
  downloadBackupExportFile,
  fetchBackupStatus,
  importBackup,
  triggerAutoBackup,
} from '../../../services/backup.api.js';
import './AdminBackupContent.css';

function formatDate(isoString) {
  if (!isoString) {
    return 'Brak';
  }
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) {
      return isoString;
    }
    return d.toLocaleString('pl-PL', {
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

export default function AdminBackupContent() {
  const { showSuccess, showError } = useToast();

  // Status & Telemetry
  const [backupStatus, setBackupStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Trigger auto backup state
  const [isTriggeringAuto, setIsTriggeringAuto] = useState(false);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  // Import state
  const [selectedFile, setSelectedFile] = useState(null);
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
    }
    setIsLoadingStatus(false);
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // ── Trigger Auto Backup Now ─────────────────────────────────────────

  const handleTriggerAutoBackup = async () => {
    setIsTriggeringAuto(true);
    try {
      const result = await triggerAutoBackup();
      if (result.ok) {
        showSuccess('Utworzono automatyczną kopię zapasową na serwerze.');
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

  // ── Export (Manual) ─────────────────────────────────────────────────

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);

    const result = await downloadBackupExportFile();
    if (result.ok) {
      setExportStatus({ type: 'success', message: 'Kopia zapasowa pobrana pomyślnie.' });
      showSuccess('Kopia zapasowa pobrana pomyślnie.');
      await loadStatus();
    } else {
      setExportStatus({ type: 'error', message: result.error || 'Błąd pobierania kopii.' });
      showError(result.error || 'Nie udało się pobrać kopii.');
    }
    setIsExporting(false);
  };

  // ── Download specific auto-backup ───────────────────────────────────

  const handleDownloadAutoBackup = async (filename) => {
    showSuccess(`Rozpoczęto pobieranie ${filename}...`);
    const result = await downloadAutoBackupFile(filename);
    if (!result.ok) {
      showError(result.error || `Błąd pobierania ${filename}.`);
    }
  };

  // ── Import (Restore) ────────────────────────────────────────────────

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setImportStatus(null);
  };

  const handleImportClick = () => {
    if (!selectedFile) {
      showError('Wybierz plik kopii zapasowej (.enc).');
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

    const result = await importBackup(selectedFile);

    setIsImporting(false);

    if (result.ok) {
      setImportStatus({ type: 'success', message: 'Baza danych została przywrócona pomyślnie.' });
      showSuccess('Baza danych przywrócona.');
      setSelectedFile(null);
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

  return (
    <div className="admin-backup">
      <h1 className="admin-backup__title">Kopia zapasowa</h1>
      <p className="admin-backup__subtitle">
        Zarządzaj automatycznymi oraz ręcznymi kopiami zapasowymi bazy danych.
      </p>

      {/* ── Warning Alert (Manual Backup Overdue) ────────────────────── */}
      {backupStatus?.isManualBackupOverdue ? (
        <div className="admin-backup__alert admin-backup__alert--warning">
          <div className="admin-backup__alert-icon">⚠️</div>
          <div className="admin-backup__alert-body">
            <h3 className="admin-backup__alert-title">
              Wymagane działanie: Baza danych dawno nie była zabezpieczana ręczną kopią zapasową!
            </h3>
            <p className="admin-backup__alert-desc">
              {backupStatus.lastManualBackupAt
                ? `Od ostatniego ręcznego pobrania kopii zapasowej minęło już ${backupStatus.daysSinceLastManualBackup} dni (zalecany interwał: maksymalnie ${backupStatus.manualBackupThresholdDays} dni).`
                : 'W systemie nie odnotowano jeszcze żadnej ręcznej kopii zapasowej bazy danych.'}
              {' '}Zaleca się niezwłoczne pobranie kopii zapasowej na zewnętrzny nośnik, aby zagwarantować niezależne bezpieczeństwo danych.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Generowanie…' : 'Wykonaj i pobierz kopię teraz'}
            </Button>
          </div>
        </div>
      ) : null}

      {/* ── Overview Statistics Cards ───────────────────────────────── */}
      <div className="admin-backup__overview-grid">
        <div className="admin-backup__overview-card">
          <span className="admin-backup__overview-card-label">Ostatnia kopia (ogółem)</span>
          <span className="admin-backup__overview-card-value">
            {isLoadingStatus ? <LoadingSpinner size="sm" /> : formatDate(backupStatus?.lastBackupAt)}
          </span>
          <span className="admin-backup__overview-card-hint">Najświeższy stan bazy danych</span>
        </div>

        <div className="admin-backup__overview-card">
          <span className="admin-backup__overview-card-label">Ostatnia kopia ręczna</span>
          <span
            className={`admin-backup__overview-card-value ${
              backupStatus?.isManualBackupOverdue
                ? 'admin-backup__overview-card-value--overdue'
                : 'admin-backup__overview-card-value--ok'
            }`}
          >
            {isLoadingStatus ? <LoadingSpinner size="sm" /> : formatDate(backupStatus?.lastManualBackupAt)}
          </span>
          <span className="admin-backup__overview-card-hint">
            {backupStatus?.isManualBackupOverdue ? '⚠️ Wymaga odświeżenia' : 'Stan aktualny'}
          </span>
        </div>

        <div className="admin-backup__overview-card">
          <span className="admin-backup__overview-card-label">Automatyczne na serwerze</span>
          <span className="admin-backup__overview-card-value">
            {isLoadingStatus ? (
              <LoadingSpinner size="sm" />
            ) : (
              `${backupStatus?.autoBackupsCount ?? 0} kopii (${formatBytes(backupStatus?.totalStorageSizeBytes)})`
            )}
          </span>
          <span className="admin-backup__overview-card-hint">
            Retencja: {backupStatus?.retentionDays ?? 14} dni (automatyczne czyszczenie)
          </span>
        </div>
      </div>

      {/* ── Automated Backups Section ───────────────────────────────── */}
      <section className="admin-backup__section">
        <div className="admin-backup__section-header">
          <h2 className="admin-backup__section-title">
            🤖 Automatyczne kopie na serwerze
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isTriggeringAuto}
            onClick={handleTriggerAutoBackup}
          >
            {isTriggeringAuto ? 'Tworzenie kopii…' : 'Utwórz kopię na serwerze teraz'}
          </Button>
        </div>
        <p className="admin-backup__section-desc">
          Automatyczne kopie zapasowe wykonywane są codziennie w nocy (godz. 02:00) i bezpiecznie
          zapisywane na wolumenie serwera systemowego w zaszyfrowanej postaci (AES-256-GCM).
          Pliki starsze niż {backupStatus?.retentionDays ?? 14} dni są automatycznie usuwane, aby zapobiec przepełnieniu pamięci.
        </p>

        <div className="admin-backup__table-wrapper">
          <table className="admin-backup__table">
            <thead>
              <tr>
                <th>Plik</th>
                <th>Data utworzenia</th>
                <th>Rozmiar</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {backupStatus?.autoBackups && backupStatus.autoBackups.length > 0 ? (
                backupStatus.autoBackups.map((item) => (
                  <tr key={item.filename}>
                    <td>
                      <code className="admin-backup__file-code">{item.filename}</code>
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{formatBytes(item.sizeBytes)}</td>
                    <td>
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => handleDownloadAutoBackup(item.filename)}
                      >
                        Pobierz
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="admin-backup__table-empty">
                    Brak zapisanych kopii automatycznych na serwerze.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Export section (Manual Download) ────────────────────────── */}
      <section className="admin-backup__section">
        <h2 className="admin-backup__section-title">
          📦 Ręczny eksport bazy danych
        </h2>
        <p className="admin-backup__section-desc">
          Pobierz bezpośrednio zaszyfrowaną kopię zapasową całej bazy danych na swój komputer.
          Plik jest kompresowany i szyfrowany algorytmem AES-256-GCM.
          Bez klucza szyfrowania zdefiniowanego na serwerze nie da się go odszyfrować.
        </p>
        <Button
          type="button"
          variant="primary"
          disabled={isExporting}
          onClick={handleExport}
        >
          {isExporting ? 'Generowanie…' : 'Pobierz kopię zapasową'}
        </Button>

        {exportStatus ? (
          <div className={`admin-backup__status admin-backup__status--${exportStatus.type}`}>
            {exportStatus.message}
          </div>
        ) : null}
      </section>

      {/* ── Import section (Restore) ────────────────────────────────── */}
      <section className="admin-backup__section admin-backup__section--danger">
        <h2 className="admin-backup__section-title">
          ⚠️ Przywracanie bazy danych
        </h2>
        <p className="admin-backup__section-desc">
          Prześlij wcześniej pobrany plik kopii zapasowej (<code>.enc</code>), aby przywrócić
          stan bazy danych. Ta operacja jest <strong>destrukcyjna</strong> — istniejące dane
          zostaną nadpisane danymi z kopii zapasowej.
        </p>

        <div className="admin-backup__file-row">
          <input
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

        <div className="admin-backup__restore-actions">
          <Button
            type="button"
            variant="danger"
            disabled={isImporting || !selectedFile}
            onClick={handleImportClick}
          >
            {isImporting ? 'Przywracanie…' : 'Przywróć bazę danych'}
          </Button>
        </div>

        {importStatus ? (
          <div className={`admin-backup__status admin-backup__status--${importStatus.type}`}>
            {importStatus.message}
          </div>
        ) : null}
      </section>

      {/* ── Confirmation modal ──────────────────────────────────────── */}
      {showConfirmModal ? (
        <div
          className="admin-backup__modal-overlay"
          onClick={() => setShowConfirmModal(false)}
          role="presentation"
        >
          <div
            className="admin-backup__modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="restore-confirm-title"
          >
            <h3 id="restore-confirm-title" className="admin-backup__modal-title">
              Potwierdzenie przywracania
            </h3>
            <p className="admin-backup__modal-text">
              Ta operacja <strong>nieodwracalnie nadpisze</strong> wszystkie dane w bazie
              danych danymi z wybranego pliku kopii zapasowej.
            </p>
            <p className="admin-backup__modal-text">
              Aby kontynuować, wpisz słowo <code>{ADMIN_BACKUP_CONFIRM_WORD}</code> poniżej:
            </p>
            <input
              type="text"
              className="admin-backup__modal-input"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={`Wpisz ${ADMIN_BACKUP_CONFIRM_WORD}`}
              autoFocus
            />
            <div className="admin-backup__modal-actions">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
              >
                Anuluj
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={confirmInput !== ADMIN_BACKUP_CONFIRM_WORD}
                onClick={handleConfirmRestore}
              >
                Przywróć
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
