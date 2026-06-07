import { Modal } from '../../../../components/ui/index.js';
import './shopModals.css';

export default function ShopDeleteModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!item) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Usuń produkt"
      onConfirm={handleConfirm}
      confirmLabel="Usuń"
      confirmVariant="danger"
      size="sm"
      className="shop-modal"
    >
      <p className="shop-modal__delete-text">
        Czy na pewno chcesz usunąć produkt
        {' '}
        <strong>{item.name}</strong>
        ?
      </p>
    </Modal>
  );
}
