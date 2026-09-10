import { useState } from 'react';
import { CharacterLimitedField, InfoTooltip, useToast } from '../../../../components/ui/index.js';
import EmojiPickerField from '../../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import LivesIcon from '../../../../components/ui/Lives/LivesIcon.jsx';
import { NAME_MAX_LENGTH, SHORT_DESCRIPTION_MAX_LENGTH, ITEM_CATEGORY_NAME_MAX_LENGTH } from '../../../../constants/fieldLimits.js';
import { EXTRA_LIFE_ICON_EDIT_TOOLTIP } from '../../../../utils/shop/extraLifeItem.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const ITEMNAMELABEL__TEXTLABEL = {
  polish: 'Nazwa przedmiotu*',
  english: 'Item Name*'
};

const ITEMNAMEPLACEHOLDER__TEXTLABEL = {
  polish: 'Wpisz nazwę przedmiotu…',
  english: 'Enter item name…'
};

const ITEMICONLABEL__TEXTLABEL = {
  polish: 'Ikona przedmiotu',
  english: 'Item Icon'
};

const ITEMICONSELECT__TEXTLABEL = {
  polish: 'Wybierz ikonę przedmiotu',
  english: 'Select item icon'
};

const ITEMICONLIVES__TEXTLABEL = {
  polish: 'Ikona systemu żyć',
  english: 'Lives system icon'
};

const CATEGORYLABEL__TEXTLABEL = {
  polish: 'Kategorie',
  english: 'Categories'
};

const CATEGORYTOOLTIP__TEXTLABEL = {
  polish: 'Przedmiot może należeć do wielu kategorii. Kliknij nazwę, aby ją edytować, lub kliknij próbnik, aby zmienić kolor.',
  english: 'An item can belong to multiple categories. Click a name to edit or click the swatch to change color.'
};

const NEWCATEGORYPLACEHOLDER__TEXTLABEL = {
  polish: '+ Dodaj nową kategorię (Enter)',
  english: '+ Add new category (Enter)'
};

const PRESET_CATEGORY_COLORS = [
  '#42f37d', '#00eeff', '#ffd000', '#ff9142', '#ff4d4f',
  '#d843ff', '#4378ff', '#00c48c', '#e056fd', '#bdcabe',
];

