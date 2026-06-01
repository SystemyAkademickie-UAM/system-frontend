import { useCallback, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button/Button.jsx';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './Modal.css';

/**
 * Wyśrodkowany modal z przyciemnionym, rozmytym tłem.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose — zamknięcie (krzyżyk, tło, Escape)
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {import('react').ReactNode} props.children
 * @param {() => void} [props.onConfirm]
 * @param {string} [props.confirmLabel='Zapisz']
 * @param {'primary' | 'danger'} [props.confirmVariant='primary']
 * @param {boolean} [props.showFooter=true]
 * @param {boolean} [props.confirmDisabled=false]
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {string} [props.className]
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onConfirm,
  confirmLabel = 'Zapisz',
  confirmVariant = 'primary',
  showFooter = true,
  confirmDisabled = false,
  size = 'md',
  className = '',
}) {
  const titleId = useId();
  const subtitleId = useId();

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={['maq-modal', className].filter(Boolean).join(' ')}>
      <div
        className="maq-modal__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={['maq-modal__dialog', `maq-modal__dialog--${size}`].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? subtitleId : undefined}
      >
        <header className="maq-modal__header">
          <div>
            {title ? (
              <h2 id={titleId} className="maq-modal__title">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p id={subtitleId} className="maq-modal__subtitle">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="maq-modal__close"
            onClick={onClose}
            aria-label="Zamknij"
          >
            <AssetSvg name={SVG_ICONS.controls.close} className="maq-modal__close-icon" width={24} height={24} alt="" />
          </button>
        </header>

        <div className="maq-modal__body">
          {children}
        </div>

        {showFooter && onConfirm ? (
          <footer className="maq-modal__footer">
            <Button variant={confirmVariant} size="md" onClick={onConfirm} disabled={confirmDisabled}>
              {confirmLabel}
            </Button>
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
