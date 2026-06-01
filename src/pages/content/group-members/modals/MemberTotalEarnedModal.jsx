import { useEffect, useMemo, useState } from 'react';

import { Modal } from '../../../../components/ui/index.js';
import { resolveNextAmount, validateCurrencyForm, validateDeltaInput, validateTargetInput } from './memberCurrencyForm.js';

import './memberModals.css';

export default function MemberTotalEarnedModal({
  isOpen,
  member,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [deltaInput, setDeltaInput] = useState('');
  const [targetInput, setTargetInput] = useState('');

  useEffect(() => {
    if (!isOpen || !member) return;
    setDeltaInput('');
    setTargetInput('');
  }, [isOpen, member]);

  const validation = useMemo(
    () => validateCurrencyForm(deltaInput, targetInput),
    [deltaInput, targetInput],
  );

  const previewTotalCurrency = useMemo(() => {
    if (!member) return 0;
    return resolveNextAmount(member.totalCurrency, validation);
  }, [member, validation]);

  const handleConfirm = () => {
    if (!validation.valid || !validation.hasChange) return;
    onConfirm?.({
      delta: validation.mode === 'delta' ? validation.delta : 0,
      setValue: validation.mode === 'target' ? validation.target : null,
    });
  };

  if (!member) {
    return null;
  }

  const showDeltaError = deltaInput.trim() !== '' && !validateDeltaInput(deltaInput).valid;
  const showTargetError = targetInput.trim() !== '' && !validateTargetInput(targetInput).valid;
  const showFormError = !validation.valid && validation.error
    && (deltaInput.trim() !== '' || targetInput.trim() !== '');

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
        </div>

        <div className="member-modal__currency-input-wrap">
          <label htmlFor="total-earned-target" className="member-modal__currency-label">
            Ustaw docelową wartość (opcjonalnie)
          </label>
          <input
            id="total-earned-target"
            type="text"
            inputMode="numeric"
            className={[
              'member-modal__currency-input',
              showTargetError || showFormError ? 'member-modal__currency-input--error' : '',
            ].filter(Boolean).join(' ')}
            value={targetInput}
            onChange={(event) => setTargetInput(event.target.value)}
            placeholder="np. 500"
            aria-invalid={showTargetError || showFormError}
          />
          {showTargetError ? (
            <p className="member-modal__currency-error" role="alert">
              Wpisz nieujemną liczbę całkowitą.
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
