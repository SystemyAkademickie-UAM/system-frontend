import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
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

    if (picker.shadowRoot && !picker.shadowRoot.querySelector('style[data-flags-font]')) {
      const style = document.createElement('style');
      style.setAttribute('data-flags-font', 'true');
      style.textContent = `
        .results > .group:last-child .button,
        .group--flags .button,
        .group-filter:last-child .button {
          font-family: 'Noto Color Emoji Flags', 'Noto Color Emoji', 'Twemoji Country Flags', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif !important;
        }
      `;
      picker.shadowRoot.appendChild(style);

      try {
        const flagsElement = picker.groupElements?.get?.(picker.groups?.get?.('flags'));
        if (flagsElement) {
          flagsElement.classList.add('group--flags');
        }
      } catch {
        // ignore
      }
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

      {isOpen && typeof document !== 'undefined'
        ? createPortal(
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
          </div>,
          document.body,
        )
        : null}
    </div>
  );
}
