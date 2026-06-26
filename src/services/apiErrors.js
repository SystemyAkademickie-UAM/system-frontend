/**
 * Wyciąga czytelny komunikat błędu z odpowiedzi API (NestJS validation, plain text, itp.).
 *
 * @param {unknown} data
 * @param {string} [fallback='Operacja nie powiodła się']
 * @returns {string}
 */
export function extractApiError(data, fallback = 'Operacja nie powiodła się') {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (typeof data === 'object' && data !== null) {
    const record = /** @type {{ message?: string | string[], error?: string }} */ (data);

    if (Array.isArray(record.message)) {
      const joined = record.message.map((item) => String(item).trim()).filter(Boolean).join(', ');
      if (joined) {
        return joined;
      }
    }

    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message.trim();
    }

    if (typeof record.error === 'string' && record.error.trim()) {
      return record.error.trim();
    }
  }

  return fallback;
}
