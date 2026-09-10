import CharacterCounter from './CharacterCounter.jsx';
import './CharacterCounter.css';

/**
 * Opakowanie pola tekstowego z licznikiem znaków (gdy podano maxLength).
 *
 * @param {Object} props
 * @param {string | number} props.value
 * @param {number} [props.maxLength]
 * @param {'below' | 'inside' | 'inside-top'} [props.placement='below']
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function CharacterLimitedField({
  value,
  maxLength,
  placement = 'below',
  className = '',
  children,
}) {
  if (!maxLength) {
    return children;
  }

  const isInside = placement === 'inside' || placement === 'inside-top';

  return (
    <div
      className={[
        'maq-char-limited-field',
        isInside ? 'maq-char-limited-field--inside' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      <CharacterCounter
        value={value}
        maxLength={maxLength}
        className={[
          'maq-char-limited-field__counter',
          isInside ? 'maq-char-limited-field__counter--inside' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  );
}
