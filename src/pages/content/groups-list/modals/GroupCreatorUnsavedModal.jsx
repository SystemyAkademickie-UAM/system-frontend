import { useState } from 'react';
import { Button, Modal } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const MODALTITLE__TEXTLABEL = {
  polish: 'Niezapisane zmiany',
  english: 'Unsaved Changes'
};

const MODALSUBTITLE__TEXTLABEL = {
  polish: 'Wprowadzono dane w kreatorze grupy. Co chcesz zrobić przed wyjściem?',
  english: 'You have entered data in the group creator. What would you like to do before leaving?'
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const DISCARDBUTTON__TEXTLABEL = {
  polish: 'Odrzuć zmiany',
  english: 'Discard Changes'
};

const SAVEDRAFTBUTTON__TEXTLABEL = {
  polish: 'Zapisz roboczo',
  english: 'Save as Draft'
};

/**
 * Modal potwierdzenia wyjścia z kreatora grupy.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onDiscard: () => void,
 *   onSaveDraft: () => void,
 * }} props
 */
export default function GroupCreatorUnsavedModal({
  isOpen,
  onClose,
  onDiscard,
  onSaveDraft,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODALTITLE__TEXTLABEL[LANGUAGE]}
      subtitle={MODALSUBTITLE__TEXTLABEL[LANGUAGE]}
      showFooter={false}
      className="group-creator-unsaved-modal"
      size="sm"
    >
      <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '1.25rem', flexWrap: 'wrap' }}>
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {CANCELBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={onDiscard}>
          {DISCARDBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button type="button" variant="primary" size="md" onClick={onSaveDraft}>
          {SAVEDRAFTBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
      </div>
    </Modal>
  );
}
