import { useCallback, useEffect, useState } from 'react';

import { CharacterLimitedField, Modal, useToast } from '../../../../components/ui/index.js';
import { ITEM_CATEGORY_NAME_MAX_LENGTH } from '../../../../constants/fieldLimits.js';
import {
  createGroupItemCategory,
  deleteGroupItemCategory,
  updateGroupItemCategory,
} from '../../../../services/itemCategories.api.js';
import './ShopCategoriesModal.css';

const EMPTY_FORM = {
  name: '',
  color: '#42f37d',
};

/**
 * @param {{
 *   isOpen: boolean,
 *   groupId: string | number,
 *   categories: import('../../../services/itemCategories.api.js').ItemCategory[],
 *   onClose: () => void,
 *   onChanged?: () => void,
 * }} props
 */
export default function ShopCategoriesModal({
  isOpen,
  groupId,
  categories,
  onClose,
  onChanged,
}) {
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
      showError(result.error ?? 'Nie udało się zapisać kategorii.');
      return;
    }

    showSuccess(editingId === 'new' ? 'Kategoria została utworzona.' : 'Kategoria została zaktualizowana.');
    setEditingId(null);
    setForm(EMPTY_FORM);
    onChanged?.();
  }, [editingId, form.color, form.name, groupId, onChanged, showError, showSuccess]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteGroupItemCategory(groupId, deleteTarget.id);
    setIsSubmitting(false);

    if (!result.ok) {
      showError(result.error ?? 'Nie udało się usunąć kategorii.');
      return;
    }

    showSuccess('Kategoria została usunięta.');
    setDeleteTarget(null);
    onChanged?.();
  }, [deleteTarget, groupId, onChanged, showError, showSuccess]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kategorie przedmiotów"
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
                  Edytuj
                </button>
                <button
                  type="button"
                  className="shop-categories-modal__btn shop-categories-modal__btn--danger"
                  onClick={() => setDeleteTarget(category)}
                  disabled={isSubmitting}
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
          {categories.length === 0 ? (
            <li className="shop-categories-modal__empty">Brak kategorii w tej grupie.</li>
          ) : null}
        </ul>

        {deleteTarget ? (
          <div className="shop-categories-modal__confirm" role="alertdialog" aria-labelledby="shop-category-delete-title">
            <p id="shop-category-delete-title" className="shop-categories-modal__confirm-text">
              Czy na pewno chcesz usunąć kategorię „{deleteTarget.name}”?
            </p>
            <div className="shop-categories-modal__confirm-actions">
              <button
                type="button"
                className="shop-categories-modal__btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isSubmitting}
              >
                Anuluj
              </button>
              <button
                type="button"
                className="shop-categories-modal__btn shop-categories-modal__btn--danger"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                Usuń kategorię
              </button>
            </div>
          </div>
        ) : null}

        {editingId ? (
          <div className="shop-categories-modal__editor">
            <label className="shop-categories-modal__field">
              <span>Nazwa</span>
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
              <span>Kolor</span>
              <input
                type="color"
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
              />
            </label>
            <div className="shop-categories-modal__editor-actions">
              <button type="button" className="shop-categories-modal__btn" onClick={() => setEditingId(null)}>
                Anuluj
              </button>
              <button
                type="button"
                className="shop-categories-modal__btn shop-categories-modal__btn--primary"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                Zapisz
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="shop-categories-modal__add" onClick={startCreate}>
            Dodaj kategorię
          </button>
        )}
      </div>
    </Modal>
  );
}
