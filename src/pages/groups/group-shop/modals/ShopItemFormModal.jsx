/**
 * @file ShopItemFormModal.jsx
 * @description Komponent okna modalnego ShopItemFormModal z obsługą formularza i akcji użytkownika.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState, useRef, useEffect } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import ShopItemFormContent from '../../group-shop-add/GroupShopAddContentContent.jsx';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './ShopItemFormModal.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
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
  2: { polish: 'Dostępność', english: 'Availability' },
  3: { polish: 'Wartość przedmiotu', english: 'Item Value' },
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

// === KOMPONENT OKNA DIALOGOWEGO ===
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

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(itemId ? 4 : 1);
    }
  }, [isOpen, itemId]);

  const isEditing = Boolean(itemId);

  const baseTitle = isEditing
    ? EDIT_ITEM_TITLE__TEXTLABEL[LANGUAGE]

: ADD_ITEM_TITLE__TEXTLABEL[LANGUAGE];

  const stageTitle = STAGE_TITLES[currentStep]?.[LANGUAGE] ?? '';

  const modalTitle = (
    <span className="shop-item-modal-title">
      <span className="shop-item-modal-title__main">{baseTitle}</span>
      <span className="shop-item-modal-title__divider">•</span>
      <span className="shop-item-modal-title__stage">{stageTitle}</span>
      {!isEditing ? (
        <span className="shop-item-modal-title__badge">{currentStep}/{TOTAL_STEPS}</span>
      ) : null}
    </span>
  );

  const handleModalClose = () => {
    if (formRef.current?.handleAttemptClose) {
      formRef.current.handleAttemptClose();
    } else {
      onClose();
    }
  };

// === RENDEROWANIE OKNA MODALNEGO ===
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
        key={`${groupId}_${itemId ?? 'new'}`}
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
