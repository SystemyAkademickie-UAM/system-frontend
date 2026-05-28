import { Modal } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function BadgeDeleteModal({
  isOpen,
  badge,
  onClose,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!badge) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Usuń odznakę"
      onConfirm={handleConfirm}
      confirmLabel="Usuń"
      confirmVariant="danger"
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        Czy na pewno chcesz usunąć odznakę
        {' '}
        <strong>{badge.name}</strong>
        ?
      </p>
    </Modal>
  );
}
