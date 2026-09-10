import { useState, useRef } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import ShopItemFormContent from '../../group-shop-add/GroupShopAddContentContent.jsx';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './ShopItemFormModal.css';

const EDIT_ITEM_TITLE__TEXTLABEL = {
  polish: 'Edytuj produkt',
  english: 'Edit Product'
};

const ADD_ITEM_TITLE__TEXTLABEL = {
  polish: 'Dodaj przedmiot',
  english: 'Add Item'
};

const STAGE_TITLES = {
  1: { polish: 'Informacje', english: 'Information' },
  2: { polish: 'Wartość przedmiotu', english: 'Item Value' },
  3: { polish: 'Dostępność', english: 'Availability' },
  4: { polish: 'Podsumowanie', english: 'Summary' },
};

const TOTAL_STEPS = 4;

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
  const [currentStep, setCurrentStep] = useState(itemId ? 4 : 1);
  const formRef = useRef(null);

  const baseTitle = itemId
    ? EDIT_ITEM_TITLE__TEXTLABEL[LANGUAGE]
    : ADD_ITEM_TITLE__TEXTLABEL[LANGUAGE];

  const stageTitle = STAGE_TITLES[currentStep]?.[LANGUAGE] ?? '';

  const modalTitle = (
    <span className="shop-item-modal-title">
      <span className="shop-item-modal-title__main">{baseTitle}</span>
      <span className="shop-item-modal-title__divider">•</span>
      <span className="shop-item-modal-title__stage">{stageTitle}</span>
      {!itemId && (
        <span className="shop-item-modal-title__badge">{currentStep}/{TOTAL_STEPS}</span>
      )}
    </span>
  );

  const handleModalClose = () => {
    if (formRef.current?.handleAttemptClose) {
      formRef.current.handleAttemptClose();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={modalTitle}
      size="xl"
      showFooter={false}
      className="shop-item-form-modal"
    >
      <ShopItemFormContent
        ref={formRef}
        groupId={groupId}
        itemId={itemId}
        onClose={onClose}
        onSaved={onSaved}
        onStepChange={setCurrentStep}
        hideInternalHeader={true}
      />
    </Modal>
  );
}

