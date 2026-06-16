import './CharacterCounter.css';

/**
 * Licznik znaków w formacie „12/50”.
 *
 * @param {Object} props
 * @param {string | number} props.value — aktualna treść pola
 * @param {number} props.maxLength — limit znaków
 * @param {string} [props.className]
 */
export default function CharacterCounter({ value, maxLength, className = '' }) {
  const current = String(value ?? '').length;
  const ratio = maxLength > 0 ? current / maxLength : 0;

  return (
    <span
      className={[
        'maq-char-counter',
        ratio >= 1 ? 'maq-char-counter--limit' : '',
        ratio >= 0.9 && ratio < 1 ? 'maq-char-counter--warn' : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-live="polite"
      aria-atomic="true"
    >
      {current}
      /
      {maxLength}
    </span>
  );
}
