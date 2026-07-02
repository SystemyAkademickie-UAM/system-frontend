import { useEffect, useMemo, useState } from 'react';

import { Modal } from '../../../../components/ui/index.js';
import { REWARD_NUMERIC_MAX } from '../../../../utils/validation/rewardsNumericValidation.js';
import { resolveNextAmount, validateCurrencyForm, validateDeltaInput } from './memberCurrencyForm.js';

import './memberModals.css';

export default function MemberTotalEarnedModal({
  isOpen,
  member,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [deltaInput, setDeltaInput] = useState('');

  useEffect(() => {
    if (!isOpen || !member) return;
    setDeltaInput('');
  }, [isOpen, member]);

  const validation = useMemo(
    () => validateCurrencyForm(deltaInput, {
      currentAmount: member?.totalCurrency ?? 0,
      max: REWARD_NUMERIC_MAX,
      amountLabel: 'Zgromadzona waluta',
    }),
    [deltaInput, member],
  );

  const previewTotalCurrency = useMemo(() => {
    if (!member) return 0;
    return resolveNextAmount(member.totalCurrency, validation);
  }, [member, validation]);

  const handleConfirm = () => {
    if (!validation.valid || !validation.hasChange) return;
    onConfirm?.({
      delta: validation.delta,
      setValue: null,
    });
  };

  if (!member) {
    return null;
  }

  const showDeltaError = deltaInput.trim() !== '' && !validateDeltaInput(deltaInput).valid;
  const showFormError = !validation.valid && validation.error && deltaInput.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj zgromadzoną walutę"
      subtitle={member.name}
      onConfirm={handleConfirm}
      confirmLabel={isLoading ? 'Zapisywanie…' : 'Zapisz'}
      confirmDisabled={!validation.valid || !validation.hasChange || isLoading}
      size="sm"
      className="member-modal"
    >
      <div className="member-modal__currency-form">
        <div className="member-modal__currency-input-wrap">
          <label htmlFor="total-earned-delta" className="member-modal__currency-label">
            Zmiana zgromadzonej waluty (dodatnia lub ujemna)
          </label>
          <input
            id="total-earned-delta"
            type="text"
            inputMode="numeric"
            className={[
              'member-modal__currency-input',
              showDeltaError || showFormError ? 'member-modal__currency-input--error' : '',
            ].filter(Boolean).join(' ')}
            value={deltaInput}
            onChange={(event) => setDeltaInput(event.target.value)}
            placeholder="np. 50 lub -20"
            aria-invalid={showDeltaError || showFormError}
          />
          {showDeltaError ? (
            <p className="member-modal__currency-error" role="alert">
              Wpisz liczbę całkowitą (dodatnią lub ujemną).
            </p>
          ) : null}
          {showFormError ? (
            <p className="member-modal__currency-error" role="alert">
              {validation.error}
            </p>
          ) : null}
        </div>

        <div className="member-modal__currency-preview">
          <div className="member-modal__currency-stat">
            <span className="member-modal__currency-stat-label">Zgromadzona</span>
            <span
              className={[
                'member-modal__currency-stat-value',
                validation.hasChange && validation.valid
                  ? 'member-modal__currency-stat-value--preview'
                  : '',
              ].filter(Boolean).join(' ')}
            >
              {validation.hasChange && validation.valid
                ? `${member.totalCurrency} → ${previewTotalCurrency}`
                : member.totalCurrency}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
