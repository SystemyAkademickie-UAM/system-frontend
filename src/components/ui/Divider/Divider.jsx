import './Divider.css';

/**
 * Cienka kreska odzielająca sekcje (lekko ciemniejsza od tła aplikacji).
 *
 * @param {Object} props
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal']
 * @param {string} [props.className]
 * @param {string} [props.length] — np. '100%', '12rem', '1px' (vertical: wysokość)
 */
export default function Divider({ orientation = 'horizontal', className = '', length }) {
  const style = length
    ? orientation === 'vertical'
      ? { height: length }
      : { width: length }
    : undefined;

  return (
    <hr
      className={[
        'maq-divider',
        orientation === 'vertical' ? 'maq-divider--vertical' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
}
