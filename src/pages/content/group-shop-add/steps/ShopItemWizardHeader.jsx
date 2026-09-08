import { useState } from 'react';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const STAGE_TITLES = {
  1: { polish: 'Informacje', english: 'Information' },
  2: { polish: 'Wartość przedmiotu', english: 'Item Value' },
  3: { polish: 'Dostępność', english: 'Availability' },
  4: { polish: 'Podsumowanie', english: 'Summary' },
};

const ADD_ITEM_TITLE = {
  polish: 'Dodaj przedmiot',
  english: 'Add Item'
};

const EDIT_ITEM_TITLE = {
  polish: 'Edytuj produkt',
  english: 'Edit Product'
};

/**
 * Nagłówek etapu kreatora przedmiotu.
 *
 * @param {{
 *   currentStep: number,
 *   totalSteps?: number,
 *   isEditing?: boolean,
 * }} props
 */
export default function ShopItemWizardHeader({
  currentStep = 1,
  totalSteps = 4,
  isEditing = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const mainTitle = isEditing ? EDIT_ITEM_TITLE[LANGUAGE] : ADD_ITEM_TITLE[LANGUAGE];
  const stageTitle = STAGE_TITLES[currentStep]?.[LANGUAGE] ?? '';

  return (
    <div className="shop-item-wizard-header">
      <div className="shop-item-wizard-header__titles">
        <span className="shop-item-wizard-header__main-title">{mainTitle}</span>
        <span className="shop-item-wizard-header__divider" aria-hidden="true">•</span>
        <span className="shop-item-wizard-header__stage-title">{stageTitle}</span>
      </div>
      <div className="shop-item-wizard-header__indicator" aria-label={`Krok ${currentStep} z ${totalSteps}`}>
        <span className="shop-item-wizard-header__badge">{currentStep}/{totalSteps}</span>
      </div>
    </div>
  );
}
