import { useState } from 'react';
import { Button, Modal } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const MODALTITLE__TEXTLABEL = {
  polish: 'Znaleziono wersję roboczą',
  english: 'Draft Found'
};

const MODALSUBTITLE__TEXTLABEL = {
  polish: 'Masz zapisaną wersję roboczą tego przedmiotu. Czy chcesz ją załadować i kontynuować pracę, czy stworzyć nowy przedmiot od początku?',
  english: 'You have a saved draft for this item. Do you want to resume your work or start creating a new item from scratch?'
};

const WARNING__TEXTLABEL = {
  polish: 'Uwaga: Wybranie opcji "Stwórz nowy" bezpowrotnie usunie zapisaną wersję roboczą.',
  english: 'Notice: Choosing "Start New" will permanently discard the saved draft.'
};

const STARTNEWBUTTON__TEXTLABEL = {
  polish: 'Stwórz nowy (usuń wersję roboczą)',
  english: 'Start New (Discard Draft)'
};

const LOADDRAFTBUTTON__TEXTLABEL = {
  polish: 'Załaduj wersję roboczą',
  english: 'Load Draft'
};

/**
 * Modal wyświetlany przy otwieraniu formularza, gdy wykryto wersję roboczą w localStorage.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onLoadDraft: () => void,
 *   onDiscardDraftAndNew: () => void,
 * }} props
 */
export default function ShopItemDraftPromptModal({
  isOpen,
  onClose,
  onLoadDraft,
  onDiscardDraftAndNew,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODALTITLE__TEXTLABEL[LANGUAGE]}
      subtitle={MODALSUBTITLE__TEXTLABEL[LANGUAGE]}
      showFooter={false}
      className="shop-item-draft-prompt-modal"
      size="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
          {WARNING__TEXTLABEL[LANGUAGE]}
        </p>
        <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <Button type="button" variant="secondary" size="md" onClick={onDiscardDraftAndNew}>
            {STARTNEWBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
          <Button type="button" variant="primary" size="md" onClick={onLoadDraft}>
            {LOADDRAFTBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
