import './SuperBar.css';

/** Kapsuła z wartością (np. 3/3, 5000). */
export default function SuperBarStatBadge({ value, className = '' }) {
  return (
    <span className={['super-bar-stat-badge', className].filter(Boolean).join(' ')}>{value}</span>
  );
}
