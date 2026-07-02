import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import ActivityCard from './ActivityCard.jsx';
import { positionCursorTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
import './ActivityProgressIcon.css';

/**
 * Okrągła ikona postępu aktywności — klik przełącza stan, hover pokazuje ActivityCard.
 *
 * @param {Object} props
 * @param {Object} props.activity — { name, storyDescription, didacticDescription, rewardAmount, rewardEmoji }
 * @param {boolean} props.unlocked
 * @param {() => void} [props.onToggle]
 * @param {string} [props.ariaLabel]
 */
export default function ActivityProgressIcon({
  activity,
  unlocked,
  onToggle,
  ariaLabel,
}) {
  const bubbleRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLayout, setPreviewLayout] = useState(null);

  const updatePreviewPosition = useCallback(() => {
    const bubble = bubbleRef.current;
    if (!bubble) {
      return;
    }

    setPreviewLayout(positionCursorTooltip({
      clientX: cursorRef.current.x,
      clientY: cursorRef.current.y,
      bubbleRect: bubble.getBoundingClientRect(),
    }));
  }, []);

  useLayoutEffect(() => {
    if (!previewVisible) {
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
  }, [previewVisible, updatePreviewPosition, activity.name]);

  const handleMouseEnter = (event) => {
    cursorRef.current = { x: event.clientX, y: event.clientY };
    setPreviewVisible(true);
  };

  const handleMouseMove = (event) => {
    if (!previewVisible) {
      return;
    }

    cursorRef.current = { x: event.clientX, y: event.clientY };
    updatePreviewPosition();
  };

  const handleMouseLeave = () => {
    setPreviewVisible(false);
  };

  const label = ariaLabel ?? `${activity.name} — ${unlocked ? 'odblokowana' : 'zablokowana'}`;

  return (
    <>
      <button
        type="button"
        className={[
          'maq-activity-progress-icon',
          unlocked ? 'maq-activity-progress-icon--unlocked' : 'maq-activity-progress-icon--locked',
        ].join(' ')}
        aria-label={label}
        aria-pressed={unlocked}
        onClick={onToggle}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {unlocked ? (
          <AssetSvg name={SVG_ICONS.status.check} width={16} height={16} alt="" />
        ) : (
          <AssetSvg name={SVG_ICONS.status.lock} width={16} height={16} alt="" />
        )}
      </button>

      {previewVisible
        ? createPortal(
          <div
            ref={bubbleRef}
            className="maq-activity-card-preview"
            style={{
              visibility: previewLayout ? 'visible' : 'hidden',
              left: previewLayout ? `${previewLayout.left}px` : 0,
              top: previewLayout ? `${previewLayout.top}px` : 0,
            }}
            aria-hidden="true"
          >
            <ActivityCard
              name={activity.name}
              storyDescription={activity.storyDescription}
              didacticDescription={activity.didacticDescription}
              rewardAmount={activity.rewardAmount}
              rewardEmoji={activity.rewardEmoji}
            />
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
