import { useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './shopModals.css';

const DELETE_MODAL_TITLE__TEXTLABEL = {
  polish: 'Usuń produkt',
  english: 'Delete Product'
};

const DELETE_MODAL_BUTTON__TEXTLABEL = {
  polish: 'Usuń',
  english: 'Delete'
};

const DELETE_CONFIRM_TEXT__TEXTLABEL = {
  polish: 'Czy na pewno chcesz usunąć produkt {name}?',
  english: 'Are you sure you want to delete product {name}?'
};

export default function ShopDeleteModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!item) {
    return null;
  }

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const confirmText = DELETE_CONFIRM_TEXT__TEXTLABEL[LANGUAGE].replace('{name}', item.name);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={DELETE_MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmLabel={DELETE_MODAL_BUTTON__TEXTLABEL[LANGUAGE]}
      confirmVariant="danger"
      size="sm"
      className="shop-modal"
    >
      <p className="shop-modal__delete-text">
        {confirmText}
      </p>
    </Modal>
  );
}
