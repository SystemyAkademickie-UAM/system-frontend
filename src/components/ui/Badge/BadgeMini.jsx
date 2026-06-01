import { useCallback, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Badge from './Badge.jsx';
import BadgeIcon from './BadgeIcon.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { getBadgeCssVars } from './badgeCssVars.js';
import { BADGE_RARITY, getBadgeRarityConfig } from './badgeRarity.js';
import './BadgeMini.css';

const PREVIEW_WIDTH = 533;
const PREVIEW_GAP = 12;

/**
 * Mini kafelek odznaki — ten sam układ co Badge, w mniejszej skali.
 * Opcjonalny podgląd pełnej odznaki przy najechaniu (jak w SuperBar / tabelach).
 */
export default function BadgeMini({
  rarity = BADGE_RARITY.common,
  name,
  storyDescription,
  didacticDescription,
  rewardAmount = 0,
  rewardEmoji,
  earnedAt,
  showEarnedAt = true,
  icon,
  iconFile,
  selected,
  defaultSelected = false,
  onSelectedChange,
  previewOnHover = false,
  className = '',
}) {
  const labelId = useId();
  const buttonRef = useRef(null);
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const isSelected = selected !== undefined ? selected : internalSelected;
  const config = getBadgeRarityConfig(rarity);
  const canPreview = previewOnHover && storyDescription && didacticDescription;

  const toggleSelected = () => {
    const next = !isSelected;
    if (selected === undefined) {
      setInternalSelected(next);
    }
    onSelectedChange?.(next);
  };

  const updatePreviewPosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const previewHeight = 297;
    let left = rect.right + PREVIEW_GAP;

    if (left + PREVIEW_WIDTH > window.innerWidth - 16) {
      left = rect.left - PREVIEW_WIDTH - PREVIEW_GAP;
    }

    left = Math.max(16, left);
    const top = Math.max(
      16,
      Math.min(rect.top, window.innerHeight - previewHeight - 16),
    );

    setPreviewPos({ x: left, y: top });
  }, []);

  const handleMouseEnter = () => {
    if (!canPreview) return;
    updatePreviewPosition();
    setPreviewVisible(true);
  };

  const handleMouseLeave = () => {
    setPreviewVisible(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={[
          'maq-badge-mini',
          isSelected ? 'maq-badge-mini--selected' : '',
          className,
        ].filter(Boolean).join(' ')}
        data-rarity={rarity}
        style={getBadgeCssVars(rarity, { selected: isSelected })}
        aria-pressed={isSelected}
        aria-labelledby={labelId}
        onClick={toggleSelected}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="maq-badge-mini__icon-slot">
          <BadgeIcon iconFile={iconFile} />
        </span>

        <span className="maq-badge-mini__content">
          <span id={labelId} className="maq-badge-mini__name">{name}</span>
          <span className="maq-badge-mini__rarity">{config.label}</span>
          <span className="maq-badge-mini__divider" aria-hidden="true" />
          <span className="maq-badge-mini__reward">
            <span className="maq-badge-mini__reward-label">Nagroda</span>
            <CurrencyDisplay
              amount={rewardAmount}
              symbol={rewardEmoji}
              size="md"
              className="maq-badge-mini__reward-value"
            />
          </span>
        </span>
      </button>

      {canPreview && previewVisible
        ? createPortal(
          <div
            className="maq-badge-mini-preview"
            style={{ left: `${previewPos.x}px`, top: `${previewPos.y}px` }}
            aria-hidden="true"
          >
            <Badge
              rarity={rarity}
              name={name}
              storyDescription={storyDescription}
              didacticDescription={didacticDescription}
              rewardAmount={rewardAmount}
              rewardEmoji={rewardEmoji}
              earnedAt={earnedAt}
              showEarnedAt={showEarnedAt}
              icon={icon}
              iconFile={iconFile}
            />
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
