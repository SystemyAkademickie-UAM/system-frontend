import { useState } from 'react';
import { Modal } from '../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './ProfileEqUseItemModal.css';

const MODALTITLE__TEXTLABEL = {
  polish: 'Użycie przedmiotu',
  english: 'Use Item'
};

const CONFIRMLOADINGLABEL__TEXTLABEL = {
  polish: 'Używanie…',
  english: 'Using…'
};

const CONFIRMBUTTONLABEL__TEXTLABEL = {
  polish: 'Użyj przedmiotu',
  english: 'Use Item'
};

const CONFIRMQUESTIONSTART__TEXTLABEL = {
  polish: 'Czy na pewno chcesz użyć przedmiotu',
  english: 'Are you sure you want to use item'
};

const DEFAULTITEMNAME__TEXTLABEL = {
  polish: 'ten przedmiot',
  english: 'this item'
};

const HINTTEXT__TEXTLABEL = {
  polish: 'Prowadzący otrzyma powiadomienie o użyciu przedmiotu.',
  english: 'The instructor will receive a notification about the item use.'
};

/**
 * @param {{
 *   isOpen: boolean,
 *   itemName?: string | null,
 *   isLoading?: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void | Promise<void>,
 * }} props
 */
export default function ProfileEqUseItemModal({
  isOpen,
  itemName = null,
  isLoading = false,
  onClose,
  onConfirm,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODALTITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmLabel={isLoading ? CONFIRMLOADINGLABEL__TEXTLABEL[LANGUAGE] : CONFIRMBUTTONLABEL__TEXTLABEL[LANGUAGE]}
      confirmDisabled={isLoading}
      size="sm"
      className="profile-eq-use-item-modal"
    >
      <p className="profile-eq-use-item-modal__text">
        {CONFIRMQUESTIONSTART__TEXTLABEL[LANGUAGE]}
        {' '}
        <strong>{itemName ?? DEFAULTITEMNAME__TEXTLABEL[LANGUAGE]}</strong>
        ?
      </p>
      <p className="profile-eq-use-item-modal__hint">
        {HINTTEXT__TEXTLABEL[LANGUAGE]}
      </p>
    </Modal>
  );
}
