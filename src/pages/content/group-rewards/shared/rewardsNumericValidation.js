export function validateWholeNumberInput(value) {
  const trimmed = value.trim();

  if (trimmed === '') {
    return { valid: false, value: null, error: null };
  }

  if (/^\d+$/.test(trimmed)) {
    return { valid: true, value: Number(trimmed), error: null };
  }

  return {
    valid: false,
    value: null,
    error: 'Wpisz liczbę całkowitą (bez ułamków i znaków).',
  };
}

/** Zniżka procentowa rangi (0–100). Puste pole = 0. */
export function validateDiscountPercentInput(value) {
  const trimmed = value.trim();

  if (trimmed === '') {
    return { valid: true, value: 0, error: null };
  }

  const normalized = trimmed.replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return {
      valid: false,
      value: null,
      error: 'Wpisz liczbę od 0 do 100 (np. 15 lub 12.5).',
    };
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    return {
      valid: false,
      value: null,
      error: 'Zniżka musi mieścić się w zakresie 0–100%.',
    };
  }

  return { valid: true, value: Math.round(parsed * 100) / 100, error: null };
}
