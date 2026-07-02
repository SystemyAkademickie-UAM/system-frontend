import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, TextField } from '../../../components/ui/index.js';
import TemplateDetailPanel from '../../../components/ui/TemplateDetailPanel/TemplateDetailPanel.jsx';
import { createGroupFromTemplate, fetchGroupTemplateDetails } from '../../../services/groupTemplates.api.js';
import { groupMainPath } from '../../../routes/pathRegistry.js';
import './CreateGroupFromTemplateModal.css';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('../../../services/groupTemplates.api.js').GroupTemplateListItem | null} props.template
 * @param {() => void} props.onClose
 */
export default function CreateGroupFromTemplateModal({ isOpen, template, onClose }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !template) {
      setDetails(null);
      return;
    }

    setGroupName(template.name);
    setSubjectName('');
    setErrorMessage('');
    setIsLoadingDetails(true);
    fetchGroupTemplateDetails(template.id)
      .then((result) => {
        setDetails(result);
        if (result?.data?.group?.subjectName) {
          setSubjectName(result.data.group.subjectName);
        }
      })
      .finally(() => setIsLoadingDetails(false));
  }, [isOpen, template]);

  const handleConfirm = async () => {
    if (!template) return;
    if (!groupName.trim()) {
      setErrorMessage('Podaj nazwę nowej grupy.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    const result = await createGroupFromTemplate(template.id, {
      name: groupName.trim(),
      subjectName: subjectName.trim() || undefined,
    });
    setIsSaving(false);

    if (!result.ok || !result.groupId) {
      setErrorMessage(result.error || 'Nie udało się utworzyć grupy.');
      return;
    }

    onClose();
    navigate(groupMainPath(String(result.groupId)), {
      state: {
        templateCreatedPopup: {
          groupName: groupName.trim(),
          subjectName: subjectName.trim(),
        },
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Utwórz grupę ze szablonu"
      subtitle={template?.name}
      size="lg"
      showFooter={false}
      className="create-group-from-template-modal"
    >
      <p className="create-group-from-template-modal__lead">
        Sprawdź zawartość szablonu i potwierdź utworzenie nowej grupy.
      </p>

      <TemplateDetailPanel
        data={details?.data}
        isLoading={isLoadingDetails}
        className="create-group-from-template-modal__details"
      />

      <div className="create-group-from-template-modal__form">
        <TextField
          id="new-group-name"
          label="Nazwa nowej grupy*"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          required
        />
        <TextField
          id="new-group-subject"
          label="Przedmiot (opcjonalnie)"
          value={subjectName}
          onChange={(event) => setSubjectName(event.target.value)}
        />
      </div>

      {errorMessage ? (
        <p className="create-group-from-template-modal__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="create-group-from-template-modal__footer">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
          Anuluj
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirm} disabled={isSaving || isLoadingDetails}>
          {isSaving ? 'Tworzenie…' : 'Utwórz grupę'}
        </Button>
      </div>
    </Modal>
  );
}
