import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { validateDiscountPercentInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import '../../group-rewards/shared/rewardsModals.css';

const RANK_DISCOUNT_HINT = 'Procentowa obniżka ceny produktów w sklepie dla uczestników posiadających tę rangę. Ustaw 0, jeśli ranga nie przyznaje zniżki.';

export default function RankDiscountModal({
  isOpen,
  rank,
  onClose,
  onConfirm,
  isLoading = false,
}) {
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
      title="Zniżka w sklepie"
      subtitle={rank.name}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__field">
          <label htmlFor="rank-discount-modal" className="rewards-modal__label">
            Zniżka w sklepie (%)
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
            {RANK_DISCOUNT_HINT}
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
