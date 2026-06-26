import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import LivesIcon from '../../ui/Lives/LivesIcon.jsx';
import SuperBarStatBadge from './SuperBarStatBadge.jsx';
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
 * @param {boolean} livesShopEnabled
 * @returns {string}
 */
function formatLivesShopLabel(livesShopEnabled) {
  return livesShopEnabled
    ? 'Można kupić w sklepie'
    : 'Niedostępne w sklepie';
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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const updatePreviewPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const previewWidth = 240;
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
            className="super-bar-stat-preview super-bar-stat-preview--lives"
            style={{ left: `${previewPos.x}px`, top: `${previewPos.y}px` }}
            aria-hidden="true"
          >
            <p className="super-bar-stat-preview__title">{livesLabel}</p>
            <p className="super-bar-stat-preview__label">{formatLivesMaxLabel(livesMax)}</p>
            <p className="super-bar-stat-preview__detail">{formatLivesShopLabel(livesShopEnabled)}</p>
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
