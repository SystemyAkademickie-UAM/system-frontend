import { useEffect, useMemo, useState } from 'react';

import { Modal } from '../../../../components/ui/index.js';

import './memberModals.css';



function validateDeltaInput(value) {

  const trimmed = value.trim();



  if (trimmed === '' || trimmed === '-' || trimmed === '+') {

    return { valid: true, delta: 0, error: null };

  }



  if (/^[+-]?\d+$/.test(trimmed)) {

    return { valid: true, delta: Number(trimmed), error: null };

  }



  return {

    valid: false,

    delta: 0,

    error: 'Wpisz liczbę całkowitą (dodatnią lub ujemną).',

  };

}



export default function MemberCurrencyModal({

  isOpen,

  member,

  onClose,

  onConfirm,

}) {

  const [deltaInput, setDeltaInput] = useState('');



  useEffect(() => {

    if (!isOpen || !member) return;

    setDeltaInput('');

  }, [isOpen, member]);



  const validation = useMemo(() => validateDeltaInput(deltaInput), [deltaInput]);

  const delta = validation.delta;



  const previewCurrency = useMemo(() => {

    if (!member) return 0;

    return Math.max(0, member.currency + delta);

  }, [member, delta]);



  const previewTotalCurrency = useMemo(() => {

    if (!member) return 0;

    const totalDelta = delta > 0 ? delta : 0;

    return member.totalCurrency + totalDelta;

  }, [member, delta]);



  const handleConfirm = () => {

    if (!validation.valid) return;

    onConfirm?.({ delta });

    onClose();

  };



  if (!member) {

    return null;

  }



  const hasChange = delta !== 0;

  const showError = deltaInput.trim() !== '' && !validation.valid;



  return (

    <Modal

      isOpen={isOpen}

      onClose={onClose}

      title="Dodaj / zabierz walutę"

      subtitle={member.name}

      onConfirm={handleConfirm}

      confirmDisabled={!validation.valid}

      size="sm"

      className="member-modal"

    >

      <div className="member-modal__currency-form">

        <div className="member-modal__currency-input-wrap">

          <label htmlFor="currency-delta" className="member-modal__currency-label">

            Zmiana waluty (liczba dodatnia lub ujemna)

          </label>

          <input

            id="currency-delta"

            type="text"

            inputMode="numeric"

            className={[

              'member-modal__currency-input',

              showError ? 'member-modal__currency-input--error' : '',

            ].filter(Boolean).join(' ')}

            value={deltaInput}

            onChange={(event) => setDeltaInput(event.target.value)}

            placeholder="np. 50 lub -20"

            aria-invalid={showError}

            aria-describedby={showError ? 'currency-delta-error' : undefined}

          />

          {showError ? (

            <p id="currency-delta-error" className="member-modal__currency-error" role="alert">

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

                hasChange && validation.valid ? 'member-modal__currency-stat-value--preview' : '',

              ].filter(Boolean).join(' ')}

            >

              {hasChange && validation.valid

                ? `${member.currency} → ${previewCurrency}`

                : member.currency}

            </span>

          </div>

          <div className="member-modal__currency-stat">

            <span className="member-modal__currency-stat-label">Zgromadzona</span>

            <span

              className={[

                'member-modal__currency-stat-value',

                hasChange && validation.valid && delta > 0

                  ? 'member-modal__currency-stat-value--preview'

                  : '',

              ].filter(Boolean).join(' ')}

            >

              {hasChange && validation.valid && delta > 0

                ? `${member.totalCurrency} → ${previewTotalCurrency}`

                : member.totalCurrency}

            </span>

          </div>

        </div>

      </div>

    </Modal>

  );

}

