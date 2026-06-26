import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import IconPicker from '../../../../components/ui/IconPicker/IconPicker.jsx';
import { fetchIconCatalog } from '../../../../services/icons.api.js';
import { calculateDefaultRankDiscount } from '../../../../utils/ranks/rankDiscount.js';
import { validateDiscountPercentInput, validateWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import RankUnlockItemChecklist from '../shared/RankUnlockItemChecklist.jsx';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  name: '',
  iconFile: '',
  costAmount: '',
  discount: '',
  storyDescription: '',
  selectedShopItems: [],
};

function normalizeRankShopItemIds(items = []) {
  return items.map((item) => String(item).trim()).filter(Boolean);
}

export default function RankFormModal({
  isOpen,
  rank,
  existingRanks = [],
  shopCatalogItems = [],
  onClose,
  onConfirm,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [iconCatalog, setIconCatalog] = useState([]);
  const isEdit = Boolean(rank);

  const rankRefs = useMemo(
    () => existingRanks.map((entry) => ({
      dbId: entry.dbId,
      name: entry.name,
      shopItems: entry.shopItems ?? [],
    })),
    [existingRanks],
  );

  const catalogItems = useMemo(
    () => shopCatalogItems.map((item) => ({
      id: String(item.id),
      name: item.name,
    })),
    [shopCatalogItems],
  );

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
        selectedShopItems: normalizeRankShopItemIds(rank.shopItems ?? []),
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

  const handleShopItemToggle = useCallback((itemId, checked) => {
    setForm((prev) => {
      const next = new Set(prev.selectedShopItems);
      if (checked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return { ...prev, selectedShopItems: Array.from(next) };
    });
  }, []);

  const handleConfirm = () => {
    if (!isValid) return;

    const catalogIds = new Set(catalogItems.map((item) => String(item.id)));
    const shopItems = form.selectedShopItems.filter((itemId) => catalogIds.has(itemId));

    onConfirm?.({
      name: form.name.trim(),
      iconFile: form.iconFile.trim(),
      costAmount: costValidation.value,
      discount: discountValidation.value,
      storyDescription: form.storyDescription.trim(),
      shopItems,
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
          <span className="rewards-modal__label">Odblokowane przedmioty</span>
          <p className="rewards-modal__field-hint">
            Przedmioty niezaznaczone są domyślnie dostępne dla wszystkich. Wyższa ranga odblokowuje też przedmioty niższych rang.
          </p>
          <RankUnlockItemChecklist
            catalogItems={catalogItems}
            ranks={rankRefs}
            currentRankDbId={rank?.dbId ?? null}
            selectedIds={form.selectedShopItems}
            onToggle={handleShopItemToggle}
          />
        </div>
      </div>
    </Modal>
  );
}
