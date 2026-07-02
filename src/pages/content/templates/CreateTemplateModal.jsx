import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterGroups, fetchUserGroups } from '../../../services/groups.api.js';
import { saveGroupAsTemplate } from '../../../services/groupTemplates.api.js';
import { Button, Modal, SearchBar, TextField } from '../../../components/ui/index.js';
import TemplateDetailPanel from '../../../components/ui/TemplateDetailPanel/TemplateDetailPanel.jsx';
import { fetchGroupSnapshotForTemplate } from './groupSnapshotForTemplate.js';
import SelectGroupMiniCard from './SelectGroupMiniCard.jsx';
import './CreateTemplateModal.css';

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {() => void | Promise<void>} props.onCreated
 */
export default function CreateTemplateModal({ isOpen, onClose, onCreated }) {
  const [groups, setGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [hoveredGroupId, setHoveredGroupId] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredGroups = useMemo(
    () => filterGroups(groups, searchQuery),
    [groups, searchQuery],
  );

  const previewGroupId = hoveredGroupId ?? selectedGroupId;

  const loadPreview = useCallback(async (groupId) => {
    if (!groupId) {
      setPreviewData(null);
      return;
    }
    setIsLoadingPreview(true);
    try {
      const snapshot = await fetchGroupSnapshotForTemplate(groupId);
      setPreviewData(snapshot);
    } catch {
      setPreviewData(null);
    } finally {
      setIsLoadingPreview(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingGroups(true);
    fetchUserGroups()
      .then((items) => setGroups(items))
      .finally(() => setIsLoadingGroups(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setTimeout(() => {
      loadPreview(previewGroupId);
    }, previewGroupId ? 120 : 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, previewGroupId, loadPreview]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedGroupId(null);
      setHoveredGroupId(null);
      setPreviewData(null);
      setTemplateName('');
      setTemplateDescription('');
      setIsPublic(false);
      setErrorMessage('');
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleSelectGroup = (group) => {
    setSelectedGroupId(group.id);
    setTemplateName((current) => current || `${group.storyName} — szablon`);
  };

  const handleConfirm = async () => {
    if (!selectedGroupId) {
      setErrorMessage('Wybierz grupę, z której chcesz utworzyć szablon.');
      return;
    }
    if (!templateName.trim()) {
      setErrorMessage('Podaj nazwę szablonu.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    const result = await saveGroupAsTemplate(selectedGroupId, {
      name: templateName.trim(),
      description: templateDescription.trim() || undefined,
      isPublic,
    });
    setIsSaving(false);

    if (!result.ok) {
      setErrorMessage(result.error || 'Nie udało się zapisać szablonu.');
      return;
    }

    await onCreated();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nowy szablon"
      subtitle="Wybierz grupę źródłową i nadaj szablonowi nazwę*"
      size="xl"
      showFooter={false}
      className="create-template-modal"
    >
      <div className="create-template-modal__body">
        <div className="create-template-modal__left">
          <SearchBar
            className="create-template-modal__search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Szukaj grup…"
            aria-label="Szukaj grup po nazwie"
          />

          {isLoadingGroups ? (
            <p className="create-template-modal__message">Ładowanie grup…</p>
          ) : filteredGroups.length === 0 ? (
            <p className="create-template-modal__message">Brak grup do wyboru.</p>
          ) : (
            <ul className="create-template-modal__grid">
              {filteredGroups.map((group) => (
                <li key={group.id}>
                  <SelectGroupMiniCard
                    group={group}
                    isSelected={selectedGroupId === group.id}
                    isHovered={hoveredGroupId === group.id}
                    onSelect={() => handleSelectGroup(group)}
                    onHoverChange={(hovered) => setHoveredGroupId(hovered ? group.id : null)}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="create-template-modal__form">
            <TextField
              id="template-name"
              label="Nazwa szablonu"
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              fieldKind="name"
              required
            />
            <TextField
              id="template-description"
              label="Opis szablonu (opcjonalny)"
              value={templateDescription}
              onChange={(event) => setTemplateDescription(event.target.value)}
              fieldKind="groupDescription"
            />
            <label className="create-template-modal__checkbox">
              <input
                type="checkbox"
                className="create-template-modal__checkbox-input"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
              />
              <span
                className={[
                  'create-template-modal__checkbox-box',
                  isPublic ? 'create-template-modal__checkbox-box--checked' : '',
                ].filter(Boolean).join(' ')}
                aria-hidden="true"
              >
                {isPublic ? <CheckIcon className="create-template-modal__checkbox-icon" /> : null}
              </span>
              <span className="create-template-modal__checkbox-text">
                Udostępnij w publicznej galerii szablonów
              </span>
            </label>
          </div>
        </div>

        <aside className="create-template-modal__preview" aria-live="polite">
          <h3 className="create-template-modal__preview-title">Podgląd zawartości</h3>
          <TemplateDetailPanel
            data={previewData}
            isLoading={isLoadingPreview && Boolean(previewGroupId)}
            className="maq-template-detail-panel--fitted"
          />
        </aside>
      </div>

      {errorMessage ? (
        <p className="create-template-modal__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="create-template-modal__footer-extra">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
          Anuluj
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirm} disabled={isSaving}>
          {isSaving ? 'Zapisywanie…' : 'Zapisz szablon'}
        </Button>
      </div>
    </Modal>
  );
}
