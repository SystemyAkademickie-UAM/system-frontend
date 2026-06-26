import { useCallback, useState } from 'react';
import 'unicode-emoji-picker';
import './EmojiPickerField.css';

/**
 * Pole wyboru emoji (ten sam wzorzec co w ustawieniach waluty grupy).
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {(emoji: string) => void} props.onChange
 * @param {string} [props.label]
 * @param {string} [props.defaultEmoji='⭐']
 * @param {string} [props.ariaLabel]
 * @param {string} [props.className]
 */
export default function EmojiPickerField({
  value,
  onChange,
  label,
  defaultEmoji = '⭐',
  ariaLabel,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const displayEmoji = value?.trim() || defaultEmoji;

  const onPickerMounted = useCallback((picker) => {
    if (!picker) {
      return;
    }

    picker.addEventListener('emoji-pick', (event) => {
      onChange?.(event.detail.emoji);
      setIsOpen(false);
    });
  }, [onChange]);

  return (
    <div className={['maq-emoji-picker-field', className].filter(Boolean).join(' ')}>
      {label ? (
        <span className="maq-emoji-picker-field__label">{label}</span>
      ) : null}

      <button
        type="button"
        className="maq-emoji-picker-field__trigger"
        onClick={() => setIsOpen(true)}
        aria-label={ariaLabel || label || 'Wybierz emoji'}
      >
        <span className="maq-emoji-picker-field__emoji" aria-hidden="true">{displayEmoji}</span>
      </button>

      {isOpen ? (
        <div
          className="maq-emoji-picker-field__backdrop"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div
            className="maq-emoji-picker-field__dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <unicode-emoji-picker
              ref={onPickerMounted}
              className="maq-emoji-picker-field__picker"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
