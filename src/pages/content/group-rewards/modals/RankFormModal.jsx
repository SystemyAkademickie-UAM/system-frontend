import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, TextField } from '../../../../components/ui/index.js';
import EmojiPickerField from '../../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import { DEFAULT_RANK_EMOJI } from '../../../../utils/ranks/rankBadgeIcon.js';
import { validateWholeNumberInput, sanitizeWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import RewardsCurrencyLabel from '../shared/RewardsCurrencyLabel.jsx';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  name: '',
  icon: DEFAULT_RANK_EMOJI,
  costAmount: '',
  storyDescription: '',
};

export default function RankFormModal({
  isOpen,
  rank,
  onClose,
  onConfirm,
  onOpenDiscountModal,
  onOpenUnlockItemsModal,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(rank);

  useEffect(() => {
    if (!isOpen) return;

    if (rank) {
      setForm({
        name: rank.name,
        icon: rank.icon || rank.iconFile || DEFAULT_RANK_EMOJI,
        costAmount: String(rank.costAmount),
        storyDescription: rank.storyDescription,
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, rank]);

  const costValidation = useMemo(
    () => validateWholeNumberInput(form.costAmount),
    [form.costAmount],
  );

  const isValid = useMemo(() => (
    form.name.trim()
    && form.icon.trim()
    && form.storyDescription.trim()
    && costValidation.valid
  ), [form, costValidation.valid]);

  const showCostError = form.costAmount.trim() !== '' && !costValidation.valid;

  const handleChange = (field) => (event) => {
    const nextValue = field === 'costAmount'
      ? sanitizeWholeNumberInput(event.target.value)
      : event.target.value;
    setForm((prev) => ({ ...prev, [field]: nextValue }));
  };

  const handleConfirm = () => {
    if (!isValid) return;

    onConfirm?.({
      name: form.name.trim(),
      icon: form.icon.trim(),
      iconFile: form.icon.trim(),
      costAmount: costValidation.value,
      storyDescription: form.storyDescription.trim(),
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
        <div className="rewards-modal__row rewards-modal__row--name-reward">
          <TextField
            id="rank-name"
            label="Nazwa*"
            fieldKind="name"
            value={form.name}
            onChange={handleChange('name')}
            className="rewards-modal__field"
            inputClassName="rewards-modal__input"
          />

          <div className="rewards-modal__field">
            <RewardsCurrencyLabel htmlFor="rank-cost">Koszt*</RewardsCurrencyLabel>
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
        </div>

        <div className="rewards-modal__row rewards-modal__row--icon-only">
          <EmojiPickerField
            className="rewards-modal__field rewards-modal__field--icon"
            label="Ikona"
            value={form.icon}
            defaultEmoji={DEFAULT_RANK_EMOJI}
            onChange={(emoji) => setForm((prev) => ({ ...prev, icon: emoji }))}
            ariaLabel="Wybierz emoji rangi"
          />
        </div>

        <TextField
          id="rank-story"
          label="Status fabularny*"
          fieldKind="shortDescription"
          value={form.storyDescription}
          onChange={handleChange('storyDescription')}
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        {isEdit && (onOpenDiscountModal || onOpenUnlockItemsModal) ? (
          <div className="rewards-modal__field rewards-modal__field--inline-actions">
            <span className="rewards-modal__label">Dodatkowe ustawienia</span>
            <div className="rewards-modal__inline-actions">
              {onOpenDiscountModal ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onOpenDiscountModal(rank)}
                >
                  Zniżka w sklepie
                </Button>
              ) : null}
              {onOpenUnlockItemsModal ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onOpenUnlockItemsModal(rank)}
                >
                  Odblokowane przedmioty
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
