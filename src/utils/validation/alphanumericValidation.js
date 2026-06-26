export function validateAlphanumericInput(value) {
  const trimmed = value.trim();

  if (trimmed === '') {
    return { valid: false, value: null, error: null };
  }

  if (/^[a-zA-Z0-9]+$/.test(trimmed)) {
    return { valid: true, value: trimmed, error: null };
  }

  return {
    valid: false,
    value: null,
    error: 'Dozwolone są tylko litery i cyfry.',
  };
}
