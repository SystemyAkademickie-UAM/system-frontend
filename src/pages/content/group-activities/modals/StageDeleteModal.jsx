import { Modal } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function StageDeleteModal({
  isOpen,
  stage,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  if (!stage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Usuń etap"
      onConfirm={onConfirm}
      confirmLabel="Usuń"
      confirmVariant="danger"
      confirmDisabled={isLoading}
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        Czy na pewno chcesz usunąć etap
        {' '}
        <strong>{stage.name}</strong>
        {' '}
        wraz z przypisanymi aktywnościami?
      </p>
    </Modal>
  );
}
