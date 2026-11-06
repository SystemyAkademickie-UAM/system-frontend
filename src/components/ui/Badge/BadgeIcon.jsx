/**
 * @file BadgeIcon.jsx
 * @description Komponent interfejsu użytkownika BadgeIcon.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { DEFAULT_BADGE_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * @param {Object} props
 * @param {string} [props.iconFile]
 * @param {string} [props.icon]
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function BadgeIcon({ iconFile, icon }) {
  const emoji = normalizeRankBadgeIcon(icon ?? iconFile, DEFAULT_BADGE_EMOJI);

  return (
    <div className="maq-badge__icon-circle">
      <span className="maq-badge__icon-emoji" aria-hidden="true">{emoji}</span>
    </div>
  );
}
