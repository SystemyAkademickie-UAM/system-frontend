import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CurrencyDisplay from '../../ui/Currency/CurrencyDisplay.jsx';
import { CurrencyIcon } from '../../ui/Currency/CurrencyDisplay.jsx';
import SuperBarStatBadge from './SuperBarStatBadge.jsx';
import './SuperBar.css';

/**
 * Statystyka waluty z podglądem zgromadzonej kwoty po najechaniu (jak mini odznaka).
 */
export default function SuperBarCurrencyStat({
  currentAmount,
  totalEarned,
  currencyLabel = 'Waluta',
  ariaLabel,
}) {
  const triggerRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const updatePreviewPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const previewWidth = 220;
    let left = rect.left + rect.width / 2 - previewWidth / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - previewWidth - 16));
    const top = rect.bottom + 8;
    setPreviewPos({ x: left, y: top });
  }, []);

  const handleMouseEnter = () => {
    updatePreviewPosition();
    setPreviewVisible(true);
  };

  const handleMouseLeave = () => {
    setPreviewVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="super-bar-stat super-bar-stat--currency"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="super-bar-stat__icon">
          <CurrencyIcon size="lg" ariaLabel={currencyLabel} />
        </span>
        <SuperBarStatBadge value={currentAmount} />
      </div>

      {previewVisible
        ? createPortal(
          <div
            className="super-bar-currency-preview"
            style={{ left: `${previewPos.x}px`, top: `${previewPos.y}px` }}
            aria-hidden="true"
          >
            <p className="super-bar-currency-preview__title">{currencyLabel}</p>
            <p className="super-bar-currency-preview__label">Zgromadzona</p>
            <CurrencyDisplay amount={totalEarned} size="lg" className="super-bar-currency-preview__value" />
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
