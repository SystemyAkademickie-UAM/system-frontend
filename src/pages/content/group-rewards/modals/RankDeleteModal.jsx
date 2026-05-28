import { Modal } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function RankDeleteModal({
  isOpen,
  rank,
  onClose,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!rank) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Usuń rangę"
      onConfirm={handleConfirm}
      confirmLabel="Usuń"
      confirmVariant="danger"
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        Czy na pewno chcesz usunąć rangę
        {' '}
        <strong>{rank.name}</strong>
        ?
      </p>
    </Modal>
  );
}
