import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import IconPicker from '../../../../components/ui/IconPicker/IconPicker.jsx';
import { fetchIconCatalog } from '../../../../services/icons.api.js';
import { calculateDefaultRankDiscount } from '../shared/rankDiscountUtils.js';
import { validateDiscountPercentInput, validateWholeNumberInput } from '../shared/rewardsNumericValidation.js';
import '../../group-rewards/shared/rewardsModals.css';

function formatShopItems(items) {
  if (!items || !Array.isArray(items)) return '';
  return items.join('\n');
}

function parseShopItems(text) {
  if (!text || typeof text !== 'string') return [];
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

const EMPTY_FORM = {
  name: '',
  iconFile: '',
  costAmount: '',
  discount: '',
  storyDescription: '',
  shopItems: '',
};

export default function RankFormModal({
  isOpen,
  rank,
  existingRanks = [],
  onClose,
  onConfirm,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [iconCatalog, setIconCatalog] = useState([]);
  const isEdit = Boolean(rank);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    fetchIconCatalog().then((catalog) => {
      if (!cancelled) setIconCatalog(catalog);
    });
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (rank) {
      setForm({
        name: rank.name,
        iconFile: rank.iconFile,
        costAmount: String(rank.costAmount),
        discount: rank.discount === 0 || rank.discount ? String(rank.discount) : '',
        storyDescription: rank.storyDescription,
        shopItems: formatShopItems(rank.shopItems),
      });
      return;
    }

    setForm({
      ...EMPTY_FORM,
      discount: String(calculateDefaultRankDiscount(existingRanks)),
    });
  }, [isOpen, rank, existingRanks]);

  const costValidation = useMemo(
    () => validateWholeNumberInput(form.costAmount),
    [form.costAmount],
  );

  const discountValidation = useMemo(
    () => validateDiscountPercentInput(form.discount),
    [form.discount],
  );

  const isValid = useMemo(() => (
    form.name.trim()
    && form.iconFile.trim()
    && form.storyDescription.trim()
    && costValidation.valid
    && discountValidation.valid
  ), [form, costValidation.valid, discountValidation.valid]);

  const showCostError = form.costAmount.trim() !== '' && !costValidation.valid;
  const showDiscountError = form.discount.trim() !== '' && !discountValidation.valid;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleConfirm = () => {
    if (!isValid) return;

    onConfirm?.({
      name: form.name.trim(),
      iconFile: form.iconFile.trim(),
      costAmount: costValidation.value,
      discount: discountValidation.value,
      storyDescription: form.storyDescription.trim(),
      shopItems: parseShopItems(form.shopItems),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edytuj rangę' : 'Dodaj rangę'}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__field">
          <label htmlFor="rank-name" className="rewards-modal__label">Nazwa</label>
          <input
            id="rank-name"
            type="text"
            className="rewards-modal__input"
            value={form.name}
            onChange={handleChange('name')}
          />
        </div>

        <div className="rewards-modal__field">
          <label className="rewards-modal__label">Ikona</label>
          <IconPicker
            icons={iconCatalog}
            value={form.iconFile}
            onChange={(iconId) => setForm((prev) => ({ ...prev, iconFile: iconId }))}
            name="rank-icon"
          />
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="rank-cost" className="rewards-modal__label">Koszt</label>
          <input
            id="rank-cost"
            type="text"
            inputMode="numeric"
            className={[
              'rewards-modal__input',
              showCostError ? 'rewards-modal__input--error' : '',
            ].filter(Boolean).join(' ')}
            value={form.costAmount}
            onChange={handleChange('costAmount')}
            placeholder="np. 100"
            aria-invalid={showCostError}
            aria-describedby={showCostError ? 'rank-cost-error' : undefined}
          />
          {showCostError ? (
            <p id="rank-cost-error" className="rewards-modal__field-error" role="alert">
              {costValidation.error}
            </p>
          ) : null}
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="rank-discount" className="rewards-modal__label">Zniżka w sklepie (%)</label>
          <input
            id="rank-discount"
            type="text"
            inputMode="decimal"
            className={[
              'rewards-modal__input',
              showDiscountError ? 'rewards-modal__input--error' : '',
            ].filter(Boolean).join(' ')}
            value={form.discount}
            onChange={handleChange('discount')}
            placeholder="np. 15"
            aria-invalid={showDiscountError}
            aria-describedby={showDiscountError ? 'rank-discount-error' : 'rank-discount-hint'}
          />
          <p id="rank-discount-hint" className="rewards-modal__field-hint">
            Domyślnie: 5% + zniżka najwyższej rangi. Możesz wyczyścić pole.
          </p>
          {showDiscountError ? (
            <p id="rank-discount-error" className="rewards-modal__field-error" role="alert">
              {discountValidation.error}
            </p>
          ) : null}
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="rank-story" className="rewards-modal__label">Status fabularny</label>
          <textarea
            id="rank-story"
            className="rewards-modal__textarea"
            value={form.storyDescription}
            onChange={handleChange('storyDescription')}
          />
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="rank-items" className="rewards-modal__label">
            Odblokowane przedmioty (jeden w linii)
          </label>
          <textarea
            id="rank-items"
            className="rewards-modal__textarea"
            value={form.shopItems}
            onChange={handleChange('shopItems')}
            placeholder={'Podstawowy miecz\nPlecak podróżnika'}
          />
        </div>
      </div>
    </Modal>
  );
}
