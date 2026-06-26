import { DEFAULT_BADGE_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';

/**
 * @param {Object} props
 * @param {string} [props.iconFile]
 * @param {string} [props.icon]
 */
export default function BadgeIcon({ iconFile, icon }) {
  const emoji = normalizeRankBadgeIcon(icon ?? iconFile, DEFAULT_BADGE_EMOJI);

  return (
    <div className="maq-badge__icon-circle">
      <span className="maq-badge__icon-emoji" aria-hidden="true">{emoji}</span>
    </div>
  );
}
