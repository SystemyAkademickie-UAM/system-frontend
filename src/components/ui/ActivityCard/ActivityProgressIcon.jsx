import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import ActivityCard from './ActivityCard.jsx';
import './ActivityProgressIcon.css';

const PREVIEW_OFFSET = 16;
const PREVIEW_WIDTH = 320;

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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const updatePreviewPosition = useCallback((clientX, clientY) => {
    const maxLeft = window.innerWidth - PREVIEW_WIDTH - PREVIEW_OFFSET;
    const left = Math.min(clientX + PREVIEW_OFFSET, maxLeft);
    const top = Math.min(clientY + PREVIEW_OFFSET, window.innerHeight - 24);

    setPreviewPos({
      x: Math.max(PREVIEW_OFFSET, left),
      y: Math.max(PREVIEW_OFFSET, top),
    });
  }, []);

  const handleMouseEnter = (event) => {
    setPreviewVisible(true);
    updatePreviewPosition(event.clientX, event.clientY);
  };

  const handleMouseMove = (event) => {
    if (!previewVisible) return;
    updatePreviewPosition(event.clientX, event.clientY);
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
          <AssetSvg name="ui-activity-check.svg" width={16} height={16} alt="" />
        ) : (
          <AssetSvg name="ui-activity-lock.svg" width={16} height={16} alt="" />
        )}
      </button>

      {previewVisible
        ? createPortal(
          <div
            className="maq-activity-card-preview"
            style={{ left: `${previewPos.x}px`, top: `${previewPos.y}px` }}
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
