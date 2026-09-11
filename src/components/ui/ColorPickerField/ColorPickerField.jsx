import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ColorPickerField.css';

const DEFAULT_PRESET_COLORS = [
  '#42f37d', '#00eeff', '#ffd000', '#ff9142', '#ff4d4f',
  '#d843ff', '#4378ff', '#00c48c', '#e056fd', '#38bdf8',
  '#a855f7', '#ec4899', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#6366f1', '#64748b', '#94a3b8', '#ffffff',
];

function CloseIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function normalizeHex(input, fallback = '#42f37d') {
  if (!input || typeof input !== 'string') return fallback;
  const trimmed = input.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}

/**
 * Komponent wyboru koloru ze spójnym zaciemnionym tłem (backdrop).
 * Kliknięcie poza obszarem okna działa tak samo jak przycisk "Anuluj".
 *
 * @param {Object} props
 * @param {string} props.value - Aktualnie wybrany kolor hex (np. #42f37d)
 * @param {(color: string) => void} props.onChange - Callback wywoływany przy zatwierdzeniu koloru
 * @param {string} [props.title='Wybierz kolor'] - Tytuł modala
 * @param {string} [props.subtitle] - Podtytuł (np. nazwa kategorii)
 * @param {string[]} [props.presetColors] - Lista proponowanych kolorów
 * @param {boolean} [props.showHexInput=true] - Czy pokazywać pole wpisywania hex
 * @param {boolean} [props.disabled=false] - Czy pole jest zablokowane
 * @param {string} [props.className] - Dodatkowa klasa CSS
 * @param {string} [props.ariaLabel] - Etykieta dostępności
 * @param {React.ReactNode | ((props: { onClick: () => void, value: string }) => React.ReactNode)} [props.triggerComponent] - Opcjonalny własny komponent przycisku otwierającego
 */
export default function ColorPickerField({
  value = '#42f37d',
  onChange,
  title = 'Wybierz kolor',
  subtitle,
  presetColors = DEFAULT_PRESET_COLORS,
  showHexInput = true,
  disabled = false,
  className = '',
  ariaLabel,
  triggerComponent,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftColor, setDraftColor] = useState(() => normalizeHex(value));
  const [hexInputValue, setHexInputValue] = useState(() => normalizeHex(value));

  useEffect(() => {
    if (isOpen) {
      const normalized = normalizeHex(value);
      setDraftColor(normalized);
      setHexInputValue(normalized);
    }
  }, [isOpen, value]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    const normalized = normalizeHex(value);
    setDraftColor(normalized);
    setHexInputValue(normalized);
    setIsOpen(true);
  }, [disabled, value]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    const normalized = normalizeHex(value);
    setDraftColor(normalized);
    setHexInputValue(normalized);
  }, [value]);

  const handleApply = useCallback(() => {
    const finalColor = normalizeHex(draftColor, normalizeHex(value));
    onChange?.(finalColor);
    setIsOpen(false);
  }, [draftColor, onChange, value]);

  const handleSwatchClick = useCallback((hex) => {
    setDraftColor(hex);
    setHexInputValue(hex);
  }, []);

  const handleNativeChange = useCallback((hex) => {
    setDraftColor(hex);
    setHexInputValue(hex);
  }, []);

  const handleHexInputChange = useCallback((event) => {
    let text = event.target.value;
    if (text && !text.startsWith('#')) {
      text = '#' + text;
    }
    setHexInputValue(text);
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(text)) {
      setDraftColor(text);
    }
  }, []);

  const handleHexInputBlur = useCallback(() => {
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hexInputValue)) {
      setDraftColor(hexInputValue);
    } else {
      setHexInputValue(draftColor);
    }
  }, [draftColor, hexInputValue]);

  const resolvedValue = normalizeHex(value);

  return (
    <div className={['maq-color-picker-field', className].filter(Boolean).join(' ')}>
      {typeof triggerComponent === 'function' ? (
        triggerComponent({ onClick: handleOpen, value: resolvedValue })
      ) : triggerComponent ? (
        <div onClick={handleOpen} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleOpen()}>
          {triggerComponent}
        </div>
      ) : (
        <button
          type="button"
          className="maq-color-picker-field__trigger"
          onClick={handleOpen}
          disabled={disabled}
          aria-label={ariaLabel || title || 'Wybierz kolor'}
        >
          <span
            className="maq-color-picker-field__trigger-swatch"
            style={{ backgroundColor: resolvedValue }}
            aria-hidden="true"
          />
          <span className="maq-color-picker-field__trigger-hex">{resolvedValue.toUpperCase()}</span>
        </button>
      )}

      {isOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="maq-color-picker-field__backdrop"
              onClick={handleCancel}
              role="presentation"
            >
              <div
                className="maq-color-picker-field__dialog"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
              >
                <div className="maq-color-picker-field__header">
                  <div className="maq-color-picker-field__header-text">
                    <h3 className="maq-color-picker-field__title">{title}</h3>
                    {subtitle ? <p className="maq-color-picker-field__subtitle">{subtitle}</p> : null}
                  </div>
                  <button
                    type="button"
                    className="maq-color-picker-field__close-btn"
                    onClick={handleCancel}
                    aria-label="Zamknij"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="maq-color-picker-field__body">
                  <div className="maq-color-picker-field__preview-section">
                    <div
                      className="maq-color-picker-field__preview-box"
                      style={{ backgroundColor: draftColor }}
                      aria-hidden="true"
                    />
                    <div className="maq-color-picker-field__hex-display">
                      {draftColor.toUpperCase()}
                    </div>
                  </div>

                  <div className="maq-color-picker-field__section-label">Gotowe kolory</div>
                  <div className="maq-color-picker-field__swatches">
                    {presetColors.map((hex) => {
                      const isActive = draftColor.toLowerCase() === hex.toLowerCase();
                      return (
                        <button
                          key={hex}
                          type="button"
                          className={[
                            'maq-color-picker-field__swatch',
                            isActive ? 'maq-color-picker-field__swatch--active' : '',
                          ].filter(Boolean).join(' ')}
                          style={{ backgroundColor: hex }}
                          onClick={() => handleSwatchClick(hex)}
                          aria-label={`Kolor ${hex}`}
                        />
                      );
                    })}
                  </div>

                  {showHexInput ? (
                    <div className="maq-color-picker-field__custom-row">
                      <label htmlFor="maq-custom-color-input" className="maq-color-picker-field__custom-label">
                        Własny kolor:
                      </label>
                      <div className="maq-color-picker-field__custom-inputs">
                        <div className="maq-color-picker-field__native-wrap">
                          <input
                            id="maq-custom-color-input"
                            type="color"
                            className="maq-color-picker-field__native-input"
                            value={draftColor.startsWith('#') && draftColor.length === 7 ? draftColor : '#42f37d'}
                            onChange={(event) => handleNativeChange(event.target.value)}
                            aria-label="Paleta kolorów"
                          />
                        </div>
                        <input
                          type="text"
                          className="maq-color-picker-field__hex-input"
                          value={hexInputValue}
                          maxLength={7}
                          placeholder="#42f37d"
                          onChange={handleHexInputChange}
                          onBlur={handleHexInputBlur}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="maq-color-picker-field__footer">
                  <button
                    type="button"
                    className="maq-color-picker-field__action-btn maq-color-picker-field__action-btn--cancel"
                    onClick={handleCancel}
                  >
                    Anuluj
                  </button>
                  <button
                    type="button"
                    className="maq-color-picker-field__action-btn maq-color-picker-field__action-btn--apply"
                    onClick={handleApply}
                  >
                    Zapisz
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
