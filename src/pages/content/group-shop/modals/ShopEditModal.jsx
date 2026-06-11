import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import './shopModals.css';

const EMPTY_FORM = {
  name: '',
  basePrice: '',
  storyDescription: '',
  didacticDescription: '',
  stockQuantity: '',
  perStudentLimit: '',
};

export default function ShopEditModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen || !item) {
      return;
    }

    setForm({
      name: item.name ?? '',
      basePrice: String(item.priceAmount ?? ''),
      storyDescription: item.storyDescription ?? '',
      didacticDescription: item.didacticDescription ?? '',
      stockQuantity: item.stockQuantity === null || item.stockQuantity === undefined ? '' : String(item.stockQuantity),
      perStudentLimit: item.perStudentLimit === null || item.perStudentLimit === undefined ? '' : String(item.perStudentLimit),
    });
  }, [isOpen, item]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleConfirm = () => {
    if (!item) {
      return;
    }

    /** @type {Record<string, unknown>} */
    const payload = {};

    const name = form.name.trim();
    if (name) {
      payload.name = name;
    }

    if (form.basePrice.trim() !== '') {
      payload.basePrice = Number(form.basePrice);
    }

    payload.storyDescription = form.storyDescription.trim();
    payload.educationalDescription = form.didacticDescription.trim();

    if (form.stockQuantity.trim() === '') {
      payload.stockQuantity = null;
    } else {
      payload.stockQuantity = Number(form.stockQuantity);
    }

    if (form.perStudentLimit.trim() === '') {
      payload.perStudentLimit = null;
    } else {
      payload.perStudentLimit = Number(form.perStudentLimit);
    }

    onConfirm?.(item.id, payload);
  };

  if (!item) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj produkt"
      onConfirm={handleConfirm}
      confirmLabel="Zapisz zmiany"
      size="md"
      className="shop-modal"
    >
      <div className="shop-edit-form">
        <label className="shop-edit-form__field">
          <span className="shop-edit-form__label">Nazwa</span>
          <input className="shop-edit-form__input" value={form.name} onChange={handleChange('name')} />
        </label>
        <label className="shop-edit-form__field">
          <span className="shop-edit-form__label">Cena bazowa</span>
          <input className="shop-edit-form__input" type="number" min="0" value={form.basePrice} onChange={handleChange('basePrice')} />
        </label>
        <label className="shop-edit-form__field">
          <span className="shop-edit-form__label">Opis fabularny</span>
          <textarea className="shop-edit-form__textarea" value={form.storyDescription} onChange={handleChange('storyDescription')} rows={3} />
        </label>
        <label className="shop-edit-form__field">
          <span className="shop-edit-form__label">Opis edukacyjny</span>
          <textarea className="shop-edit-form__textarea" value={form.didacticDescription} onChange={handleChange('didacticDescription')} rows={3} />
        </label>
        <label className="shop-edit-form__field">
          <span className="shop-edit-form__label">Stan magazynowy (puste = bez limitu)</span>
          <input className="shop-edit-form__input" type="number" min="0" value={form.stockQuantity} onChange={handleChange('stockQuantity')} />
        </label>
        <label className="shop-edit-form__field">
          <span className="shop-edit-form__label">Limit na studenta (puste = bez limitu)</span>
          <input className="shop-edit-form__input" type="number" min="0" value={form.perStudentLimit} onChange={handleChange('perStudentLimit')} />
        </label>
      </div>
    </Modal>
  );
}
