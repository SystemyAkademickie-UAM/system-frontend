import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Badge from './Badge.jsx';
import BadgeIcon from './BadgeIcon.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { getBadgeCssVars } from './badgeCssVars.js';
import { BADGE_RARITY, getBadgeRarityConfig } from './badgeRarity.js';
import { positionSideTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
import './BadgeMini.css';

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
  const bubbleRef = useRef(null);
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLayout, setPreviewLayout] = useState(null);

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
    const trigger = buttonRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) {
      return;
    }

    setPreviewLayout(positionSideTooltip({
      triggerRect: trigger.getBoundingClientRect(),
      bubbleRect: bubble.getBoundingClientRect(),
      placement: 'right',
      gap: PREVIEW_GAP,
    }));
  }, []);

  useLayoutEffect(() => {
    if (!previewVisible || !canPreview) {
      setPreviewLayout(null);
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
  }, [previewVisible, canPreview, updatePreviewPosition, name, storyDescription, didacticDescription]);

  const handleMouseEnter = () => {
    if (!canPreview) return;
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
            ref={bubbleRef}
            className="maq-badge-mini-preview"
            style={{
              visibility: previewLayout ? 'visible' : 'hidden',
              left: previewLayout ? `${previewLayout.left}px` : 0,
              top: previewLayout ? `${previewLayout.top}px` : 0,
            }}
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
