import CharacterCounter from './CharacterCounter.jsx';
import './CharacterCounter.css';

/**
 * Opakowanie pola tekstowego z licznikiem znaków (gdy podano maxLength).
 *
 * @param {Object} props
 * @param {string | number} props.value
 * @param {number} [props.maxLength]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function CharacterLimitedField({
  value,
  maxLength,
  className = '',
  children,
}) {
  if (!maxLength) {
    return children;
  }

  return (
    <div className={['maq-char-limited-field', className].filter(Boolean).join(' ')}>
      {children}
      <CharacterCounter
        value={value}
        maxLength={maxLength}
        className="maq-char-limited-field__counter"
      />
    </div>
  );
}
