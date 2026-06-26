import { useGroupLives } from '../../../context/GroupLivesContext.jsx';
import '../Currency/CurrencyDisplay.css';

/**
 * Ikona żyć grupy — emoji z konfiguracji /groupsettings/lives.
 *
 * @param {Object} props
 * @param {string} [props.symbol] — nadpisanie emoji (np. ❤️)
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel]
 */
export default function LivesIcon({
  symbol,
  size = 'md',
  className = '',
  ariaLabel,
}) {
  const groupLives = useGroupLives();
  const resolvedSymbol = symbol ?? groupLives.symbol;
  const resolvedAriaLabel = ariaLabel ?? groupLives.label ?? 'Życia';

  return (
    <span
      className={[
        'maq-currency-icon',
        'maq-currency-icon--emoji',
        `maq-currency-icon--${size}`,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={resolvedAriaLabel}
      role="img"
    >
      {resolvedSymbol}
    </span>
  );
}
