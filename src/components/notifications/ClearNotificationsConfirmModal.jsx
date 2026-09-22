import { useState } from 'react';
import { Modal } from '../ui/index.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './ClearNotificationsConfirmModal.css';

const CLEARALLTITLE__TEXTLABEL = {
  polish: 'Wyczyść powiadomienia',
  english: 'Clear notifications',
};

const CLEARALL__TEXTLABEL = {
  polish: 'Czy na pewno chcesz trwale usunąć wszystkie powiadomienia? Tej operacji nie można cofnąć.',
  english: 'Are you sure you want to permanently delete all notifications? This action cannot be undone.',
};

const CLEARALLCONFIRMLABEL__TEXTLABEL = {
  polish: 'Wyczyść powiadomienia',
  english: 'Clear notifications',
};

const CLEARPARTTITLE__TEXTLABEL = {
  polish: 'Wyczyść powiadomienia (oprócz użyć przedmiotów)',
  english: 'Clear notifications (except item uses)',
};

const CLEARPART__TEXTLABEL = {
  polish: 'Czy na pewno chcesz usunąć wszystkie powiadomienia oprócz użyć przedmiotów? Powiadomienia o użyciu przedmiotów pozostaną w dzienniku.',
  english: 'Are you sure you want to delete all notifications except item uses? Item use notifications will remain in the log.',
};

const CLEARPARTCONFIRMLABEL__TEXTLABEL = {
  polish: 'Wyczyść (oprócz użyć przedmiotów)',
  english: 'Clear (except item uses)',
};

const CLEARING__TEXTLABEL = {
  polish: 'Czyszczenie...',
  english: 'Clearing...',
};

const MODEMAP = {
  all: {
    title: CLEARALLTITLE__TEXTLABEL,
    body: CLEARALL__TEXTLABEL,
    confirmLabel: CLEARALLCONFIRMLABEL__TEXTLABEL,
    modalClass: 'clear-notifications-modal clear-notifications-modal--all',
  },
  exceptItemUses: {
    title: CLEARPARTTITLE__TEXTLABEL,
    body: CLEARPART__TEXTLABEL,
    confirmLabel: CLEARPARTCONFIRMLABEL__TEXTLABEL,
    modalClass: 'clear-notifications-modal clear-notifications-modal--partial',
  },
};

/**
 * @param {{
 *   isOpen: boolean,
 *   mode: 'all' | 'exceptItemUses' | null,
 *   isLoading?: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void | Promise<void>,
 * }} props
 */
export default function ClearNotificationsConfirmModal({
  isOpen,
  mode,
  isLoading = false,
  onClose,
  onConfirm,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  if (!mode) {
    return null;
  }

  const map = MODEMAP[mode];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={map.title[LANGUAGE]}
      onConfirm={onConfirm}
      confirmLabel={isLoading ? CLEARING__TEXTLABEL[LANGUAGE] : map.confirmLabel[LANGUAGE]}
      confirmVariant="primary"
      confirmDisabled={isLoading}
      size="sm"
      className={map.modalClass}
    >
      <p className="clear-notifications-modal__text">{map.body[LANGUAGE]}</p>
    </Modal>
  );
}
