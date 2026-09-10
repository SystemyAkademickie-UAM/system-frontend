import { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Modal, TextField } from '../../../../components/ui/index.js';
import EmojiPickerField from '../../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import { DEFAULT_RANK_EMOJI } from '../../../../utils/ranks/rankBadgeIcon.js';
import { validateWholeNumberInput, sanitizeWholeNumberInput, validateDiscountPercentInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import RewardsCurrencyLabel from '../shared/RewardsCurrencyLabel.jsx';
import '../../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const EDITMODALTITLE__TEXTLABEL = {
  polish: 'Edytuj rangę',
  english: 'Edit rank'
};

const ADDMODALTITLE__TEXTLABEL = {
  polish: 'Dodaj rangę',
  english: 'Add rank'
};

const NAMELABEL__TEXTLABEL = {
  polish: 'Nazwa*',
  english: 'Name*'
};

const COSTLABEL__TEXTLABEL = {
  polish: 'Koszt*',
  english: 'Cost*'
};

const COSTPLACEHOLDER__TEXTLABEL = {
  polish: 'np. 100',
  english: 'e.g. 100'
};

const ICONLABEL__TEXTLABEL = {
  polish: 'Ikona',
  english: 'Icon'
};

const ICONARIA__TEXTLABEL = {
  polish: 'Wybierz emoji rangi',
  english: 'Choose rank emoji'
};

const STORYLABEL__TEXTLABEL = {
  polish: 'Status fabularny*',
  english: 'Story status*'
};

const EXTRASETTINGS__TEXTLABEL = {
  polish: 'Dodatkowe ustawienia',
  english: 'Additional settings'
};

const DISCOUNTBTN__TEXTLABEL = {
  polish: 'Zniżka w sklepie',
  english: 'Shop discount'
};

const UNLOCKBTN__TEXTLABEL = {
  polish: 'Odblokowane przedmioty',
  english: 'Unlocked items'
};

const DISCOUNTLABEL__TEXTLABEL = {
  polish: 'Zniżka w sklepie (%)',
  english: 'Shop discount (%)'
};

const DISCOUNTHINT__TEXTLABEL = {
  polish: 'Procentowa obniżka ceny produktów w sklepie dla uczestników posiadających tę rangę. Ustaw 0, jeśli ranga nie przyznaje zniżki.',
  english: 'Percentage price reduction for shop products for participants who have this rank. Set 0 if the rank does not provide a discount.'
};

const EMPTY_FORM = {
  name: '',
  icon: DEFAULT_RANK_EMOJI,
  costAmount: '',
  storyDescription: '',
  discount: '0',
};

export default function RankFormModal({
  isOpen,
  rank,
  onClose,
  onConfirm,
  onOpenDiscountModal,
  onOpenUnlockItemsModal,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
        discount: String(rank.discount ?? 0),
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, rank]);

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
    && form.icon.trim()
    && form.storyDescription.trim()
    && costValidation.valid
    && discountValidation.valid
  ), [form, costValidation.valid, discountValidation.valid]);

  const showCostError = form.costAmount.trim() !== '' && !costValidation.valid;
  const showDiscountError = form.discount.trim() !== '' && !discountValidation.valid;

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
      discount: discountValidation.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? EDITMODALTITLE__TEXTLABEL[LANGUAGE] : ADDMODALTITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        {/* Sekcja 1: Podstawowe informacje */}
        <div className="rewards-modal__grid-main">
          <div className="rewards-modal__icon-box">
            <EmojiPickerField
              className="rewards-modal__field rewards-modal__field--icon"
              label={ICONLABEL__TEXTLABEL[LANGUAGE]}
              value={form.icon}
              defaultEmoji={DEFAULT_RANK_EMOJI}
              onChange={(emoji) => setForm((prev) => ({ ...prev, icon: emoji }))}
              ariaLabel={ICONARIA__TEXTLABEL[LANGUAGE]}
            />
          </div>

          <div className="rewards-modal__fields-stack">
            <div className="rewards-modal__row rewards-modal__row--name-reward">
              <TextField
                id="rank-name"
                label={NAMELABEL__TEXTLABEL[LANGUAGE]}
                fieldKind="name"
                value={form.name}
                onChange={handleChange('name')}
                className="rewards-modal__field"
                inputClassName="rewards-modal__input"
              />

              <div className="rewards-modal__field">
                <RewardsCurrencyLabel htmlFor="rank-cost">{COSTLABEL__TEXTLABEL[LANGUAGE]}</RewardsCurrencyLabel>
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
                  placeholder={COSTPLACEHOLDER__TEXTLABEL[LANGUAGE]}
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
          </div>
        </div>

        <Divider className="rewards-modal__divider" />

        {/* Sekcja 2: Status fabularny */}
        <TextField
          id="rank-story"
          label={STORYLABEL__TEXTLABEL[LANGUAGE]}
          fieldKind="shortDescription"
          value={form.storyDescription}
          onChange={handleChange('storyDescription')}
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        {/* Sekcja 3: Sklep / Zniżki */}
        {!isEdit && (
          <>
            <Divider className="rewards-modal__divider" />
            <div className="rewards-modal__field">
              <label htmlFor="rank-discount" className="rewards-modal__label">
                {DISCOUNTLABEL__TEXTLABEL[LANGUAGE]}
              </label>
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
                placeholder='0'
                aria-invalid={showDiscountError}
                aria-describedby={showDiscountError ? 'rank-discount-error' : 'rank-discount-hint'}
              />
              <p id="rank-discount-hint" className="rewards-modal__field-hint">
                {DISCOUNTHINT__TEXTLABEL[LANGUAGE]}
              </p>
              {showDiscountError ? (
                <p id="rank-discount-error" className="rewards-modal__field-error" role="alert">
                  {discountValidation.error}
                </p>
              ) : null}
            </div>
          </>
        )}

        {isEdit && (onOpenDiscountModal || onOpenUnlockItemsModal) ? (
          <>
            <Divider className="rewards-modal__divider" />
            <div className="rewards-modal__field rewards-modal__field--inline-actions">
              <span className="rewards-modal__label">{EXTRASETTINGS__TEXTLABEL[LANGUAGE]}</span>
              <div className="rewards-modal__inline-actions">
                {onOpenDiscountModal ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenDiscountModal(rank)}
                  >
                    {DISCOUNTBTN__TEXTLABEL[LANGUAGE]}
                  </Button>
                ) : null}
                {onOpenUnlockItemsModal ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenUnlockItemsModal(rank)}
                  >
                    {UNLOCKBTN__TEXTLABEL[LANGUAGE]}
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
