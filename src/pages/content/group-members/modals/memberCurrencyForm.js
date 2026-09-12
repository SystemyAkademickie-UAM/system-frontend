import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const LANGUAGE = READLANGUAGECOOKIE();

const INTEGER_ERROR__TEXTLABEL = { polish: 'Wpisz liczbę całkowitą (dodatnią lub ujemną).', english: 'Enter a whole number (positive or negative).' };
const MAX_AMOUNT_ERROR_PATTERN__TEXTLABEL = { polish: '${fieldLabel} nie może przekraczać ${maxValue}.', english: '${fieldLabel} cannot exceed ${maxValue}.' };

export function validateDeltaInput(value) {
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
    error: INTEGER_ERROR__TEXTLABEL[LANGUAGE],
  };
}

function validateResultingAmount(nextAmount, fieldLabel, max) {
  if (nextAmount > max) {
    return {
      valid: false,
      error: MAX_AMOUNT_ERROR_PATTERN__TEXTLABEL[LANGUAGE]
        .replace('${fieldLabel}', fieldLabel)
        .replace('${maxValue}', max.toLocaleString('pl-PL')),
    };
  }

  return { valid: true, error: null };
}

export function validateCurrencyForm(deltaInput, options = {}) {
  const {
    currentAmount = 0,
    currentTotalEarned = null,
    max = null,
    amountLabel = 'Wartość',
    totalEarnedLabel = 'Zgromadzona waluta',
  } = options;

  const deltaValidation = validateDeltaInput(deltaInput);
  if (!deltaValidation.valid) {
    return { ...deltaValidation, hasChange: false, mode: null };
  }

  const deltaTrimmed = deltaInput.trim();
  const hasDelta = deltaTrimmed !== ''
    && deltaTrimmed !== '-'
    && deltaTrimmed !== '+'
    && deltaValidation.delta !== 0;

  if (!hasDelta) {
    return {
      valid: true,
      delta: 0,
      hasChange: false,
      mode: null,
      error: null,
    };
  }

  if (max != null) {
    const nextAmount = Math.max(0, currentAmount + deltaValidation.delta);
    const amountCheck = validateResultingAmount(nextAmount, amountLabel, max);
    if (!amountCheck.valid) {
      return {
        valid: false,
        delta: deltaValidation.delta,
        hasChange: true,
        mode: 'delta',
        error: amountCheck.error,
      };
    }

    if (deltaValidation.delta > 0 && currentTotalEarned != null) {
      const nextTotalEarned = currentTotalEarned + deltaValidation.delta;
      const totalCheck = validateResultingAmount(nextTotalEarned, totalEarnedLabel, max);
      if (!totalCheck.valid) {
        return {
          valid: false,
          delta: deltaValidation.delta,
          hasChange: true,
          mode: 'delta',
          error: totalCheck.error,
        };
      }
    }
  }

  return {
    valid: true,
    delta: deltaValidation.delta,
    hasChange: true,
    mode: 'delta',
    error: null,
  };
}

export function resolveNextAmount(currentAmount, validation) {
  if (!validation.hasChange) return currentAmount;
  return Math.max(0, currentAmount + validation.delta);
}
