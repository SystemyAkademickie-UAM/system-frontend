import { Modal } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function ActivityDeleteModal({
  isOpen,
  activity,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  if (!activity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Usuń aktywność"
      onConfirm={onConfirm}
      confirmLabel="Usuń"
      confirmVariant="danger"
      confirmDisabled={isLoading}
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        Czy na pewno chcesz usunąć aktywność
        {' '}
        <strong>{activity.name}</strong>
        ?
      </p>
    </Modal>
  );
}
