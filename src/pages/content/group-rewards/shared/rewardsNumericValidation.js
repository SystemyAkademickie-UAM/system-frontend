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
