import { Modal } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import { useState } from 'react';
import './memberModals.css';

const MODAL_TITLE__TEXTLABEL = { polish: 'Usuń uczestnika', english: 'Remove Participant' };
const DELETE_BUTTON__TEXTLABEL = { polish: 'Usuń', english: 'Remove' };
const SAVING_BUTTON__TEXTLABEL = { polish: 'Usuwanie…', english: 'Removing…' };
const DELETE_CONFIRMATION__TEXTLABEL = { polish: 'Czy na pewno chcesz usunąć tą osobę z grupy?', english: 'Are you sure you want to remove this person from the group?' };

export default function MemberDeleteModal({
  isOpen,
  member,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const handleConfirm = async () => {
    await onConfirm?.();
  };

  if (!member) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmLabel={isLoading ? SAVING_BUTTON__TEXTLABEL[LANGUAGE] : DELETE_BUTTON__TEXTLABEL[LANGUAGE]}
      confirmDisabled={isLoading}
      confirmVariant="danger"
      size="sm"
      className="member-modal"
    >
      <p className="member-modal__delete-text">
        {DELETE_CONFIRMATION__TEXTLABEL[LANGUAGE]}
      </p>
    </Modal>
  );
}
