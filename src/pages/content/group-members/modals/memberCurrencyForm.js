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
    error: 'Wpisz liczbę całkowitą (dodatnią lub ujemną).',
  };
}

export function validateCurrencyForm(deltaInput) {
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
