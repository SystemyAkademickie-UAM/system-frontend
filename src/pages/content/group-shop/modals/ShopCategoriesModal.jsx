import { useCallback, useEffect, useState } from 'react';

import { CharacterLimitedField, Modal, useToast } from '../../../../components/ui/index.js';
import { ITEM_CATEGORY_NAME_MAX_LENGTH } from '../../../../constants/fieldLimits.js';
import {
  createGroupItemCategory,
  deleteGroupItemCategory,
  updateGroupItemCategory,
} from '../../../../services/itemCategories.api.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './ShopCategoriesModal.css';

const EMPTY_FORM = {
  name: '',
  color: '#42f37d',
};

const CATEGORIES_MODAL_TITLE__TEXTLABEL = {
  polish: 'Kategorie przedmiotów',
  english: 'Item Categories'
};

const EDIT_BUTTON__TEXTLABEL = {
  polish: 'Edytuj',
  english: 'Edit'
};

const DELETE_BUTTON__TEXTLABEL = {
  polish: 'Usuń',
  english: 'Delete'
};

const NO_CATEGORIES__TEXTLABEL = {
  polish: 'Brak kategorii w tej grupie.',
  english: 'No categories in this group.'
};

const DELETE_CONFIRM_TEXT__TEXTLABEL = {
  polish: 'Czy na pewno chcesz usunąć kategorię "{name}"?',
  english: 'Are you sure you want to delete category "{name}"?'
};

const CANCEL_BUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const DELETE_CATEGORY_BUTTON__TEXTLABEL = {
  polish: 'Usuń kategorię',
  english: 'Delete Category'
};

const NAME_FIELD_LABEL__TEXTLABEL = {
  polish: 'Nazwa*',
  english: 'Name*'
};

const COLOR_FIELD_LABEL__TEXTLABEL = {
  polish: 'Kolor',
  english: 'Color'
};

const SAVE_BUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save'
};

const ADD_CATEGORY_BUTTON__TEXTLABEL = {
  polish: 'Dodaj kategorię',
  english: 'Add Category'
};

const SUCCESS_CREATE__TEXTLABEL = {
  polish: 'Kategoria została utworzona.',
  english: 'Category has been created.'
};

const SUCCESS_UPDATE__TEXTLABEL = {
  polish: 'Kategoria została zaktualizowana.',
  english: 'Category has been updated.'
};

const SUCCESS_DELETE__TEXTLABEL = {
  polish: 'Kategoria została usunięta.',
  english: 'Category has been deleted.'
};

const ERROR_SAVE__TEXTLABEL = {
  polish: 'Nie udało się zapisać kategorii.',
  english: 'Failed to save category.'
};

const ERROR_DELETE__TEXTLABEL = {
  polish: 'Nie udało się usunąć kategorii.',
  english: 'Failed to delete category.'
};

