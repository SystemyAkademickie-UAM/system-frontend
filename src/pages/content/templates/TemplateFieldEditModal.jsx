import { useEffect, useState } from 'react';
import { Button, Modal, TextField } from '../../../components/ui/index.js';
import { updateGroupTemplate } from '../../../services/groupTemplates.api.js';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {'name' | 'description'} props.field
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
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !template) {
      setValue('');
      setErrorMessage('');
      setIsSaving(false);
      return;
    }
    setValue(field === 'name' ? template.name : template.description ?? '');
    setErrorMessage('');
  }, [isOpen, template, field]);

  const title = field === 'name' ? 'Edytuj nazwę szablonu' : 'Edytuj opis szablonu';
  const label = field === 'name' ? 'Nazwa szablonu' : 'Opis szablonu (opcjonalny)';
  const fieldKind = field === 'name' ? 'name' : 'groupDescription';

  const handleConfirm = async () => {
    if (!template) return;
    if (field === 'name' && !value.trim()) {
      setErrorMessage('Podaj nazwę szablonu.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    const payload = field === 'name'
      ? { name: value.trim() }
      : { description: value.trim() || null };
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
      <TextField
        id={`template-edit-${field}`}
        label={label}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        fieldKind={fieldKind}
        required={field === 'name'}
      />

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
