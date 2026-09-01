import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, TextField } from '../../../components/ui/index.js';
import TemplateDetailPanel from '../../../components/ui/TemplateDetailPanel/TemplateDetailPanel.jsx';
import { createGroupFromTemplate, fetchGroupTemplateDetails } from '../../../services/groupTemplates.api.js';
import { groupMainPath } from '../../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './CreateGroupFromTemplateModal.css';

const MODAL_TITLE__TEXTLABEL = {
  polish: 'Utwórz grupę ze szablonu',
  english: 'Create group from template'
};

const LEAD_TEXT__TEXTLABEL = {
  polish: 'Sprawdź zawartość szablonu i potwierdź utworzenie nowej grupy.',
  english: 'Review the template content and confirm creating a new group.'
};

const GROUP_NAME_LABEL__TEXTLABEL = {
  polish: 'Nazwa nowej grupy*',
  english: 'New group name*'
};

const SUBJECT_NAME_LABEL__TEXTLABEL = {
  polish: 'Przedmiot (opcjonalnie)',
  english: 'Subject (optional)'
};

const GROUP_NAME_ERROR__TEXTLABEL = {
  polish: 'Podaj nazwę nowej grupy.',
  english: 'Enter the new group name.'
};

const CREATE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się utworzyć grupy.',
  english: 'Failed to create group.'
};

const CANCEL_BUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const CREATING_BUTTON__TEXTLABEL = {
  polish: 'Tworzenie…',
  english: 'Creating…'
};

const CREATE_BUTTON__TEXTLABEL = {
  polish: 'Utwórz grupę',
  english: 'Create group'
};

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('../../../services/groupTemplates.api.js').GroupTemplateListItem | null} props.template
 * @param {() => void} props.onClose
 */
export default function CreateGroupFromTemplateModal({ isOpen, template, onClose }) {
  const navigate = useNavigate();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
      setErrorMessage(GROUP_NAME_ERROR__TEXTLABEL[LANGUAGE]);
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
      setErrorMessage(result.error || CREATE_ERROR__TEXTLABEL[LANGUAGE]);
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
      title={MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      subtitle={template?.name}
      size="lg"
      showFooter={false}
      className="create-group-from-template-modal"
    >
      <p className="create-group-from-template-modal__lead">
        {LEAD_TEXT__TEXTLABEL[LANGUAGE]}
      </p>

      <TemplateDetailPanel
        data={details?.data}
        isLoading={isLoadingDetails}
        className="create-group-from-template-modal__details"
      />

      <div className="create-group-from-template-modal__form">
        <TextField
          id="new-group-name"
          label={GROUP_NAME_LABEL__TEXTLABEL[LANGUAGE]}
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          fieldKind="name"
          required
        />
        <TextField
          id="new-group-subject"
          label={SUBJECT_NAME_LABEL__TEXTLABEL[LANGUAGE]}
          value={subjectName}
          onChange={(event) => setSubjectName(event.target.value)}
          fieldKind="name"
        />
      </div>

      {errorMessage ? (
        <p className="create-group-from-template-modal__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="create-group-from-template-modal__footer">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
          {CANCEL_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirm} disabled={isSaving || isLoadingDetails}>
          {isSaving ? CREATING_BUTTON__TEXTLABEL[LANGUAGE] : CREATE_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
      </div>
    </Modal>
  );
}
