import { useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function ActivityDeleteModal({
  isOpen,
  activity,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const DELETEACTIVITYTITLE__TEXTLABEL = {
    polish: 'Usuń aktywność',
    english: 'Delete Activity',
  };
  const DELETEBUTTON__TEXTLABEL = {
    polish: 'Usuń',
    english: 'Delete',
  };
  const CONFIRMTEXT__TEXTLABEL = {
    polish: 'Czy na pewno chcesz usunąć aktywność',
    english: 'Are you sure you want to delete the activity',
  };

  if (!activity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={DELETEACTIVITYTITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={onConfirm}
      confirmLabel={DELETEBUTTON__TEXTLABEL[LANGUAGE]}
      confirmVariant="danger"
      confirmDisabled={isLoading}
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        {CONFIRMTEXT__TEXTLABEL[LANGUAGE]}
        {' '}
        <strong>{activity.name}</strong>
        ?
      </p>
    </Modal>
  );
}
