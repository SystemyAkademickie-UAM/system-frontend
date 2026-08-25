import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { validateDiscountPercentInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import '../../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const DISCOUNTMODALTITLE__TEXTLABEL = {
  polish: 'Zniżka w sklepie',
  english: 'Shop discount'
};

const DISCOUNTFIELDLABEL__TEXTLABEL = {
  polish: 'Zniżka w sklepie (%)',
  english: 'Shop discount (%)'
};

const DISCOUNTHINT__TEXTLABEL = {
  polish: 'Procentowa obniżka ceny produktów w sklepie dla uczestników posiadających tę rangę. Ustaw 0, jeśli ranga nie przyznaje zniżki.',
  english: 'Percentage price reduction for shop products for participants who have this rank. Set 0 if the rank does not provide a discount.'
};

export default function RankDiscountModal({
  isOpen,
  rank,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    if (!isOpen || !rank) return;

    setDiscount(String(rank.discount ?? 0));
  }, [isOpen, rank]);

  const discountValidation = useMemo(
    () => validateDiscountPercentInput(discount),
    [discount],
  );

  const showDiscountError = discount.trim() !== '' && !discountValidation.valid;
  const isValid = discountValidation.valid;

  const handleConfirm = () => {
    if (!isValid || isLoading) return;
    onConfirm?.({ discount: discountValidation.value });
  };

  if (!rank) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={DISCOUNTMODALTITLE__TEXTLABEL[LANGUAGE]}
      subtitle={rank.name}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__field">
          <label htmlFor="rank-discount-modal" className="rewards-modal__label">
            {DISCOUNTFIELDLABEL__TEXTLABEL[LANGUAGE]}
          </label>
          <input
            id="rank-discount-modal"
            type="text"
            inputMode="decimal"
            className={[
              'rewards-modal__input',
              showDiscountError ? 'rewards-modal__input--error' : '',
            ].filter(Boolean).join(' ')}
            value={discount}
            onChange={(event) => setDiscount(event.target.value)}
            placeholder="0"
            aria-invalid={showDiscountError}
            aria-describedby={showDiscountError ? 'rank-discount-modal-error' : 'rank-discount-modal-hint'}
          />
          <p id="rank-discount-modal-hint" className="rewards-modal__field-hint">
            {DISCOUNTHINT__TEXTLABEL[LANGUAGE]}
          </p>
          {showDiscountError ? (
            <p id="rank-discount-modal-error" className="rewards-modal__field-error" role="alert">
              {discountValidation.error}
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
