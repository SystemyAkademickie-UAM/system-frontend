import './LoadingSpinner.css';

/**
 * Spinner ładowania w stylu MAQ (identyczny z /welcome).
 *
 * @param {Object} props
 * @param {string} [props.label='Ładowanie…']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {string} [props.className]
 */
export default function LoadingSpinner({
  label = 'Ładowanie…',
  size = 'md',
  className = '',
}) {
  return (
    <div
      className={['maq-loading-spinner-container', `maq-loading-spinner-container--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-busy="true"
      aria-label={label}
      role="status"
    >
      <span className="maq-loading-spinner" aria-hidden="true" />
    </div>
  );
}
