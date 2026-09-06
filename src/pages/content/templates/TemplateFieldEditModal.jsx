import { useEffect, useState } from 'react';
import { Button, Modal, TextField } from '../../../components/ui/index.js';
import { updateGroupTemplate } from '../../../services/groupTemplates.api.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const EDIT_NAME_TITLE__TEXTLABEL = {
  polish: 'Edytuj nazwę szablonu',
  english: 'Edit template name'
};

const EDIT_DESCRIPTION_TITLE__TEXTLABEL = {
  polish: 'Edytuj opis szablonu',
  english: 'Edit template description'
};

const EDIT_BOTH_TITLE__TEXTLABEL = {
  polish: 'Edytuj szablon',
  english: 'Edit template'
};

const NAME_ERROR__TEXTLABEL = {
  polish: 'Podaj nazwę szablonu.',
  english: 'Enter the template name.'
};

const SAVE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się zapisać zmian.',
  english: 'Failed to save changes.'
};

const NAME_LABEL__TEXTLABEL = {
  polish: 'Nazwa szablonu',
  english: 'Template name'
};

const DESCRIPTION_LABEL__TEXTLABEL = {
  polish: 'Opis szablonu (opcjonalny)',
  english: 'Template description (optional)'
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
  polish: 'Zapisz',
  english: 'Save'
};

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {'name' | 'description' | 'both'} props.field
 * @param {import('../../../services/groupTemplates.api.js').GroupTemplateListItem | null} props.template
 * @param {() => void} props.onClose
 * @param {() => void | Promise<void>} props.onSaved
 */
export default function TemplateFieldEditModal({
  isOpen,
  field,
  template,
  onClose,
  onSaved,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [nameValue, setNameValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !template) {
      setNameValue('');
      setDescriptionValue('');
      setErrorMessage('');
      setIsSaving(false);
      return;
    }
    setNameValue(template.name);
    setDescriptionValue(template.description ?? '');
    setErrorMessage('');
  }, [isOpen, template, field]);

  const title = field === 'name'
    ? EDIT_NAME_TITLE__TEXTLABEL[LANGUAGE]
    : field === 'description'
      ? EDIT_DESCRIPTION_TITLE__TEXTLABEL[LANGUAGE]
      : EDIT_BOTH_TITLE__TEXTLABEL[LANGUAGE];

  const handleConfirm = async () => {
    if (!template) return;
    const trimmedName = nameValue.trim();
    if ((field === 'name' || field === 'both') && !trimmedName) {
      setErrorMessage(NAME_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    const payload = field === 'name'
      ? { name: trimmedName }
      : field === 'description'
        ? { description: descriptionValue.trim() || null }
        : {
            name: trimmedName,
            description: descriptionValue.trim() || null,
          };
    const result = await updateGroupTemplate(template.id, payload);
    setIsSaving(false);

    if (!result.ok) {
      setErrorMessage(result.error || SAVE_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }

    await onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      showFooter={false}
    >
      {(field === 'name' || field === 'both') ? (
        <TextField
          id="template-edit-name"
          label={NAME_LABEL__TEXTLABEL[LANGUAGE]}
          value={nameValue}
          onChange={(event) => setNameValue(event.target.value)}
          fieldKind="name"
          required
        />
      ) : null}

      {(field === 'description' || field === 'both') ? (
        <TextField
          id="template-edit-description"
          label={DESCRIPTION_LABEL__TEXTLABEL[LANGUAGE]}
          value={descriptionValue}
          onChange={(event) => setDescriptionValue(event.target.value)}
          fieldKind="groupDescription"
          className={field === 'both' ? 'templates-page-content__edit-field-gap' : ''}
        />
      ) : null}

      {errorMessage ? (
        <p className="templates-page-content__message templates-page-content__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="templates-page-content__modal-footer">
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
