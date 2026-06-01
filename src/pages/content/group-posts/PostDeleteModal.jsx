import { Modal } from '../../../components/ui/index.js';
import '../group-rewards/shared/rewardsModals.css';

export default function PostDeleteModal({
  isOpen,
  post,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  if (!post) return null;

  const title = post.title?.trim() || 'Bez tytułu';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Usuń wpis"
      onConfirm={onConfirm}
      confirmLabel="Usuń"
      confirmVariant="danger"
      confirmDisabled={isLoading}
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        Czy na pewno chcesz usunąć wpis
        {' '}
        <strong>{title}</strong>
        ?
      </p>
    </Modal>
  );
}
