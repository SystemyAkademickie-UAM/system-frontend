import { useState, useRef } from 'react';
import { Button, useToast } from '../../../components/ui/index.js';
import {
  ADMIN_BACKUP_CONFIRM_WORD,
  BYTES_PER_MIB,
} from '../../../constants/adminBackup.constants.js';
import { getBackupExportUrl, importBackup } from '../../../services/backup.api.js';
import './AdminBackupContent.css';

export default function AdminBackupContent() {
  const { showSuccess, showError } = useToast();

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

  // ── Export ──────────────────────────────────────────────────────────

  const handleExport = () => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      // Zamiast fetch() pobieramy plik natywnie przez przeglądarkę,
      // co oszczędza RAM klienta (szczególnie dla dużych plików).
      // Serwer autoryzuje żądanie za pomocą ciasteczka sesji.
      const a = document.createElement('a');
      a.href = getBackupExportUrl();
      // Atrybut download sugeruje pobieranie.
      // Dokładna nazwa i tak przyjdzie z nagłówka Content-Disposition z serwera.
      a.download = 'backup.enc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setExportStatus({ type: 'success', message: 'Rozpoczęto pobieranie kopii zapasowej.' });
      showSuccess('Kopia zapasowa pobierana pomyślnie.');
    } catch (err) {
      setExportStatus({ type: 'error', message: err.message || 'Błąd inicjacji pobierania.' });
      showError('Nie udało się rozpocząć pobierania.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Import ──────────────────────────────────────────────────────────

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
    } else {
      setImportStatus({ type: 'error', message: result.error || 'Nie udało się przywrócić bazy danych.' });
      showError(result.error || 'Błąd importu.');
    }
  };

  return (
    <div className="admin-backup">
      <h1 className="admin-backup__title">Kopia zapasowa</h1>
      <p className="admin-backup__subtitle">
        Twórz i przywracaj zaszyfrowane kopie zapasowe bazy danych.
      </p>

      {/* ── Export section ──────────────────────────────────────────── */}
      <section className="admin-backup__section">
        <h2 className="admin-backup__section-title">
          📦 Eksport bazy danych
        </h2>
        <p className="admin-backup__section-desc">
          Pobierz zaszyfrowaną kopię zapasową całej bazy danych.
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

      {/* ── Import section ──────────────────────────────────────────── */}
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
