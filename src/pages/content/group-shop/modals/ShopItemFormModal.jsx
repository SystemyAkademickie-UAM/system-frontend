import { useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import ShopItemFormContent from '../../group-shop-add/GroupShopAddContentContent.jsx';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './ShopItemFormModal.css';

const EDIT_ITEM_TITLE__TEXTLABEL = {
  polish: 'Edytuj produkt',
  english: 'Edit Product'
};

const ADD_ITEM_TITLE__TEXTLABEL = {
  polish: 'Dodaj produkt',
  english: 'Add Product'
};



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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const title = itemId
    ? EDIT_ITEM_TITLE__TEXTLABEL[LANGUAGE]
    : ADD_ITEM_TITLE__TEXTLABEL[LANGUAGE];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
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
