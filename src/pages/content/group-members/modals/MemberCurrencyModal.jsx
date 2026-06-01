import { useEffect, useMemo, useState } from 'react';

import { Modal } from '../../../../components/ui/index.js';
import { resolveNextAmount, validateCurrencyForm, validateDeltaInput, validateTargetInput } from './memberCurrencyForm.js';

import './memberModals.css';

export default function MemberCurrencyModal({
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

  const previewCurrency = useMemo(() => {
    if (!member) return 0;
    return resolveNextAmount(member.currency, validation);
  }, [member, validation]);

  const previewTotalEarned = useMemo(() => {
    if (!member) return 0;
    if (validation.mode !== 'delta' || validation.delta <= 0) {
      return member.totalCurrency;
    }
    return member.totalCurrency + validation.delta;
  }, [member, validation]);

  const totalEarnedChanges = validation.mode === 'delta' && validation.delta > 0;

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
      title="Dodaj / zabierz walutę"
      subtitle={member.name}
      onConfirm={handleConfirm}
      confirmLabel={isLoading ? 'Zapisywanie…' : 'Zapisz'}
      confirmDisabled={!validation.valid || !validation.hasChange || isLoading}
      size="sm"
      className="member-modal"
    >
      <div className="member-modal__currency-form">
        <div className="member-modal__currency-input-wrap">
          <label htmlFor="currency-delta" className="member-modal__currency-label">
            Zmiana waluty (dodatnia lub ujemna)
          </label>
          <input
            id="currency-delta"
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
          <label htmlFor="currency-target" className="member-modal__currency-label">
            Ustaw docelową wartość (opcjonalnie)
          </label>
          <input
            id="currency-target"
            type="text"
            inputMode="numeric"
            className={[
              'member-modal__currency-input',
              showTargetError || showFormError ? 'member-modal__currency-input--error' : '',
            ].filter(Boolean).join(' ')}
            value={targetInput}
            onChange={(event) => setTargetInput(event.target.value)}
            placeholder="np. 100"
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
            <span className="member-modal__currency-stat-label">Waluta</span>
            <span
              className={[
                'member-modal__currency-stat-value',
                validation.hasChange && validation.valid
                  ? 'member-modal__currency-stat-value--preview'
                  : '',
              ].filter(Boolean).join(' ')}
            >
              {validation.hasChange && validation.valid
                ? `${member.currency} → ${previewCurrency}`
                : member.currency}
            </span>
          </div>

          <div className="member-modal__currency-stat">
            <span className="member-modal__currency-stat-label">Zgromadzona</span>
            <span
              className={[
                'member-modal__currency-stat-value',
                totalEarnedChanges && validation.valid
                  ? 'member-modal__currency-stat-value--preview'
                  : '',
              ].filter(Boolean).join(' ')}
            >
              {totalEarnedChanges && validation.valid
                ? `${member.totalCurrency} → ${previewTotalEarned}`
                : member.totalCurrency}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
