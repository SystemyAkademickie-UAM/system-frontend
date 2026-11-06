/**
 * @file Divider.jsx
 * @description Komponent interfejsu użytkownika Divider.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import './Divider.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Cienka kreska odzielająca sekcje (lekko ciemniejsza od tła aplikacji).
 *
 * @param {Object} props
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal']
 * @param {string} [props.className]
 * @param {string} [props.length] — np. '100%', '12rem', '1px' (vertical: wysokość)
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function Divider({ orientation = 'horizontal', className = '', length }) {
  const style = length
    ? orientation === 'vertical'
      ? { height: length }
      : { width: length }

: undefined;

// === RENDEROWANIE WIDOKU ===
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
