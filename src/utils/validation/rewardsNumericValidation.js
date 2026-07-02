/** Maksymalna wartość liczbowa w polach nagród, kosztów i cen. */
export const REWARD_NUMERIC_MAX = 999_999_999;

/**
 * Filtruje wpis do cyfr i obcina wartość do dozwolonego maksimum.
 *
 * @param {string} raw
 * @param {number} [max]
 * @returns {string}
 */
export function sanitizeWholeNumberInput(raw, max = REWARD_NUMERIC_MAX) {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (digits === '') {
    return '';
  }

  const normalized = digits.replace(/^0+(?=\d)/, '') || '0';
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed > max) {
    return String(max);
  }

  return normalized;
}

/**
 * @param {string} value
 * @param {number} [max]
 * @returns {{ valid: boolean, value: number | null, error: string | null }}
 */
export function validateWholeNumberInput(value, max = REWARD_NUMERIC_MAX) {
  const trimmed = value.trim();

  if (trimmed === '') {
    return { valid: false, value: null, error: null };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      valid: false,
      value: null,
      error: 'Wpisz liczbę całkowitą (bez ułamków i znaków).',
    };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed > max) {
    return {
      valid: false,
      value: null,
      error: `Maksymalna dozwolona wartość to ${max.toLocaleString('pl-PL')}.`,
    };
  }

  return { valid: true, value: parsed, error: null };
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
