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
  polish: 'Przedmiot może należeć do wielu kategorii. Kliknij nazwę, aby ją edytować i zatwierdź Enterem. Usunięcie nazwy usunie kategorię.',
  english: 'An item can belong to multiple categories. Click a name to edit and press Enter. Clearing the name deletes the category.'
};

const NEWCATEGORYPLACEHOLDER__TEXTLABEL = {
  polish: '+ Dodaj nową kategorię (Enter)',
  english: '+ Add new category (Enter)'
};

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

  const handleStartEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleFinishEditCategory = async (categoryId, currentName) => {
    const trimmed = editingCategoryName.trim();
    setEditingCategoryId(null);
    if (trimmed === currentName) {
      return;
    }
    if (trimmed.length === 0) {
      // Usunięcie całej nazwy powoduje usunięcie kategorii
      await onDeleteCategory(categoryId);
    } else {
      await onUpdateCategory(categoryId, trimmed);
    }
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
                      <span
                        className="shop-item-form__category-swatch"
                        style={{ backgroundColor: category.color ?? 'var(--color-accent)' }}
                        aria-hidden="true"
                      />
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
