import { useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function StageDeleteModal({
  isOpen,
  stage,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const DELETESTAGETITLE__TEXTLABEL = {
    polish: 'Usuń etap',
    english: 'Delete Stage',
  };
  const DELETEBUTTON__TEXTLABEL = {
    polish: 'Usuń',
    english: 'Delete',
  };
  const CONFIRM__TEXTLABEL = {
    polish: 'Czy na pewno chcesz usunąć etap',
    english: 'Are you sure you want to delete the stage',
  };
  const CONFICONFIRMSUFFIXRM__TEXTLABEL = {
    polish: 'wraz z przypisanymi aktywnościami?',
    english: 'along with assigned activities?',
  };

  if (!stage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={DELETESTAGETITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={onConfirm}
      confirmLabel={DELETEBUTTON__TEXTLABEL[LANGUAGE]}
      confirmVariant="danger"
      confirmDisabled={isLoading}
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        {CONFIRM__TEXTLABEL[LANGUAGE]}
        {' '}
        <strong>{stage.name}</strong>
        {' '}
        {CONFICONFIRMSUFFIXRM__TEXTLABEL[LANGUAGE]}
      </p>
    </Modal>
  );
}
