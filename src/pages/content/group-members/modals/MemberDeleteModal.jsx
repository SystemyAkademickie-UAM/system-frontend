import { Modal } from '../../../../components/ui/index.js';
import './memberModals.css';

export default function MemberDeleteModal({
  isOpen,
  member,
  onClose,
  onConfirm,
  isLoading = false,
}) {
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
      title="Usuń uczestnika"
      onConfirm={handleConfirm}
      confirmLabel={isLoading ? 'Usuwanie…' : 'Usuń'}
      confirmDisabled={isLoading}
      confirmVariant="danger"
      size="sm"
      className="member-modal"
    >
      <p className="member-modal__delete-text">
        Czy na pewno chcesz usunąć tą osobę z grupy?
      </p>
    </Modal>
  );
}
