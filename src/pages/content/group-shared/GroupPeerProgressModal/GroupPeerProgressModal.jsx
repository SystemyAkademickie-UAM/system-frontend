import { useEffect, useState } from 'react';
import { Button, Modal } from '../../../../components/ui/index.js';
import SettingsCheckboxField from '../../group-settings/SettingsCheckboxField.jsx';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';
import './GroupPeerProgressModal.css';

const MODALTITLE__TEXTLABEL = {
  polish: 'Ustawienia',
  english: 'Settings',
};

const CHECKBOXLABEL__TEXTLABEL = {
  polish: 'Uczestnicy widzą postęp innych uczestników',
  english: 'Participants see each other\'s progress',
};

const HINTLABEL__TEXTLABEL = {
  polish: 'Włączenie tej opcji pozwala studentom na podgląd postępu innych uczestników grupy. Ustawienie to wpływa jednocześnie na wyświetlanie awatarów uczestników na kafelkach rang oraz odznak.',
  english: 'Enabling this option allows students to see the progress of other group members. This setting applies to participant avatars displayed on both rank and badge cards.',
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel',
};

const SAVEBUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save',
};

const SAVINGBUTTON__TEXTLABEL = {
  polish: 'Zapisywanie…',
  english: 'Saving…',
};

/**
 * Modal ustawień widoczności postępu uczestników (działa jednocześnie dla rang i odznak).
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {boolean} props.currentValue
 * @param {(value: boolean) => Promise<{ ok: boolean, error?: string }>} props.onSave
 * @param {() => void} props.onClose
 */
export default function GroupPeerProgressModal({
  isOpen,
  currentValue = true,
  onSave,
  onClose,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [checked, setChecked] = useState(currentValue);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChecked(currentValue !== false);
      setIsSaving(false);
    }
  }, [isOpen, currentValue]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    const result = await onSave(checked);
    setIsSaving(false);
    if (result?.ok) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODALTITLE__TEXTLABEL[LANGUAGE]}
      className="rewards-modal group-peer-progress-modal"
      footer={(
        <div className="rewards-modal__footer">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSaving}
          >
            {CANCELBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? SAVINGBUTTON__TEXTLABEL[LANGUAGE] : SAVEBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
        </div>
      )}
    >
      <div className="rewards-modal__body group-peer-progress-modal__body">
        <div className="rewards-modal__field group-peer-progress-modal__field">
          <SettingsCheckboxField
            id="peer-progress-visible-checkbox"
            checked={checked}
            onChange={setChecked}
            disabled={isSaving}
          >
            {CHECKBOXLABEL__TEXTLABEL[LANGUAGE]}
          </SettingsCheckboxField>
          <p className="rewards-modal__field-hint group-peer-progress-modal__hint">
            {HINTLABEL__TEXTLABEL[LANGUAGE]}
          </p>
        </div>
      </div>
    </Modal>
  );
}
