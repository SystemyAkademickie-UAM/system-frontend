import SuperBarStatBadge from './SuperBarStatBadge.jsx';
import './SuperBar.css';

/**
 * Ikona + kapsuła ze statystyką (życia, waluta).
 * @param {import('react').ReactNode} icon
 * @param {string} value
 * @param {string} [ariaLabel]
 */
export default function SuperBarStat({ icon, value, ariaLabel }) {
  return (
    <div className="super-bar-stat" aria-label={ariaLabel}>
      <span className="super-bar-stat__icon">{icon}</span>
      <SuperBarStatBadge value={value} />
    </div>
  );
}