function CloseIcon({ className = '' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const STORYDESCLABEL__TEXTLABEL = {
  polish: 'Opis fabularny',
  english: 'Story Description'
};

const STORYDESCPLACEHOLDER__TEXTLABEL = {
  polish: 'Wprowadź fabularny kontekst przedmiotu…',
  english: 'Enter story context for the item…'
};

const EDUCDESCLABEL__TEXTLABEL = {
  polish: 'Opis dydaktyczny',
  english: 'Didactic Description'
};

const EDUCDESCPLACEHOLDER__TEXTLABEL = {
  polish: 'Opisz dydaktyczne zastosowanie lub zasady…',
  english: 'Describe educational usage or rules…'
};

/**
 * Krok 1/4 kreatora przedmiotu: Informacje podstawowe i kategorie.
 */
export default function ShopItemStepInfo({
  itemName,
  setItemName,
  storyDescription,
  setStoryDescription,
  didacticDescription,
  setDidacticDescription,
  currentIcon,
  setCurrentIcon,
  isEditingExtraLife = false,
  categories = [],
  onCategoryCheckChange,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  nameError = '',
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { showError } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Stan wyboru koloru kategorii (wyśrodkowany próbnik)
  const [colorPickerCategory, setColorPickerCategory] = useState(null);
  const [selectedCategoryColor, setSelectedCategoryColor] = useState('#42f37d');

  // Stan potwierdzenia usunięcia kategorii
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const handleStartEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleFinishEditCategory = async (categoryId, currentName) => {
    const trimmed = editingCategoryName.trim();
    setEditingCategoryId(null);
    if (!trimmed || trimmed === currentName) {
      return;
    }
    await onUpdateCategory(categoryId, trimmed);
  };

  const handleCategoryKeyDown = (event, categoryId, currentName) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleFinishEditCategory(categoryId, currentName);
    } else if (event.key === 'Escape') {
      setEditingCategoryId(null);
      setEditingCategoryName('');
    }
  };

  const handleCreateNewCategory = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const trimmed = newCategoryName.trim();
      if (!trimmed) {
        return;
      }
      const success = await onCreateCategory(trimmed);
      if (success !== false) {
        setNewCategoryName('');
      }
    }
  };

  const handleOpenColorPicker = (category, event) => {
    event.stopPropagation();
    setColorPickerCategory(category);
    setSelectedCategoryColor(category.color || '#42f37d');
  };

  const handleSaveCategoryColor = async () => {
    if (!colorPickerCategory) return;
    await onUpdateCategory(colorPickerCategory.id, {
      name: colorPickerCategory.name,
      color: selectedCategoryColor,
    });
    setColorPickerCategory(null);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeletingCategory(true);
    await onDeleteCategory(categoryToDelete.id);
    setIsDeletingCategory(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="shop-item-step shop-item-step--info">
      <div className="shop-item-form__field">
        <label className="shop-item-form__label" htmlFor="shop-item-name">
          {ITEMNAMELABEL__TEXTLABEL[LANGUAGE]}
        </label>
        <CharacterLimitedField value={itemName} maxLength={NAME_MAX_LENGTH}>
          <input
            id="shop-item-name"
            className={`shop-item-form__input ${nameError ? 'shop-item-form__input--error' : ''}`}
            value={itemName}
            placeholder={ITEMNAMEPLACEHOLDER__TEXTLABEL[LANGUAGE]}
            maxLength={NAME_MAX_LENGTH}
            onChange={(event) => setItemName(event.target.value)}
            autoFocus
          />
        </CharacterLimitedField>
        {nameError ? (
          <span className="shop-item-form__field-error" role="alert">{nameError}</span>
        ) : null}
      </div>

      <div className="shop-item-step-info__grid">
        <div className="shop-item-step-info__icon-col">
          <span className="shop-item-form__label">
            {ITEMICONLABEL__TEXTLABEL[LANGUAGE]}
            {isEditingExtraLife ? <InfoTooltip text={EXTRA_LIFE_ICON_EDIT_TOOLTIP} /> : null}
          </span>
          <div className="shop-item-step-info__icon-box">
            {isEditingExtraLife ? (
              <div
                className="shop-item-form__icon-locked"
                aria-disabled="true"
                title={EXTRA_LIFE_ICON_EDIT_TOOLTIP}
              >
                <LivesIcon size="lg" ariaLabel={ITEMICONLIVES__TEXTLABEL[LANGUAGE]} />
              </div>
            ) : (
              <EmojiPickerField
                className="shop-item-form__icon-picker"
                value={currentIcon}
                defaultEmoji="🥕"
                onChange={setCurrentIcon}
                ariaLabel={ITEMICONSELECT__TEXTLABEL[LANGUAGE]}
              />
            )}
          </div>
        </div>

        <div className="shop-item-step-info__categories-col">
          <div className="shop-item-form__label-wrapper">
            <span className="shop-item-form__label">
              {CATEGORYLABEL__TEXTLABEL[LANGUAGE]}
              <InfoTooltip text={CATEGORYTOOLTIP__TEXTLABEL[LANGUAGE]} />
            </span>
          </div>

          <div className="shop-item-step-info__categories-container">
            <ul className="shop-item-step-info__categories-list">
              {categories.map((category) => {
                const isEditing = editingCategoryId === category.id;
                return (
                  <li key={`category-${category.id}`} className="shop-item-step-info__category-item">
                    <label className="shop-item-step-info__category-checkbox-label">
                      <input
                        type="checkbox"
                        checked={category.checked === 1}
                        onChange={() => onCategoryCheckChange(category.id)}
                      />
                      <button
                        type="button"
                        className="shop-item-form__category-swatch-btn"
                        onClick={(event) => handleOpenColorPicker(category, event)}
                        title="Zmień kolor kategorii"
                        aria-label={`Zmień kolor kategorii ${category.name}`}
                      >
                        <span
                          className="shop-item-form__category-swatch"
                          style={{ backgroundColor: category.color ?? 'var(--color-accent)' }}
                          aria-hidden="true"
                        />
                      </button>
                    </label>

                    {isEditing ? (
                      <input
                        className="shop-item-step-info__category-inline-input"
                        value={editingCategoryName}
                        maxLength={ITEM_CATEGORY_NAME_MAX_LENGTH}
                        onChange={(event) => setEditingCategoryName(event.target.value)}
                        onBlur={() => handleFinishEditCategory(category.id, category.name)}
                        onKeyDown={(event) => handleCategoryKeyDown(event, category.id, category.name)}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="shop-item-step-info__category-name"
                        title="Kliknij, aby edytować nazwę"
                        onClick={() => handleStartEditCategory(category)}
                      >
                        {category.name}
                      </span>
                    )}

                    <button
                      type="button"
                      className="shop-item-step-info__category-delete-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        setCategoryToDelete(category);
                      }}
                      title={`Usuń kategorię ${category.name}`}
                      aria-label={`Usuń kategorię ${category.name}`}
                    >
                      <CloseIcon />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="shop-item-step-info__new-category-box">
              <input
                className="shop-item-form__input shop-item-step-info__new-category-input"
                placeholder={NEWCATEGORYPLACEHOLDER__TEXTLABEL[LANGUAGE]}
                maxLength={ITEM_CATEGORY_NAME_MAX_LENGTH}
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                onKeyDown={handleCreateNewCategory}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wyśrodkowany próbnik koloru kategorii */}
      {colorPickerCategory ? (
        <div
          className="shop-item-color-picker-overlay"
          onClick={() => setColorPickerCategory(null)}
          role="presentation"
        >
          <div
            className="shop-item-color-picker-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Wybierz kolor kategorii"
          >
            <div className="shop-item-color-picker-dialog__header">
              <h3 className="shop-item-color-picker-dialog__title">Wybierz kolor kategorii</h3>
              <p className="shop-item-color-picker-dialog__subtitle">{colorPickerCategory.name}</p>
            </div>

            <div className="shop-item-color-picker-dialog__body">
              <div className="shop-item-color-picker-dialog__swatches">
                {PRESET_CATEGORY_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    className={`shop-item-color-picker-dialog__swatch ${selectedCategoryColor.toLowerCase() === hex.toLowerCase() ? 'shop-item-color-picker-dialog__swatch--active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setSelectedCategoryColor(hex)}
                    aria-label={`Kolor ${hex}`}
                  />
                ))}
              </div>

              <div className="shop-item-color-picker-dialog__custom-row">
                <label htmlFor="custom-category-color" className="shop-item-color-picker-dialog__custom-label">
                  Własny kolor:
                </label>
                <div className="shop-item-color-picker-dialog__custom-input-wrap">
                  <input
                    id="custom-category-color"
                    type="color"
                    className="shop-item-color-picker-dialog__color-input"
                    value={selectedCategoryColor}
                    onChange={(event) => setSelectedCategoryColor(event.target.value)}
                  />
                  <span className="shop-item-color-picker-dialog__hex-preview">{selectedCategoryColor}</span>
                </div>
              </div>
            </div>

            <div className="shop-item-color-picker-dialog__footer">
              <button
                type="button"
                className="shop-item-modal-action-btn shop-item-modal-action-btn--ghost"
                onClick={() => setColorPickerCategory(null)}
              >
                Anuluj
              </button>
              <button
                type="button"
                className="shop-item-modal-action-btn shop-item-modal-action-btn--primary"
                onClick={handleSaveCategoryColor}
              >
                Zapisz kolor
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Wyśrodkowany dialog potwierdzenia usunięcia kategorii */}
      {categoryToDelete ? (
        <div
          className="shop-item-color-picker-overlay"
          onClick={() => setCategoryToDelete(null)}
          role="presentation"
        >
          <div
            className="shop-item-color-picker-dialog shop-item-color-picker-dialog--delete"
            onClick={(event) => event.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-label="Potwierdzenie usunięcia kategorii"
          >
            <div className="shop-item-color-picker-dialog__header">
              <h3 className="shop-item-color-picker-dialog__title">Usuń kategorię</h3>
              <p className="shop-item-color-picker-dialog__subtitle">
                Czy na pewno chcesz usunąć kategorię <strong>"{categoryToDelete.name}"</strong>?
              </p>
            </div>

            <div className="shop-item-color-picker-dialog__footer">
              <button
                type="button"
                className="shop-item-modal-action-btn shop-item-modal-action-btn--ghost"
                onClick={() => setCategoryToDelete(null)}
                disabled={isDeletingCategory}
              >
                Anuluj
              </button>
              <button
                type="button"
                className="shop-item-modal-action-btn shop-item-modal-action-btn--danger"
                onClick={handleConfirmDeleteCategory}
                disabled={isDeletingCategory}
              >
                Usuń kategorię
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="shop-item-form__field">
        <label className="shop-item-form__label" htmlFor="shop-item-story">
          {STORYDESCLABEL__TEXTLABEL[LANGUAGE]}
        </label>
        <CharacterLimitedField value={storyDescription} maxLength={SHORT_DESCRIPTION_MAX_LENGTH}>
          <textarea
            id="shop-item-story"
            className="shop-item-form__textarea"
            placeholder={STORYDESCPLACEHOLDER__TEXTLABEL[LANGUAGE]}
            value={storyDescription}
            maxLength={SHORT_DESCRIPTION_MAX_LENGTH}
            onChange={(event) => setStoryDescription(event.target.value)}
          />
        </CharacterLimitedField>
      </div>

      <div className="shop-item-form__field">
        <label className="shop-item-form__label" htmlFor="shop-item-edu">
          {EDUCDESCLABEL__TEXTLABEL[LANGUAGE]}
        </label>
        <CharacterLimitedField value={didacticDescription} maxLength={SHORT_DESCRIPTION_MAX_LENGTH}>
          <textarea
            id="shop-item-edu"
            className="shop-item-form__textarea"
            placeholder={EDUCDESCPLACEHOLDER__TEXTLABEL[LANGUAGE]}
            value={didacticDescription}
            maxLength={SHORT_DESCRIPTION_MAX_LENGTH}
            onChange={(event) => setDidacticDescription(event.target.value)}
          />
        </CharacterLimitedField>
      </div>
    </div>
  );
}
