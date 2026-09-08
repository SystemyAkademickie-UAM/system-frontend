import { useState } from 'react';
import { Button, Modal } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const MODALTITLE__TEXTLABEL = {
  polish: 'Niezapisane zmiany',
  english: 'Unsaved Changes'
};

const MODALSUBTITLE__TEXTLABEL = {
  polish: 'Wprowadzono zmiany w formularzu przedmiotu. Co chcesz zrobić przed wyjściem?',
  english: 'You have modified the item form. What would you like to do before leaving?'
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
 * Modal potwierdzenia wyjścia z kreatora produktu (Anuluj / Odrzuć / Zapisz roboczo).
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onDiscard: () => void,
 *   onSaveDraft: () => void,
 * }} props
 */
export default function ShopItemUnsavedModal({
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
      className="shop-item-unsaved-modal"
      size="sm"
    >
      <div className="shop-item-unsaved-modal__actions" style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
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
