import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CurrencyDisplay from '../../ui/Currency/CurrencyDisplay.jsx';
import { CurrencyIcon } from '../../ui/Currency/CurrencyDisplay.jsx';
import SuperBarStatBadge from './SuperBarStatBadge.jsx';
import { positionCenteredTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
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
  const bubbleRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [layout, setLayout] = useState(null);

  const updatePreviewPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) {
      return;
    }

    setLayout(positionCenteredTooltip({
      triggerRect: trigger.getBoundingClientRect(),
      bubbleRect: bubble.getBoundingClientRect(),
    }));
  }, []);

  useLayoutEffect(() => {
    if (!previewVisible) {
      setLayout(null);
      return undefined;
    }

    updatePreviewPosition();
    const rafId = window.requestAnimationFrame(updatePreviewPosition);

    window.addEventListener('resize', updatePreviewPosition);
    window.addEventListener('scroll', updatePreviewPosition, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePreviewPosition);
      window.removeEventListener('scroll', updatePreviewPosition, true);
    };
  }, [previewVisible, updatePreviewPosition, totalEarned]);

  const handleMouseEnter = () => {
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
          <CurrencyIcon size="xl" ariaLabel={currencyLabel} />
        </span>
        <SuperBarStatBadge value={currentAmount} />
      </div>

      {previewVisible
        ? createPortal(
          <div
            ref={bubbleRef}
            className={[
              'super-bar-stat-preview',
              'super-bar-stat-preview--currency',
              layout?.placement === 'bottom' ? 'super-bar-stat-preview--below' : '',
            ].filter(Boolean).join(' ')}
            style={{
              visibility: layout ? 'visible' : 'hidden',
              left: layout ? `${layout.left}px` : 0,
              top: layout ? `${layout.top}px` : 0,
            }}
            aria-hidden="true"
          >
            <p className="super-bar-stat-preview__title">{currencyLabel}</p>
            <p className="super-bar-stat-preview__label">Zgromadzona</p>
            <CurrencyDisplay amount={totalEarned} size="md" className="super-bar-stat-preview__value" />
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
