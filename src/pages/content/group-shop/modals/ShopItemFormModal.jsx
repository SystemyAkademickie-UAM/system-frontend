import { Modal } from '../../../../components/ui/index.js';
import ShopItemFormContent from '../../group-shop-add/GroupShopAddContentContent.jsx';
import './ShopItemFormModal.css';

/**
 * @param {{
 *   isOpen: boolean,
 *   groupId: string | number,
 *   itemId?: string | number | null,
 *   onClose: () => void,
 *   onSaved?: () => void,
 * }} props
 */
export default function ShopItemFormModal({
  isOpen,
  groupId,
  itemId = null,
  onClose,
  onSaved,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemId ? 'Edytuj produkt' : 'Dodaj produkt'}
      size="xl"
      showFooter={false}
      className="shop-item-form-modal"
    >
      <ShopItemFormContent
        groupId={groupId}
        itemId={itemId}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Modal>
  );
}
