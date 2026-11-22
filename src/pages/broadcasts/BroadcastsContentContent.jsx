/**
 * @file BroadcastsContentContent.jsx
 * @description Zreworkowany komponent zarządzania masowymi powiadomieniami oraz przerwą techniczną.
 */

import { useState, useEffect, useCallback } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import Divider from '../../components/ui/Divider/Divider.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { getApiBaseUrl } from '../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../auth/browserIdStorage.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import { publicIconPath } from '../../utils/publicAssetUrl.js';
import './BroadcastsContentContent.css';

const PAGESIZE = 10;

const editicon = publicIconPath('edit-02-svgrepo-com.svg');
const deleteicon = publicIconPath('trash-01-svgrepo-com.svg');
const nextpageicon = publicIconPath('chevron-right-svgrepo-com.svg');
const previouspageicon = publicIconPath('chevron-left-svgrepo-com.svg');
const firstpageicon = publicIconPath('chevron-left-double-svgrepo-com.svg');
const lastpageicon = publicIconPath('chevron-right-double-svgrepo-com.svg');

const COPY = {
  polish: {
    pageTitle: 'Centrum komunikatów i przerwy technicznej',
    broadcastsTitle: 'Masowe powiadomienia',
    broadcastsDesc: 'Twórz i publikuj ogłoszenia rozsyłane do wybranych grup użytkowników platformy.',
    newBroadcast: 'Dodaj ogłoszenie',
    emptyBroadcasts: 'Brak aktywnych ogłoszeń w systemie.',
    editBroadcast: 'Edytuj ogłoszenie',
    createBroadcast: 'Nowe ogłoszenie',
    titleLabel: 'Tytuł ogłoszenia',
    contentLabel: 'Treść ogłoszenia',
    typeLabel: 'Typ ogłoszenia',
    typeInfo: 'Informacja',
    typeWarning: 'Ostrzeżenie',
    typeCritical: 'Krytyczne ostrzeżenie',
    recipientsLabel: 'Użytkownicy docelowi',
    roleAll: 'Wszyscy użytkownicy',
    roleStudent: 'Osoby studiujące',
    roleLecturer: 'Osoby prowadzące',
    roleAdmin: 'Osoby administrujące',
    expiryLabel: 'Data wygaśnięcia',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    confirm: 'Potwierdź',
    maintenanceTitle: 'Przerwa techniczna',
    maintenanceDesc: 'Zarządzanie globalną blokadą dostępu do systemu na czas planowanych prac technicznych.',
    maintenanceActive: 'Przerwa techniczna jest aktywna',
    maintenanceInactive: 'Przerwa techniczna jest wyłączona',
    enableMaintenance: 'Włącz przerwę techniczną',
    disableMaintenance: 'Wyłącz przerwę techniczną',
    maintenanceMessage: 'Komunikat wyświetlany użytkownikom',
    maintenanceEnd: 'Szacowany koniec przerwy technicznej',
    systemStatus: 'Bieżący stan systemu',
    serverTime: 'Czas serwera',
    lastUpdate: 'Ostatnia aktualizacja',
    deleteConfirmTitle: 'Potwierdzenie usunięcia ogłoszenia',
    deleteConfirmText: 'Czy na pewno chcesz usunąć ogłoszenie: ',
    maintenanceConfirmTitle: 'Kontrola przerwy technicznej',
    maintenanceEnableConfirmText: 'Czy na pewno włączyć tryb prac technicznych? Uniemożliwi to korzystanie z platformy użytkownikom bez uprawnień nadzorcy.',
    maintenanceDisableConfirmText: 'Czy na pewno wyłączyć tryb prac technicznych i przywrócić pełen dostęp do platformy?',
  },
  english: {
    pageTitle: 'Broadcasts & Maintenance',
    broadcastsTitle: 'Broadcast messages',
    broadcastsDesc: 'Create and publish global notices sent to selected user groups.',
    newBroadcast: 'Add broadcast',
    emptyBroadcasts: 'No broadcast messages found.',
    editBroadcast: 'Edit broadcast',
    createBroadcast: 'New broadcast',
    titleLabel: 'Broadcast title',
    contentLabel: 'Broadcast content',
    typeLabel: 'Broadcast type',
    typeInfo: 'Information',
    typeWarning: 'Warning',
    typeCritical: 'Critical warning',
    recipientsLabel: 'Target recipients',
    roleAll: 'All users',
    roleStudent: 'Students',
    roleLecturer: 'Lecturers',
    roleAdmin: 'Administrators',
    expiryLabel: 'Expiry date',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    maintenanceTitle: 'Maintenance mode',
    maintenanceDesc: 'Manage global system lockout during planned maintenance.',
    maintenanceActive: 'Maintenance mode is active',
    maintenanceInactive: 'Maintenance mode is inactive',
    enableMaintenance: 'Enable maintenance mode',
    disableMaintenance: 'Disable maintenance mode',
    maintenanceMessage: 'Notice displayed to users',
    maintenanceEnd: 'Estimated end of maintenance',
    systemStatus: 'Current system status',
    serverTime: 'Server time',
    lastUpdate: 'Last update',
    deleteConfirmTitle: 'Confirm broadcast deletion',
    deleteConfirmText: 'Are you sure you want to delete broadcast: ',
    maintenanceConfirmTitle: 'Maintenance control',
    maintenanceEnableConfirmText: 'Are you sure you want to enable maintenance mode? This will lock access for non-superadmin users.',
    maintenanceDisableConfirmText: 'Are you sure you want to disable maintenance mode and restore full access?',
  },
};

