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

export function validateTargetInput(value) {
  const trimmed = value.trim();

  if (trimmed === '') {
    return { valid: true, target: null, error: null };
  }

  if (/^\d+$/.test(trimmed)) {
    return { valid: true, target: Number(trimmed), error: null };
  }

  return {
    valid: false,
    target: null,
    error: 'Wpisz nieujemną liczbę całkowitą.',
  };
}

export function validateCurrencyForm(deltaInput, targetInput) {
  const deltaValidation = validateDeltaInput(deltaInput);
  if (!deltaValidation.valid) {
    return { ...deltaValidation, target: null, hasChange: false, mode: null };
  }

  const targetValidation = validateTargetInput(targetInput);
  if (!targetValidation.valid) {
    return {
      valid: false,
      delta: 0,
      target: null,
      hasChange: false,
      mode: null,
      error: targetValidation.error,
    };
  }

  const deltaTrimmed = deltaInput.trim();
  const hasDelta = deltaTrimmed !== ''
    && deltaTrimmed !== '-'
    && deltaTrimmed !== '+'
    && deltaValidation.delta !== 0;
  const hasTarget = targetValidation.target != null;

  if (hasDelta && hasTarget) {
    return {
      valid: false,
      delta: 0,
      target: null,
      hasChange: false,
      mode: null,
      error: 'Wypełnij tylko jedno pole: zmianę albo docelową wartość.',
    };
  }

  if (!hasDelta && !hasTarget) {
    return {
      valid: true,
      delta: 0,
      target: null,
      hasChange: false,
      mode: null,
      error: null,
    };
  }

  return {
    valid: true,
    delta: deltaValidation.delta,
    target: targetValidation.target,
    hasChange: true,
    mode: hasTarget ? 'target' : 'delta',
    error: null,
  };
}

export function resolveNextAmount(currentAmount, validation) {
  if (!validation.hasChange) return currentAmount;
  if (validation.mode === 'target') {
    return validation.target ?? currentAmount;
  }
  return Math.max(0, currentAmount + validation.delta);
}
