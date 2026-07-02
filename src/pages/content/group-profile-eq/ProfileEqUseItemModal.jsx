import { Modal } from '../../../components/ui/index.js';
import './ProfileEqUseItemModal.css';

/**
 * @param {{
 *   isOpen: boolean,
 *   itemName?: string | null,
 *   isLoading?: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void | Promise<void>,
 * }} props
 */
export default function ProfileEqUseItemModal({
  isOpen,
  itemName = null,
  isLoading = false,
  onClose,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Użycie przedmiotu"
      onConfirm={handleConfirm}
      confirmLabel={isLoading ? 'Używanie…' : 'Użyj przedmiotu'}
      confirmDisabled={isLoading}
      size="sm"
      className="profile-eq-use-item-modal"
    >
      <p className="profile-eq-use-item-modal__text">
        Czy na pewno chcesz użyć przedmiotu
        {' '}
        <strong>{itemName ?? 'ten przedmiot'}</strong>
        ?
      </p>
      <p className="profile-eq-use-item-modal__hint">
        Prowadzący otrzyma powiadomienie o użyciu przedmiotu.
      </p>
    </Modal>
  );
}
