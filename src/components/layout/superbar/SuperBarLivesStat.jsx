import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import LivesIcon from '../../ui/Lives/LivesIcon.jsx';
import SuperBarStatBadge from './SuperBarStatBadge.jsx';
import { positionCenteredTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
import './SuperBar.css';

/**
 * @param {number | null} livesMax
 * @returns {string}
 */
function formatLivesMaxLabel(livesMax) {
  if (livesMax == null || Number.isNaN(Number(livesMax))) {
    return 'Bez limitu';
  }
  return `Maksymalnie: ${Number(livesMax)}`;
}

/**
 * Statystyka żyć z podglądem konfiguracji po najechaniu.
 */
export default function SuperBarLivesStat({
  currentAmount,
  livesLabel = 'Życia',
  livesMax = null,
  livesShopEnabled = false,
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
  }, [previewVisible, updatePreviewPosition, livesMax, livesShopEnabled]);

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
        className="super-bar-stat super-bar-stat--lives"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="super-bar-stat__icon">
          <LivesIcon size="xl" ariaLabel={livesLabel} />
        </span>
        <SuperBarStatBadge value={currentAmount} />
      </div>

      {previewVisible
        ? createPortal(
          <div
            ref={bubbleRef}
            className={[
              'super-bar-stat-preview',
              'super-bar-stat-preview--lives',
              layout?.placement === 'bottom' ? 'super-bar-stat-preview--below' : '',
            ].filter(Boolean).join(' ')}
            style={{
              visibility: layout ? 'visible' : 'hidden',
              left: layout ? `${layout.left}px` : 0,
              top: layout ? `${layout.top}px` : 0,
            }}
            aria-hidden="true"
          >
            <p className="super-bar-stat-preview__title">{livesLabel}</p>
            <p className="super-bar-stat-preview__label">{formatLivesMaxLabel(livesMax)}</p>
            {livesShopEnabled ? (
              <p className="super-bar-stat-preview__detail">Można kupić w sklepie</p>
            ) : null}
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
