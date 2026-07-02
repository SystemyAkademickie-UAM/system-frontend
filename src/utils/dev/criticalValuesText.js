/**
 * Buduje ciąg znaków o dokładnie podanej długości — do testów granicznych pól tekstowych.
 *
 * @param {number} maxLength
 * @param {string} [label='max']
 * @returns {string}
 */
export function buildCriticalText(maxLength, label = 'max') {
  if (!Number.isFinite(maxLength) || maxLength <= 0) {
    return '';
  }

  const safeLabel = String(label).replace(/[\[\]]/g, '');
  const prefix = `[${safeLabel}] `;

  let text;
  if (prefix.length >= maxLength) {
    text = prefix.slice(0, maxLength);
  } else {
    text = prefix + 'X'.repeat(maxLength - prefix.length);
  }

  if (text.length !== maxLength) {
    throw new Error(
      `buildCriticalText(${maxLength}, "${safeLabel}"): oczekiwano ${maxLength} znaków, wygenerowano ${text.length}`,
    );
  }

  return text;
}

/**
 * @param {string} text
 * @returns {string}
 */
export function formatCriticalLength(text) {
  return `${text.length} znaków`;
}
