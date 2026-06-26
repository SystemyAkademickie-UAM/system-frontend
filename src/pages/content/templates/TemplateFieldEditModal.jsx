import { useEffect, useState } from 'react';
import { Button, Modal, TextField } from '../../../components/ui/index.js';
import { updateGroupTemplate } from '../../../services/groupTemplates.api.js';

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
    ? 'Edytuj nazwę szablonu'
    : field === 'description'
      ? 'Edytuj opis szablonu'
      : 'Edytuj szablon';

  const handleConfirm = async () => {
    if (!template) return;
    const trimmedName = nameValue.trim();
    if ((field === 'name' || field === 'both') && !trimmedName) {
      setErrorMessage('Podaj nazwę szablonu.');
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
      setErrorMessage(result.error || 'Nie udało się zapisać zmian.');
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
          label="Nazwa szablonu"
          value={nameValue}
          onChange={(event) => setNameValue(event.target.value)}
          fieldKind="name"
          required
        />
      ) : null}

      {(field === 'description' || field === 'both') ? (
        <TextField
          id="template-edit-description"
          label="Opis szablonu (opcjonalny)"
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
          Anuluj
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirm} disabled={isSaving}>
          {isSaving ? 'Zapisywanie…' : 'Zapisz'}
        </Button>
      </div>
    </Modal>
  );
}