export default function ShopCategoriesModal({
  isOpen,
  groupId,
  categories,
  onClose,
  onChanged,
}) {
  const LANGUAGE = READLANGUAGECOOKIE();
  const { showSuccess, showError } = useToast();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setEditingId(null);
      setForm(EMPTY_FORM);
      setDeleteTarget(null);
    }
  }, [isOpen]);

  const startCreate = () => {
    setDeleteTarget(null);
    setEditingId('new');
    setForm(EMPTY_FORM);
  };

  const startEdit = (category) => {
    setDeleteTarget(null);
    setEditingId(category.id);
    setForm({
      name: category.name,
      color: category.color ?? '#42f37d',
    });
  };

  const handleSave = useCallback(async () => {
    const name = form.name.trim();
    if (!name) {
      showError('Podaj nazwę kategorii.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name,
      color: form.color || null,
    };

    const result = editingId === 'new'
      ? await createGroupItemCategory(groupId, payload)
      : await updateGroupItemCategory(groupId, editingId, payload);

    setIsSubmitting(false);

    if (!result.ok) {
      showError(ERROR_SAVE__TEXTLABEL[LANGUAGE]);
      return;
    }

    showSuccess(editingId === 'new'
      ? SUCCESS_CREATE__TEXTLABEL[LANGUAGE]
      : SUCCESS_UPDATE__TEXTLABEL[LANGUAGE]);
    setEditingId(null);
    setForm(EMPTY_FORM);
    onChanged?.();
  }, [editingId, form.color, form.name, groupId, onChanged, showError, showSuccess, LANGUAGE]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteGroupItemCategory(groupId, deleteTarget.id);
    setIsSubmitting(false);

    if (!result.ok) {
      showError(ERROR_DELETE__TEXTLABEL[LANGUAGE]);
      return;
    }

    showSuccess(SUCCESS_DELETE__TEXTLABEL[LANGUAGE]);
    setDeleteTarget(null);
    onChanged?.();
  }, [deleteTarget, groupId, onChanged, showError, showSuccess, LANGUAGE]);

  const deleteConfirmText = deleteTarget
    ? DELETE_CONFIRM_TEXT__TEXTLABEL[LANGUAGE].replace('{name}', deleteTarget.name)
    : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={CATEGORIES_MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      size="md"
      showFooter={false}
      className="shop-categories-modal"
    >
      <div className="shop-categories-modal__content">
        <ul className="shop-categories-modal__list">
          {categories.map((category) => (
            <li key={category.id} className="shop-categories-modal__item">
              <span
                className="shop-categories-modal__swatch"
                style={{ backgroundColor: category.color ?? '#42f37d' }}
                aria-hidden="true"
              />
              <span className="shop-categories-modal__name">{category.name}</span>
              <div className="shop-categories-modal__actions">
                <button type="button" className="shop-categories-modal__btn" onClick={() => startEdit(category)}>
                  {EDIT_BUTTON__TEXTLABEL[LANGUAGE]}
                </button>
                <button
                  type="button"
                  className="shop-categories-modal__btn shop-categories-modal__btn--danger"
                  onClick={() => setDeleteTarget(category)}
                  disabled={isSubmitting}
                >
                  {DELETE_BUTTON__TEXTLABEL[LANGUAGE]}
                </button>
              </div>
            </li>
          ))}
          {categories.length === 0 ? (
            <li className="shop-categories-modal__empty">{NO_CATEGORIES__TEXTLABEL[LANGUAGE]}</li>
          ) : null}
        </ul>

        {deleteTarget ? (
          <div className="shop-categories-modal__confirm" role="alertdialog" aria-labelledby="shop-category-delete-title">
            <p id="shop-category-delete-title" className="shop-categories-modal__confirm-text">
              {deleteConfirmText}
            </p>
            <div className="shop-categories-modal__confirm-actions">
              <button
                type="button"
                className="shop-categories-modal__btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isSubmitting}
              >
                {CANCEL_BUTTON__TEXTLABEL[LANGUAGE]}
              </button>
              <button
                type="button"
                className="shop-categories-modal__btn shop-categories-modal__btn--danger"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {DELETE_CATEGORY_BUTTON__TEXTLABEL[LANGUAGE]}
              </button>
            </div>
          </div>
        ) : null}

        {editingId ? (
          <div className="shop-categories-modal__editor">
            <label className="shop-categories-modal__field">
              <span>{NAME_FIELD_LABEL__TEXTLABEL[LANGUAGE]}</span>
              <CharacterLimitedField value={form.name} maxLength={ITEM_CATEGORY_NAME_MAX_LENGTH}>
                <input
                  type="text"
                  value={form.name}
                  maxLength={ITEM_CATEGORY_NAME_MAX_LENGTH}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </CharacterLimitedField>
            </label>
            <label className="shop-categories-modal__field shop-categories-modal__field--color">
              <span>{COLOR_FIELD_LABEL__TEXTLABEL[LANGUAGE]}</span>
              <input
                type="color"
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
              />
            </label>
            <div className="shop-categories-modal__editor-actions">
              <button type="button" className="shop-categories-modal__btn" onClick={() => setEditingId(null)}>
                {CANCEL_BUTTON__TEXTLABEL[LANGUAGE]}
              </button>
              <button
                type="button"
                className="shop-categories-modal__btn shop-categories-modal__btn--primary"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {SAVE_BUTTON__TEXTLABEL[LANGUAGE]}
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="shop-categories-modal__add" onClick={startCreate}>
            {ADD_CATEGORY_BUTTON__TEXTLABEL[LANGUAGE]}
          </button>
        )}
      </div>
    </Modal>
  );
}
