/**
 * @file DocumentsContentContent.jsx
 * @description Zreworkowany komponent zarządzania dokumentami prawnymi i historią zmian (patch notes).
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import Divider from '../../components/ui/Divider/Divider.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { getApiBaseUrl } from '../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../auth/browserIdStorage.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import { publicIconPath } from '../../utils/publicAssetUrl.js';
import './DocumentsContentContent.css';

const PAGESIZE = 10;

const editicon = publicIconPath('edit-02-svgrepo-com.svg');
const deleteicon = publicIconPath('trash-01-svgrepo-com.svg');
const viewicon = publicIconPath('file-04-svgrepo-com.svg');
const downloadicon = publicIconPath('file-download-03-svgrepo-com.svg');
const addfileicon = publicIconPath('file-plus-03-svgrepo-com.svg');
const fileaddedicon = publicIconPath('file-check-03-svgrepo-com.svg');
const nextpageicon = publicIconPath('chevron-right-svgrepo-com.svg');
const previouspageicon = publicIconPath('chevron-left-svgrepo-com.svg');
const firstpageicon = publicIconPath('chevron-left-double-svgrepo-com.svg');
const lastpageicon = publicIconPath('chevron-right-double-svgrepo-com.svg');

const COPY = {
  polish: {
    pageTitle: 'Manager dokumentacji i wydań',
    docsSectionTitle: 'Dokumentacja prawna i regulaminy',
    docsSectionDesc: 'Zarządzanie oficjalnymi plikami PDF (regulaminy, polityka prywatności, dokumentacja) dostępnymi w systemie.',
    patchnotesSectionTitle: 'Historia zmian (Patch notes)',
    patchnotesSectionDesc: 'Publikowanie i wersjonowanie dokumentów historii zmian systemu dostępnych dla użytkowników.',
    addPatchNote: 'Dodaj dokument zmian',
    termsOfUse: 'Warunki użytkowania (Regulamin)',
    privacyPolicy: 'Polityka prywatności',
    documentation: 'Dokumentacja techniczna',
    notUploaded: 'Dokument nie został przesłany',
    emptyValue: '- - -',
    pdfFileLabel: 'Plik PDF (maksymalny rozmiar 20 MB)',
    selectPdfHint: 'Kliknij, aby wybrać plik PDF z dysku',
    fileNameLabel: 'Nazwa pliku',
    fileSizeLabel: 'Rozmiar pliku',
    fileDateLabel: 'Data przesłania',
    save: 'Zapisz',
    upload: 'Wgraj plik',
    cancel: 'Anuluj',
    delete: 'Usuń',
    confirm: 'Potwierdź',
    close: 'Zamknij',
    titleLabel: 'Tytuł dokumentu',
    versionLabel: 'Wersja (np. 1.0.0)',
    titlePlaceholder: 'np. Wydanie 1.4.0',
    versionPlaceholder: 'np. 1.4.0',
    deleteDocTitle: 'Potwierdzenie usunięcia dokumentu',
    deleteDocDesc: 'Czy na pewno chcesz usunąć ten plik PDF? Operacji nie można cofnąć.',
    deletePatchNoteTitle: 'Potwierdzenie usunięcia dokumentu zmian',
    deletePatchNoteDesc: 'Czy na pewno chcesz usunąć ten wpis historii zmian? Operacji nie można cofnąć.',
    docSavedSuccess: 'Dokument został pomyślnie zaktualizowany.',
    docDeletedSuccess: 'Dokument został usunięty.',
    patchNoteSavedSuccess: 'Dokument zmian został opublikowany.',
    patchNoteDeletedSuccess: 'Dokument zmian został usunięty.',
    loading: 'Ładowanie dokumentów...',
    emptyPatchNotes: 'Brak wpisów historii zmian.',
    viewFileTooltip: 'Otwórz i wyświetl plik PDF w nowej karcie',
    downloadFileTooltip: 'Pobierz plik PDF na dysk',
    editFileTooltip: 'Wgraj nową wersję pliku PDF',
    deleteFileTooltip: 'Usuń plik z serwera',
    addPatchNoteTooltip: 'Dodaj nowy plik PDF z listą zmian dla danego wydania',
    firstPageTooltip: 'Przejdź do pierwszej strony',
    prevPageTooltip: 'Przejdź do poprzedniej strony',
    nextPageTooltip: 'Przejdź do następnej strony',
    lastPageTooltip: 'Przejdź do ostatniej strony',
  },
  english: {
    pageTitle: 'Documentation & Releases Manager',
    docsSectionTitle: 'Legal documents & regulations',
    docsSectionDesc: 'Manage official PDF files (terms of use, privacy policy, documentation) in the system.',
    patchnotesSectionTitle: 'Patch notes',
    patchnotesSectionDesc: 'Publish and version change log documents available to users.',
    addPatchNote: 'Add patch note',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    documentation: 'Documentation',
    notUploaded: 'Document not uploaded',
    emptyValue: '- - -',
    pdfFileLabel: 'PDF file (max. 20 MB)',
    selectPdfHint: 'Click to select a PDF file from your computer',
    fileNameLabel: 'File name',
    fileSizeLabel: 'File size',
    fileDateLabel: 'Upload date',
    save: 'Save',
    upload: 'Upload file',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
    titleLabel: 'Document title',
    versionLabel: 'Version (e.g. 1.0.0)',
    titlePlaceholder: 'e.g. Release 1.4.0',
    versionPlaceholder: 'e.g. 1.4.0',
    deleteDocTitle: 'Confirm document deletion',
    deleteDocDesc: 'Are you sure you want to delete this PDF file? This action cannot be undone.',
    deletePatchNoteTitle: 'Confirm patch note deletion',
    deletePatchNoteDesc: 'Are you sure you want to delete this patch note? This action cannot be undone.',
    docSavedSuccess: 'Document has been uploaded successfully.',
    docDeletedSuccess: 'Document has been deleted.',
    patchNoteSavedSuccess: 'Patch note has been published.',
    patchNoteDeletedSuccess: 'Patch note has been deleted.',
    loading: 'Loading documents...',
    emptyPatchNotes: 'No patch notes found.',
    viewFileTooltip: 'View PDF file in a new tab',
    downloadFileTooltip: 'Download PDF file to your computer',
    editFileTooltip: 'Upload a new version of this PDF file',
    deleteFileTooltip: 'Delete file from the server',
    addPatchNoteTooltip: 'Add a new PDF changelog document for a release',
    firstPageTooltip: 'Go to first page',
    prevPageTooltip: 'Go to previous page',
    nextPageTooltip: 'Go to next page',
    lastPageTooltip: 'Go to last page',
  },
};

function formatDate(data) {
  if (!data) return '';
  const date = new Date(data);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatFileSize(bytes) {
  if (bytes == null || isNaN(bytes)) return '- - -';
  const kilobytes = Math.floor(bytes / 1024);
  if (kilobytes < 1) return `${bytes} B`;
  return `${kilobytes} kB`;
}

export default function DocumentsContentContent() {
  const { showSuccess, showError } = useToast();
  const language = READLANGUAGECOOKIE();
  const copy = COPY[language] ?? COPY.polish;

  // Dokumenty prawne
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Modal edycji / wgrywania dokumentu
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorKey, setEditorKey] = useState('');
  const [editorTitle, setEditorTitle] = useState('');
  const [editorFile, setEditorFile] = useState(null);
  const [editorFilename, setEditorFilename] = useState('');
  const [editorFilesize, setEditorFilesize] = useState('');
  const [editorFiledate, setEditorFiledate] = useState('');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Potwierdzenie usunięcia dokumentu
  const [deleteDocKey, setDeleteDocKey] = useState(null);

  // Patch notes
  const [patchnotes, setPatchnotes] = useState([]);
  const [patchnotesTotal, setPatchnotesTotal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loadingPatchNotes, setLoadingPatchNotes] = useState(true);

  // Modal tworzenia patch note
  const [patchNoteModalOpen, setPatchNoteModalOpen] = useState(false);
  const [patchNoteTitle, setPatchNoteTitle] = useState('');
  const [patchNoteVersion, setPatchNoteVersion] = useState('');
  const [patchNoteFile, setPatchNoteFile] = useState(null);
  const [isSubmittingPatchNote, setIsSubmittingPatchNote] = useState(false);

  // Potwierdzenie usunięcia patch note
  const [deletePatchNoteId, setDeletePatchNoteId] = useState(null);

  const getDocName = useCallback(
    (key) => {
      if (key === 'termsOfUse') return copy.termsOfUse;
      if (key === 'privacyPolicy') return copy.privacyPolicy;
      if (key === 'documentation') return copy.documentation;
      return key;
    },
    [copy]
  );

  // Pobieranie dokumentów prawnych
  const fetchDocuments = useCallback(async () => {
    try {
      setLoadingDocs(true);
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const res = await fetch(`${base}/admin/documents`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });
      if (!res.ok) throw new Error('Błąd pobierania dokumentów');
      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      setDocuments(items);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się pobrać dokumentów.');
    } finally {
      setLoadingDocs(false);
    }
  }, [showError]);

  // Pobieranie wpisów patch notes
  const fetchPatchNotes = useCallback(async () => {
    try {
      setLoadingPatchNotes(true);
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const skip = currentPageIndex * PAGESIZE;
      const res = await fetch(`${base}/admin/patch-notes?take=${PAGESIZE}&skip=${skip}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });
      if (!res.ok) throw new Error('Błąd pobierania historii zmian');
      const data = await res.json();
      setPatchnotes(Array.isArray(data?.items) ? data.items : []);
      setPatchnotesTotal(data?.total ?? 0);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się pobrać historii zmian.');
    } finally {
      setLoadingPatchNotes(false);
    }
  }, [currentPageIndex, showError]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchPatchNotes();
  }, [fetchPatchNotes]);

  // Akcje dla dokumentu prawnego
  const handleOpenDocFile = (doc) => {
    const base = getApiBaseUrl();
    window.open(`${base}/documents/${doc.key}/file`, '_blank');
  };

  const handleDownloadDocFile = (doc) => {
    const base = getApiBaseUrl();
    window.open(`${base}/documents/${doc.key}/file?download=1`, '_blank');
  };

  const handleOpenEditDoc = async (doc) => {
    setEditorKey(doc.key);
    setEditorTitle(getDocName(doc.key));
    setEditorFile(null);
    setEditorFilename(doc.originalFilename || (doc.isUploaded ? doc.key : copy.notUploaded));
    setEditorFilesize(doc.isUploaded ? formatFileSize(doc.fileSizeBytes) : copy.emptyValue);
    setEditorFiledate(doc.isUploaded ? formatDate(doc.uploadedAt) : copy.emptyValue);
    setEditorOpen(true);
  };

  const handleDocFileChosen = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setEditorFile(file);
    setEditorFilename(file.name);
    setEditorFilesize(formatFileSize(file.size));
    setEditorFiledate(formatDate(new Date()));
  };

  const handleSaveDoc = async () => {
    if (!editorFile) {
      setEditorOpen(false);
      return;
    }
    try {
      setIsSubmittingDoc(true);
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const formdata = new FormData();
      formdata.append('file', editorFile);

      const res = await fetch(`${base}/admin/documents/${editorKey}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'X-Browser-ID': browserId },
        body: formdata,
      });

      if (!res.ok) throw new Error('Nie udało się wgrać dokumentu');
      showSuccess(copy.docSavedSuccess);
      setEditorOpen(false);
      await fetchDocuments();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Wystąpił błąd podczas wgrywania pliku.');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleDeleteDoc = async () => {
    if (!deleteDocKey) return;
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const res = await fetch(`${base}/admin/documents/${deleteDocKey}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });
      if (!res.ok) throw new Error('Nie udało się usunąć dokumentu');
      showSuccess(copy.docDeletedSuccess);
      setDeleteDocKey(null);
      await fetchDocuments();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd podczas usuwania dokumentu.');
    }
  };

  // Akcje dla patch notes
  const handleOpenPatchNoteFile = (item) => {
    const base = getApiBaseUrl();
    window.open(`${base}/patch-notes/${item.id}/file`, '_blank');
  };

  const handleDownloadPatchNoteFile = (item) => {
    const base = getApiBaseUrl();
    window.open(`${base}/patch-notes/${item.id}/file?download=1`, '_blank');
  };

  const handlePatchNoteFileChosen = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setPatchNoteFile(file);
    let title = file.name;
    if (title.toLowerCase().endsWith('.pdf')) {
      title = title.substring(0, title.length - 4);
    }
    setPatchNoteTitle(title);
  };

  const handleSavePatchNote = async () => {
    if (!patchNoteFile) {
      showError('Wybierz plik PDF.');
      return;
    }
    try {
      setIsSubmittingPatchNote(true);
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const formdata = new FormData();
      formdata.append('file', patchNoteFile);
      if (patchNoteTitle) formdata.append('title', patchNoteTitle);
      if (patchNoteVersion) formdata.append('version', patchNoteVersion);

      const res = await fetch(`${base}/admin/patch-notes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Browser-ID': browserId },
        body: formdata,
      });

      if (!res.ok) throw new Error('Nie udało się dodać dokumentu zmian');
      showSuccess(copy.patchNoteSavedSuccess);
      setPatchNoteModalOpen(false);
      setPatchNoteFile(null);
      setPatchNoteTitle('');
      setPatchNoteVersion('');
      await fetchPatchNotes();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd podczas tworzenia dokumentu zmian.');
    } finally {
      setIsSubmittingPatchNote(false);
    }
  };

  const handleDeletePatchNote = async () => {
    if (!deletePatchNoteId) return;
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const res = await fetch(`${base}/admin/patch-notes/${deletePatchNoteId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });
      if (!res.ok) throw new Error('Nie udało się usunąć dokumentu zmian');
      showSuccess(copy.patchNoteDeletedSuccess);
      setDeletePatchNoteId(null);
      await fetchPatchNotes();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd podczas usuwania wpisu.');
    }
  };

  // Paginacja
  const totalPages = Math.ceil(patchnotesTotal / PAGESIZE) || 1;
  const currentPageNumber = currentPageIndex + 1;

  return (
    <AppSectionPage title={copy.pageTitle}>
      <div className="documents-page">
        {/* SEKCJA 1: DOKUMENTACJA PRAWNA */}
        <section className="documents-section">
          <div className="documents-section__header">
            <h2 className="documents-section__title">{copy.docsSectionTitle}</h2>
            <p className="documents-section__description">{copy.docsSectionDesc}</p>
          </div>

          {loadingDocs && documents.length === 0 ? (
            <LoadingSpinner label={copy.loading} />
          ) : (
            <div className="documents-grid">
              {documents.map((doc) => {
                const isUploaded = Boolean(doc.isUploaded);
                return (
                  <div key={doc.key} className="document-card">
                    <div className="document-card__main">
                      <div className="document-card__top">
                        <span className="document-card__title">{getDocName(doc.key)}</span>
                        <span className="document-card__date">
                          {isUploaded ? formatDate(doc.uploadedAt) : copy.emptyValue}
                        </span>
                      </div>
                      <div className="document-card__meta">
                        <span className="document-card__badge">
                          {isUploaded ? formatFileSize(doc.fileSizeBytes) : copy.notUploaded}
                        </span>
                        {isUploaded && doc.originalFilename ? (
                          <span className="document-card__filename" title={doc.originalFilename}>
                            {doc.originalFilename}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="document-card__actions">
                      <button
                        type="button"
                        className="document-action-btn"
                        onClick={() => handleOpenDocFile(doc)}
                        disabled={!isUploaded}
                        title={copy.viewFileTooltip}
                        aria-label={copy.viewFileTooltip}
                      >
                        <img src={viewicon} alt="" />
                      </button>
                      <button
                        type="button"
                        className="document-action-btn"
                        onClick={() => handleDownloadDocFile(doc)}
                        disabled={!isUploaded}
                        title={copy.downloadFileTooltip}
                        aria-label={copy.downloadFileTooltip}
                      >
                        <img src={downloadicon} alt="" />
                      </button>
                      <button
                        type="button"
                        className="document-action-btn"
                        onClick={() => handleOpenEditDoc(doc)}
                        title={copy.editFileTooltip}
                        aria-label={copy.editFileTooltip}
                      >
                        <img src={editicon} alt="" />
                      </button>
                      <button
                        type="button"
                        className="document-action-btn document-action-btn--delete"
                        onClick={() => setDeleteDocKey(doc.key)}
                        disabled={!isUploaded}
                        title={copy.deleteFileTooltip}
                        aria-label={copy.deleteFileTooltip}
                      >
                        <img src={deleteicon} alt="" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <Divider />

        {/* SEKCJA 2: HISTORIA ZMIAN (PATCH NOTES) */}
        <section className="documents-section">
          <div className="documents-section__header">
            <h2 className="documents-section__title">{copy.patchnotesSectionTitle}</h2>
            <p className="documents-section__description">{copy.patchnotesSectionDesc}</p>
          </div>

          <div className="documents-section__toolbar">
            <Button
              variant="primary"
              onClick={() => {
                setPatchNoteFile(null);
                setPatchNoteTitle('');
                setPatchNoteVersion('');
                setPatchNoteModalOpen(true);
              }}
              title={copy.addPatchNoteTooltip}
            >
              {copy.addPatchNote}
            </Button>
          </div>

          {loadingPatchNotes && patchnotes.length === 0 ? (
            <LoadingSpinner label={copy.loading} />
          ) : patchnotes.length === 0 ? (
            <p className="documents-section__description">{copy.emptyPatchNotes}</p>
          ) : (
            <>
              <div className="documents-grid">
                {patchnotes.map((item) => (
                  <div key={item.id} className="document-card">
                    <div className="document-card__main">
                      <div className="document-card__top">
                        <span className="document-card__title">{item.title}</span>
                        <span className="document-card__date">{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="document-card__meta">
                        {item.version ? (
                          <span className="document-card__badge document-card__badge--version">
                            v{item.version}
                          </span>
                        ) : null}
                        <span className="document-card__badge">
                          {formatFileSize(item.fileSizeBytes)}
                        </span>
                        {item.originalFilename ? (
                          <span className="document-card__filename" title={item.originalFilename}>
                            {item.originalFilename}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="document-card__actions">
                      <button
                        type="button"
                        className="document-action-btn"
                        onClick={() => handleOpenPatchNoteFile(item)}
                        title={copy.viewFileTooltip}
                        aria-label={copy.viewFileTooltip}
                      >
                        <img src={viewicon} alt="" />
                      </button>
                      <button
                        type="button"
                        className="document-action-btn"
                        onClick={() => handleDownloadPatchNoteFile(item)}
                        title={copy.downloadFileTooltip}
                        aria-label={copy.downloadFileTooltip}
                      >
                        <img src={downloadicon} alt="" />
                      </button>
                      <button
                        type="button"
                        className="document-action-btn document-action-btn--delete"
                        onClick={() => setDeletePatchNoteId(item.id)}
                        title={copy.deleteFileTooltip}
                        aria-label={copy.deleteFileTooltip}
                      >
                        <img src={deleteicon} alt="" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginacja */}
              <div className="documents-pagination">
                <button
                  type="button"
                  className="documents-pagination__btn"
                  onClick={() => setCurrentPageIndex(0)}
                  disabled={currentPageIndex === 0}
                  title={copy.firstPageTooltip}
                  aria-label={copy.firstPageTooltip}
                >
                  <img src={firstpageicon} alt="" />
                </button>
                <button
                  type="button"
                  className="documents-pagination__btn"
                  onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentPageIndex === 0}
                  title={copy.prevPageTooltip}
                  aria-label={copy.prevPageTooltip}
                >
                  <img src={previouspageicon} alt="" />
                </button>
                <span className="documents-pagination__current">
                  {currentPageNumber} / {totalPages}
                </span>
                <button
                  type="button"
                  className="documents-pagination__btn"
                  onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPageIndex >= totalPages - 1}
                  title={copy.nextPageTooltip}
                  aria-label={copy.nextPageTooltip}
                >
                  <img src={nextpageicon} alt="" />
                </button>
                <button
                  type="button"
                  className="documents-pagination__btn"
                  onClick={() => setCurrentPageIndex(totalPages - 1)}
                  disabled={currentPageIndex >= totalPages - 1}
                  title={copy.lastPageTooltip}
                  aria-label={copy.lastPageTooltip}
                >
                  <img src={lastpageicon} alt="" />
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* MODAL 1: Wgrywanie / edycja dokumentu prawnego */}
      <Modal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editorTitle}
        size="md"
        showFooter={false}
      >
        <div className="document-upload-modal">
          <label className="document-upload-dropzone">
            <img src={editorFile ? fileaddedicon : addfileicon} alt="" />
            <span className="document-upload-dropzone__label">
              {editorFile ? editorFile.name : copy.pdfFileLabel}
            </span>
            <span className="document-upload-dropzone__hint">{copy.selectPdfHint}</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleDocFileChosen}
              style={{ display: 'none' }}
            />
          </label>

          <div className="document-file-info">
            <span className="document-file-info__label">{copy.fileNameLabel}:</span>
            <span className="document-file-info__value">{editorFilename || copy.emptyValue}</span>

            <span className="document-file-info__label">{copy.fileSizeLabel}:</span>
            <span className="document-file-info__value">{editorFilesize || copy.emptyValue}</span>

            <span className="document-file-info__label">{copy.fileDateLabel}:</span>
            <span className="document-file-info__value">{editorFiledate || copy.emptyValue}</span>
          </div>

          <div className="document-modal-actions">
            <Button variant="secondary" onClick={() => setEditorOpen(false)} disabled={isSubmittingDoc}>
              {copy.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveDoc}
              disabled={!editorFile || isSubmittingDoc}
              title={copy.upload}
            >
              {isSubmittingDoc ? 'Wgrywanie...' : copy.upload}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: Nowy patch note */}
      <Modal
        isOpen={patchNoteModalOpen}
        onClose={() => setPatchNoteModalOpen(false)}
        title={copy.addPatchNote}
        size="md"
        showFooter={false}
      >
        <div className="document-upload-modal">
          <label className="document-upload-dropzone">
            <img src={patchNoteFile ? fileaddedicon : addfileicon} alt="" />
            <span className="document-upload-dropzone__label">
              {patchNoteFile ? patchNoteFile.name : copy.pdfFileLabel}
            </span>
            <span className="document-upload-dropzone__hint">{copy.selectPdfHint}</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handlePatchNoteFileChosen}
              style={{ display: 'none' }}
            />
          </label>

          <TextField
            label={copy.titleLabel}
            value={patchNoteTitle}
            onChange={(e) => setPatchNoteTitle(e.target.value)}
            placeholder={copy.titlePlaceholder}
            required
          />

          <TextField
            label={copy.versionLabel}
            value={patchNoteVersion}
            onChange={(e) => setPatchNoteVersion(e.target.value)}
            placeholder={copy.versionPlaceholder}
          />

          <div className="document-modal-actions">
            <Button
              variant="secondary"
              onClick={() => setPatchNoteModalOpen(false)}
              disabled={isSubmittingPatchNote}
            >
              {copy.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={handleSavePatchNote}
              disabled={!patchNoteFile || !patchNoteTitle.trim() || isSubmittingPatchNote}
              title={copy.save}
            >
              {isSubmittingPatchNote ? 'Zapisywanie...' : copy.save}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Potwierdzenie usunięcia dokumentu */}
      <Modal
        isOpen={Boolean(deleteDocKey)}
        onClose={() => setDeleteDocKey(null)}
        title={copy.deleteDocTitle}
        size="sm"
        showFooter={false}
      >
        <div className="document-upload-modal">
          <p className="documents-section__description">{copy.deleteDocDesc}</p>
          <div className="document-modal-actions">
            <Button variant="secondary" onClick={() => setDeleteDocKey(null)}>
              {copy.cancel}
            </Button>
            <Button variant="danger" onClick={handleDeleteDoc} title={copy.delete}>
              {copy.delete}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 4: Potwierdzenie usunięcia patch note */}
      <Modal
        isOpen={Boolean(deletePatchNoteId)}
        onClose={() => setDeletePatchNoteId(null)}
        title={copy.deletePatchNoteTitle}
        size="sm"
        showFooter={false}
      >
        <div className="document-upload-modal">
          <p className="documents-section__description">{copy.deletePatchNoteDesc}</p>
          <div className="document-modal-actions">
            <Button variant="secondary" onClick={() => setDeletePatchNoteId(null)}>
              {copy.cancel}
            </Button>
            <Button variant="danger" onClick={handleDeletePatchNote} title={copy.delete}>
              {copy.delete}
            </Button>
          </div>
        </div>
      </Modal>
    </AppSectionPage>
  );
}
