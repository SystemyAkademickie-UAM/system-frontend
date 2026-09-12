import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterGroups, fetchUserGroups } from '../../../services/groups.api.js';
import { saveGroupAsTemplate } from '../../../services/groupTemplates.api.js';
import { Button, Modal, SearchBar, TextField } from '../../../components/ui/index.js';
import TemplateDetailPanel from '../../../components/ui/TemplateDetailPanel/TemplateDetailPanel.jsx';
import { fetchGroupSnapshotForTemplate } from './groupSnapshotForTemplate.js';
import SelectGroupMiniCard from './SelectGroupMiniCard.jsx';
import { buildDefaultTemplateName } from '../../../utils/templates/templateName.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './CreateTemplateModal.css';

const MODAL_TITLE__TEXTLABEL = {
  polish: 'Nowy szablon',
  english: 'New template'
};

const MODAL_SUBTITLE__TEXTLABEL = {
  polish: 'Wybierz grupę źródłową i nadaj szablonowi nazwę*',
  english: 'Select source group and name the template*'
};

const SEARCH_PLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj grup…',
  english: 'Search groups…'
};

const SEARCH_ARIA__TEXTLABEL = {
  polish: 'Szukaj grup po nazwie',
  english: 'Search groups by name'
};

const LOADING_GROUPS__TEXTLABEL = {
  polish: 'Ładowanie grup…',
  english: 'Loading groups…'
};

const NO_GROUPS_MESSAGE__TEXTLABEL = {
  polish: 'Brak grup do wyboru.',
  english: 'No groups available to select.'
};

const TEMPLATE_NAME_LABEL__TEXTLABEL = {
  polish: 'Nazwa szablonu',
  english: 'Template name'
};

const TEMPLATE_DESCRIPTION_LABEL__TEXTLABEL = {
  polish: 'Opis szablonu (opcjonalny)',
  english: 'Template description (optional)'
};

const PUBLIC_GALLERY_CHECKBOX__TEXTLABEL = {
  polish: 'Udostępnij w publicznej galerii szablonów',
  english: 'Share in public template gallery'
};

const PREVIEW_TITLE__TEXTLABEL = {
  polish: 'Podgląd zawartości',
  english: 'Content preview'
};

const SELECT_GROUP_ERROR__TEXTLABEL = {
  polish: 'Wybierz grupę, z której chcesz utworzyć szablon.',
  english: 'Select a group to create a template from.'
};

const TEMPLATE_NAME_ERROR__TEXTLABEL = {
  polish: 'Podaj nazwę szablonu.',
  english: 'Enter a template name.'
};

const SAVE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się zapisać szablonu.',
  english: 'Failed to save template.'
};

const CANCEL_BUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const SAVING_BUTTON__TEXTLABEL = {
  polish: 'Zapisywanie…',
  english: 'Saving…'
};

const SAVE_BUTTON__TEXTLABEL = {
  polish: 'Zapisz szablon',
  english: 'Save template'
};

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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

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
    setTemplateName((current) => current || buildDefaultTemplateName(group.storyName));
  };

  const handleConfirm = async () => {
    if (!selectedGroupId) {
      setErrorMessage(SELECT_GROUP_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }
    if (!templateName.trim()) {
      setErrorMessage(TEMPLATE_NAME_ERROR__TEXTLABEL[LANGUAGE]);
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
      setErrorMessage(result.error || SAVE_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }

    await onCreated();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      subtitle={MODAL_SUBTITLE__TEXTLABEL[LANGUAGE]}
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
            placeholder={SEARCH_PLACEHOLDER__TEXTLABEL[LANGUAGE]}
            aria-label={SEARCH_ARIA__TEXTLABEL[LANGUAGE]}
          />

          {isLoadingGroups ? (
            <p className="create-template-modal__message">{LOADING_GROUPS__TEXTLABEL[LANGUAGE]}</p>
          ) : filteredGroups.length === 0 ? (
            <p className="create-template-modal__message">{NO_GROUPS_MESSAGE__TEXTLABEL[LANGUAGE]}</p>
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
              label={TEMPLATE_NAME_LABEL__TEXTLABEL[LANGUAGE]}
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              fieldKind="name"
              required
            />
            <TextField
              id="template-description"
              label={TEMPLATE_DESCRIPTION_LABEL__TEXTLABEL[LANGUAGE]}
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
                {PUBLIC_GALLERY_CHECKBOX__TEXTLABEL[LANGUAGE]}
              </span>
            </label>
          </div>
        </div>

        <aside className="create-template-modal__preview" aria-live="polite">
          <h3 className="create-template-modal__preview-title">{PREVIEW_TITLE__TEXTLABEL[LANGUAGE]}</h3>
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
          {CANCEL_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirm} disabled={isSaving}>
          {isSaving ? SAVING_BUTTON__TEXTLABEL[LANGUAGE] : SAVE_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
      </div>
    </Modal>
  );
}
