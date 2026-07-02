import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { calculateDefaultRankDiscount } from '../../../../utils/ranks/rankDiscount.js';
import { validateDiscountPercentInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function RankDiscountModal({
  isOpen,
  rank,
  existingRanks = [],
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (rank) {
      setDiscount(rank.discount === 0 || rank.discount ? String(rank.discount) : '');
      return;
    }

    setDiscount(String(calculateDefaultRankDiscount(existingRanks)));
  }, [isOpen, rank, existingRanks]);

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
            placeholder="np. 15"
            aria-invalid={showDiscountError}
            aria-describedby={showDiscountError ? 'rank-discount-modal-error' : 'rank-discount-modal-hint'}
          />
          <p id="rank-discount-modal-hint" className="rewards-modal__field-hint">
            Domyślnie: 1% + zniżka najwyższej rangi. Możesz wyczyścić pole.
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
