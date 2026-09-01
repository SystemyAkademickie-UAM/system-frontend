import { useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const DELETEMODALTITLE__TEXTLABEL = {
  polish: 'Usuń rangę',
  english: 'Delete rank'
};

const CONFIRMBUTTON__TEXTLABEL = {
  polish: 'Usuń',
  english: 'Delete'
};

const CONFIRMMESSAGE__TEXTLABEL = {
  polish: 'Czy na pewno chcesz usunąć rangę',
  english: 'Are you sure you want to delete the rank'
};

export default function RankDeleteModal({
  isOpen,
  rank,
  onClose,
  onConfirm,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!rank) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={DELETEMODALTITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmLabel={CONFIRMBUTTON__TEXTLABEL[LANGUAGE]}
      confirmVariant="danger"
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        {CONFIRMMESSAGE__TEXTLABEL[LANGUAGE]}
        {' '}
        <strong>{rank.name}</strong>
        ?
      </p>
    </Modal>
  );
}