function formatIsoExpiration(expiresAt) {
  if (!expiresAt) return 'Brak terminu';
  try {
    const d = new Date(expiresAt);
    return `Wygasa: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return `Wygasa: ${expiresAt}`;
  }
}

export default function BroadcastsContentContent() {
  const language = READLANGUAGECOOKIE();
  const copy = COPY[language] ?? COPY.polish;
  const { showSuccess, showError } = useToast();

  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastsTotal, setBroadcastsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Status przerwy technicznej
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [maintenanceEndDate, setMaintenanceEndDate] = useState('');
  const [maintenanceEndTime, setMaintenanceEndTime] = useState('');
  const [systemUpdatedAt, setSystemUpdatedAt] = useState('');
  const [systemServerTime, setSystemServerTime] = useState('');

  // Modale
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create'); // 'create' | 'edit'
  const [editorId, setEditorId] = useState(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorLevel, setEditorLevel] = useState('info');
  const [editorRoles, setEditorRoles] = useState({ all: true, student: false, lecturer: false, admin: false });
  const [editorExpiryDate, setEditorExpiryDate] = useState('');
  const [editorExpiryTime, setEditorExpiryTime] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState(null);

  const [maintenanceConfirmOpen, setMaintenanceConfirmOpen] = useState(false);

  // Pobieranie ogłoszeń
  const fetchBroadcasts = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const skip = currentPage * PAGESIZE;
      const res = await fetch(`${base}/admin/broadcasts?take=${PAGESIZE}&skip=${skip}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserId },
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({ items: [], total: 0 }));
        setBroadcasts(Array.isArray(data.items) ? data.items : []);
        setBroadcastsTotal(data.total ?? 0);
      }
    } catch {
      // Ignoruj błędy sieciowe przy odpytywaniu
    }
  }, [currentPage]);

  // Pobieranie konfiguracji maintenance
  const fetchMaintenance = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const res = await fetch(`${base}/admin/maintenance`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserId },
      });
      if (res.ok) {
        const data = await res.json();
        setMaintenanceEnabled(data.isEnabled === true);
        setMaintenanceMessage(data.message || '');
        if (data.estimatedEndAt) {
          const parts = data.estimatedEndAt.split('T');
          setMaintenanceEndDate(parts[0] || '');
          if (parts[1]) setMaintenanceEndTime(parts[1].slice(0, 5));
        }
      }
    } catch {
      // Błąd pobrania
    }
  }, []);

  // Pobieranie system status
  const fetchSystemStatus = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const res = await fetch(`${base}/system/status`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserId },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.maintenance?.updatedAt) {
          setSystemUpdatedAt(new Date(data.maintenance.updatedAt).toLocaleString());
        }
        if (data.serverTime) {
          setSystemServerTime(new Date(data.serverTime).toLocaleString());
        }
      }
    } catch {
      // Ignoruj
    }
  }, []);

  useEffect(() => {
    fetchBroadcasts();
    fetchMaintenance();
    fetchSystemStatus();
  }, [fetchBroadcasts, fetchMaintenance, fetchSystemStatus]);

  // Zapis ogłoszenia
  async function handleSaveBroadcast() {
    if (!editorTitle.trim() || !editorContent.trim()) {
      showError('Podaj tytuł i treść ogłoszenia.');
      return;
    }

    let roles = [];
    if (editorRoles.all) {
      roles = ['all'];
    } else {
      if (editorRoles.student) roles.push('student');
      if (editorRoles.lecturer) roles.push('lecturer');
      if (editorRoles.admin) roles.push('admin');
    }
    if (roles.length === 0) roles = ['all'];

    let expiresAt = null;
    if (editorExpiryDate) {
      const time = editorExpiryTime ? `${editorExpiryTime}:00` : '23:59:59';
      expiresAt = `${editorExpiryDate}T${time}.000Z`;
    }

    const base = getApiBaseUrl();
    const browserId = getOrCreateBrowserId();

    try {
      if (editorMode === 'edit' && editorId) {
        // Usuń stare przed utworzeniem nowego (zgodnie z logiką backendu)
        await fetch(`${base}/admin/broadcasts/${editorId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserId },
        });
      }

      for (const role of roles) {
        await fetch(`${base}/admin/broadcasts`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserId },
          body: JSON.stringify({
            title: editorTitle.trim(),
            content: editorContent.trim(),
            level: editorLevel,
            targetRole: role,
            expiresAt,
          }),
        });
      }

      showSuccess(editorMode === 'edit' ? 'Ogłoszenie zaktualizowane.' : 'Ogłoszenie zostało utworzone.');
      setEditorOpen(false);
      fetchBroadcasts();
    } catch {
      showError('Nie udało się zapisać ogłoszenia.');
    }
  }

  // Usunięcie ogłoszenia
  async function handleDeleteBroadcast() {
    if (!broadcastToDelete) return;
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const res = await fetch(`${base}/admin/broadcasts/${broadcastToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserId },
      });
      if (res.ok) {
        showSuccess('Ogłoszenie zostało usunięte.');
      }
      setDeleteConfirmOpen(false);
      setBroadcastToDelete(null);
      fetchBroadcasts();
    } catch {
      showError('Nie udało się usunąć ogłoszenia.');
    }
  }

  // Zapis trybu przerwy technicznej
  async function handleSaveMaintenance(enabledState) {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      let estimatedEndAt = null;
      if (maintenanceEndDate) {
        const time = maintenanceEndTime ? `${maintenanceEndTime}:00` : '00:00:00';
        estimatedEndAt = `${maintenanceEndDate}T${time}.000Z`;
      }

      const res = await fetch(`${base}/admin/maintenance`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserId },
        body: JSON.stringify({
          isEnabled: enabledState,
          message: maintenanceMessage,
          estimatedEndAt,
        }),
      });

      if (res.ok) {
        showSuccess(enabledState ? 'Przerwa techniczna została włączona.' : 'Przerwa techniczna została wyłączona.');
        setMaintenanceEnabled(enabledState);
        setMaintenanceConfirmOpen(false);
        fetchMaintenance();
        fetchSystemStatus();
      } else {
        const data = await res.json().catch(() => null);
        showError(data?.message || 'Nie udało się zapisać przerwy technicznej.');
      }
    } catch {
      showError('Wystąpił błąd podczas zapisywania przerwy technicznej.');
    }
  }

  function openCreateModal() {
    setEditorMode('create');
    setEditorId(null);
    setEditorTitle('');
    setEditorContent('');
    setEditorLevel('info');
    setEditorRoles({ all: true, student: false, lecturer: false, admin: false });
    setEditorExpiryDate('');
    setEditorExpiryTime('');
    setEditorOpen(true);
  }

  function openEditModal(broadcast) {
    setEditorMode('edit');
    setEditorId(broadcast.id);
    setEditorTitle(broadcast.title || '');
    setEditorContent(broadcast.content || '');
    setEditorLevel(broadcast.level || 'info');
    setEditorRoles({
      all: broadcast.targetRole === 'all',
      student: broadcast.targetRole === 'student',
      lecturer: broadcast.targetRole === 'lecturer',
      admin: broadcast.targetRole === 'admin',
    });
    if (broadcast.expiresAt) {
      const parts = broadcast.expiresAt.split('T');
      setEditorExpiryDate(parts[0] || '');
      if (parts[1]) setEditorExpiryTime(parts[1].slice(0, 5));
    } else {
      setEditorExpiryDate('');
      setEditorExpiryTime('');
    }
    setEditorOpen(true);
  }

  const maxPages = Math.max(1, Math.ceil(broadcastsTotal / PAGESIZE));

  return (
    <AppSectionPage title={copy.pageTitle}>
      <div className="broadcasts-page">
        {/* SEKCJA 1: MASOWE POWIADOMIENIA */}
        <section className="broadcasts-page__section">
          <div className="broadcasts-page__header-row">
            <div>
              <h2 className="broadcasts-page__section-title">{copy.broadcastsTitle}</h2>
              <p className="broadcasts-page__section-desc">{copy.broadcastsDesc}</p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={openCreateModal}
              title="Otwiera okno tworzenia nowego ogłoszenia dla użytkowników"
            >
              {copy.newBroadcast}
            </Button>
          </div>

          {broadcasts.length === 0 ? (
            <div className="org-management__empty">
              <p>{copy.emptyBroadcasts}</p>
            </div>
          ) : (
            <div className="broadcasts-list">
              {broadcasts.map((b) => (
                <article key={b.id} className={`broadcast-card broadcast-card--${b.level}`}>
                  <div className="broadcast-card__body">
                    <div className="broadcast-card__top">
                      <h3 className="broadcast-card__title">{b.title}</h3>
                      <span className="broadcast-card__expires">{formatIsoExpiration(b.expiresAt)}</span>
                    </div>

                    <div className="broadcast-card__tags">
                      <span className={`broadcast-card__tag broadcast-card__tag--${b.level}`}>
                        {b.level === 'critical' ? copy.typeCritical : b.level === 'warning' ? copy.typeWarning : copy.typeInfo}
                      </span>
                      <span className="broadcast-card__tag">
                        Rola: {b.targetRole === 'all' ? copy.roleAll : b.targetRole}
                      </span>
                    </div>

                    <p className="broadcast-card__content">{b.content}</p>
                  </div>

                  <div className="broadcast-card__actions">
                    <button
                      type="button"
                      className="broadcast-card__action-btn"
                      onClick={() => openEditModal(b)}
                      title="Edytuj treść lub parametry tego ogłoszenia"
                      aria-label="Edytuj ogłoszenie"
                    >
                      <img src={editicon} alt="" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="broadcast-card__action-btn broadcast-card__action-btn--delete"
                      onClick={() => {
                        setBroadcastToDelete(b);
                        setDeleteConfirmOpen(true);
                      }}
                      title="Usuń trwale to ogłoszenie z systemu"
                      aria-label="Usuń ogłoszenie"
                    >
                      <img src={deleteicon} alt="" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}

              {/* Paginacja */}
              {maxPages > 1 ? (
                <div className="broadcasts-pagination">
                  <button
                    type="button"
                    className="broadcasts-pagination__btn"
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0}
                    title="Przejdź do pierwszej strony"
                    aria-label="Pierwsza strona"
                  >
                    <img src={firstpageicon} alt="" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="broadcasts-pagination__btn"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    title="Poprzednia strona"
                    aria-label="Poprzednia strona"
                  >
                    <img src={previouspageicon} alt="" aria-hidden="true" />
                  </button>
                  <span className="broadcasts-pagination__current">
                    {currentPage + 1} / {maxPages}
                  </span>
                  <button
                    type="button"
                    className="broadcasts-pagination__btn"
                    onClick={() => setCurrentPage((p) => Math.min(maxPages - 1, p + 1))}
                    disabled={currentPage >= maxPages - 1}
                    title="Następna strona"
                    aria-label="Następna strona"
                  >
                    <img src={nextpageicon} alt="" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="broadcasts-pagination__btn"
                    onClick={() => setCurrentPage(maxPages - 1)}
                    disabled={currentPage >= maxPages - 1}
                    title="Przejdź do ostatniej strony"
                    aria-label="Ostatnia strona"
                  >
                    <img src={lastpageicon} alt="" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>

        <Divider />

        {/* SEKCJA 2: PRZERWA TECHNICZNA */}
        <section className="broadcasts-page__section">
          <div>
            <h2 className="broadcasts-page__section-title">{copy.maintenanceTitle}</h2>
            <p className="broadcasts-page__section-desc">{copy.maintenanceDesc}</p>
          </div>

          <div className="maintenance-card">
            <div className="maintenance-card__toggle-row">
              <div className="maintenance-card__status-indicator">
                <span className={`maintenance-dot ${maintenanceEnabled ? 'maintenance-dot--active' : 'maintenance-dot--inactive'}`} />
                <span>{maintenanceEnabled ? copy.maintenanceActive : copy.maintenanceInactive}</span>
              </div>

              <Button
                variant={maintenanceEnabled ? 'danger' : 'primary'}
                size="md"
                onClick={() => setMaintenanceConfirmOpen(true)}
                title={maintenanceEnabled ? 'Wyłącza blokadę platformy i przywraca normalny dostęp' : 'Blokuje dostęp do platformy dla wszystkich poza nadzorcą'}
              >
                {maintenanceEnabled ? copy.disableMaintenance : copy.enableMaintenance}
              </Button>
            </div>

            <div className="maintenance-card__form-grid">
              <div className="maintenance-card__field">
                <label className="maintenance-card__label" htmlFor="maintenance-msg">
                  {copy.maintenanceMessage}
                </label>
                <textarea
                  id="maintenance-msg"
                  className="maintenance-card__textarea"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="np. Trwają planowane prace serwisowe. Zapraszamy wkrótce."
                />
              </div>

              <div className="maintenance-card__field">
                <label className="maintenance-card__label" htmlFor="maintenance-end-date">
                  {copy.maintenanceEnd}
                </label>
                <div className="maintenance-card__datetime-row">
                  <input
                    id="maintenance-end-date"
                    type="date"
                    className="maintenance-card__input"
                    value={maintenanceEndDate}
                    onChange={(e) => setMaintenanceEndDate(e.target.value)}
                    title="Wybierz datę zakończenia prac serwisowych"
                  />
                  <input
                    id="maintenance-end-time"
                    type="time"
                    className="maintenance-card__input"
                    value={maintenanceEndTime}
                    onChange={(e) => setMaintenanceEndTime(e.target.value)}
                    title="Wybierz godzinę zakończenia prac serwisowych"
                  />
                </div>
              </div>
            </div>

            <div className="maintenance-card__actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSaveMaintenance(maintenanceEnabled)}
                title="Zapisuje zmieniony komunikat lub przewidywaną datę zakończenia"
              >
                {copy.save}
              </Button>
            </div>

            {/* Informacje o stanie */}
            <div className="maintenance-status-box">
              <div className="maintenance-status-box__item">
                <span>{copy.lastUpdate}:</span>
                <strong>{systemUpdatedAt || '-'}</strong>
              </div>
              <div className="maintenance-status-box__item">
                <span>{copy.serverTime}:</span>
                <strong>{systemServerTime || '-'}</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* MODAL: Tworzenie / Edycja ogłoszenia */}
      <Modal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editorMode === 'edit' ? copy.editBroadcast : copy.createBroadcast}
        size="md"
        showFooter={false}
      >
        <form className="broadcast-form-modal" onSubmit={(e) => { e.preventDefault(); handleSaveBroadcast(); }}>
          <TextField
            id="broadcast-title"
            label={
              <span>
                {copy.titleLabel} <span className="org-form__required">*</span>
              </span>
            }
            placeholder="np. Przerwa serwisowa w niedzielę"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            required
          />

          <TextField
            id="broadcast-content"
            label={
              <span>
                {copy.contentLabel} <span className="org-form__required">*</span>
              </span>
            }
            placeholder="Wpisz treść komunikatu dla użytkowników..."
            multiline
            rows={4}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            required
          />

          <div className="maintenance-card__field">
            <span className="maintenance-card__label">
              {copy.typeLabel} <span className="org-form__required">*</span>
            </span>
            <div className="broadcast-form-modal__options-grid">
              <label className="broadcast-form-modal__option-label">
                <input
                  type="radio"
                  name="broadcast-level"
                  checked={editorLevel === 'info'}
                  onChange={() => setEditorLevel('info')}
                />
                <span>{copy.typeInfo}</span>
              </label>
              <label className="broadcast-form-modal__option-label">
                <input
                  type="radio"
                  name="broadcast-level"
                  checked={editorLevel === 'warning'}
                  onChange={() => setEditorLevel('warning')}
                />
                <span>{copy.typeWarning}</span>
              </label>
              <label className="broadcast-form-modal__option-label">
                <input
                  type="radio"
                  name="broadcast-level"
                  checked={editorLevel === 'critical'}
                  onChange={() => setEditorLevel('critical')}
                />
                <span>{copy.typeCritical}</span>
              </label>
            </div>
          </div>

          <div className="maintenance-card__field">
            <span className="maintenance-card__label">
              {copy.recipientsLabel} <span className="org-form__required">*</span>
            </span>
            <div className="broadcast-form-modal__options-grid">
              <label className="broadcast-form-modal__option-label">
                <input
                  type="checkbox"
                  checked={editorRoles.all}
                  onChange={(e) =>
                    setEditorRoles({ all: e.target.checked, student: false, lecturer: false, admin: false })
                  }
                />
                <span>{copy.roleAll}</span>
              </label>
              <label className="broadcast-form-modal__option-label">
                <input
                  type="checkbox"
                  checked={!editorRoles.all && editorRoles.student}
                  onChange={(e) =>
                    setEditorRoles((prev) => ({ ...prev, all: false, student: e.target.checked }))
                  }
                />
                <span>{copy.roleStudent}</span>
              </label>
              <label className="broadcast-form-modal__option-label">
                <input
                  type="checkbox"
                  checked={!editorRoles.all && editorRoles.lecturer}
                  onChange={(e) =>
                    setEditorRoles((prev) => ({ ...prev, all: false, lecturer: e.target.checked }))
                  }
                />
                <span>{copy.roleLecturer}</span>
              </label>
              <label className="broadcast-form-modal__option-label">
                <input
                  type="checkbox"
                  checked={!editorRoles.all && editorRoles.admin}
                  onChange={(e) =>
                    setEditorRoles((prev) => ({ ...prev, all: false, admin: e.target.checked }))
                  }
                />
                <span>{copy.roleAdmin}</span>
              </label>
            </div>
          </div>

          <div className="maintenance-card__field">
            <span className="maintenance-card__label">{copy.expiryLabel}</span>
            <div className="maintenance-card__datetime-row">
              <input
                type="date"
                className="maintenance-card__input"
                value={editorExpiryDate}
                onChange={(e) => setEditorExpiryDate(e.target.value)}
                title="Wybierz opcjonalną datę wygaśnięcia ogłoszenia"
              />
              <input
                type="time"
                className="maintenance-card__input"
                value={editorExpiryTime}
                onChange={(e) => setEditorExpiryTime(e.target.value)}
                title="Wybierz opcjonalną godzinę wygaśnięcia ogłoszenia"
              />
            </div>
          </div>

          <div className="user-management__modal-actions">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setEditorOpen(false)}
              title="Zamknij okno bez zapisywania zmian"
            >
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              title="Zapisz ogłoszenie i opublikuj dla wybranych odbiorców"
            >
              {copy.save}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Potwierdzenie usunięcia ogłoszenia */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title={copy.deleteConfirmTitle}
        size="sm"
        showFooter={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary, #9ca3af)', lineHeight: 1.45 }}>
            {copy.deleteConfirmText}
            <strong style={{ color: 'var(--color-text-primary, #ffffff)' }}>
              {broadcastToDelete?.title}
            </strong>
            ? Tej operacji nie można cofnąć.
          </p>
          <div className="user-management__modal-actions">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setDeleteConfirmOpen(false)}
              title="Anuluj usuwanie ogłoszenia"
            >
              {copy.cancel}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDeleteBroadcast}
              title="Potwierdź trwałe usunięcie tego ogłoszenia"
            >
              {copy.delete}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Potwierdzenie włączenia/wyłączenia przerwy technicznej */}
      <Modal
        isOpen={maintenanceConfirmOpen}
        onClose={() => setMaintenanceConfirmOpen(false)}
        title={copy.maintenanceConfirmTitle}
        size="sm"
        showFooter={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary, #9ca3af)', lineHeight: 1.45 }}>
            {maintenanceEnabled
              ? copy.maintenanceDisableConfirmText
              : copy.maintenanceEnableConfirmText}
          </p>
          <div className="user-management__modal-actions">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setMaintenanceConfirmOpen(false)}
              title="Anuluj zmianę stanu przerwy technicznej"
            >
              {copy.cancel}
            </Button>
            <Button
              variant={maintenanceEnabled ? 'primary' : 'danger'}
              size="md"
              onClick={() => handleSaveMaintenance(!maintenanceEnabled)}
              title="Potwierdź zmianę trybu przerwy technicznej"
            >
              {copy.confirm}
            </Button>
          </div>
        </div>
      </Modal>
    </AppSectionPage>
  );
}
