import SuperBarStatBadge from './SuperBarStatBadge.jsx';
import './SuperBar.css';

/**
 * Ikona + kapsuła ze statystyką (życia, waluta).
 * @param {import('react').ReactNode} icon
 * @param {string} value
 * @param {string} [ariaLabel]
 * @param {string} [title] — natywny tooltip (np. zgromadzona waluta)
 */
export default function SuperBarStat({ icon, value, ariaLabel, title }) {
  return (
    <div className="super-bar-stat" aria-label={ariaLabel} title={title}>
      <span className="super-bar-stat__icon">{icon}</span>
      <SuperBarStatBadge value={value} />
    </div>
  );
}

