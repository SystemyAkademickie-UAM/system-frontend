import { useState } from 'react';
import { Button, Modal } from '../../../components/ui/index.js';
import '../settings/SettingsContent.css';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const MODALTITLE__TEXTLABEL = {
  polish: 'Niezapisane zmiany',
  english: 'Unsaved changes'
};

const MODALSUBTITLE__TEXTLABEL = {
  polish: 'Masz niezapisane zmiany na tej stronie. Czy chcesz je zapisać przed opuszczeniem?',
  english: 'You have unsaved changes on this page. Do you want to save them before leaving?'
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const DISCARDBUTTON__TEXTLABEL = {
  polish: 'Odrzuć zmiany',
  english: 'Discard changes'
};

const SAVEBUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save'
};

/**
 * @param {{
 *   isOpen: boolean,
 *   isSaving?: boolean,
 *   onClose: () => void,
 *   onDiscard: () => void,
 *   onSave: () => void,
 * }} props
 */
export default function GroupSettingsUnsavedModal({
  isOpen,
  isSaving = false,
  onClose,
  onDiscard,
  onSave,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODALTITLE__TEXTLABEL[LANGUAGE]}
      subtitle={MODALSUBTITLE__TEXTLABEL[LANGUAGE]}
      showFooter={false}
      className="settings-page__unsaved-modal"
    >
      <div className="settings-page__unsaved-actions">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          {CANCELBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={onDiscard}>
          {DISCARDBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onSave}
          disabled={isSaving}
        >
          {SAVEBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
      </div>
    </Modal>
  );
}
