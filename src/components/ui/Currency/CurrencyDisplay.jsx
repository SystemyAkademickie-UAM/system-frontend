import { useGroupCurrency } from '../../../context/GroupCurrencyContext.jsx';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import './CurrencyDisplay.css';

/**
 * Ikona waluty grupy — emoji lub SVG z kontekstu / props.
 *
 * @param {Object} props
 * @param {string} [props.symbol] — nadpisanie emoji (np. 🥕)
 * @param {string} [props.iconFile] — plik SVG w public/assets/svg/
 * @param {string} [props.iconUrl] — pełny URL obrazka
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel]
 */
export function CurrencyIcon({
  symbol,
  iconFile,
  iconUrl,
  size = 'md',
  className = '',
  ariaLabel = 'Waluta',
}) {
  const groupCurrency = useGroupCurrency();
  const resolvedSymbol = symbol ?? groupCurrency.symbol;
  const resolvedIconFile = iconFile ?? groupCurrency.iconFile;
  const resolvedIconUrl = iconUrl ?? groupCurrency.iconUrl;

  if (resolvedIconUrl) {
    return (
      <img
        src={resolvedIconUrl}
        alt=""
        className={['maq-currency-icon', `maq-currency-icon--${size}`, className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
      />
    );
  }

  if (resolvedIconFile) {
    return (
      <AssetSvg
        name={resolvedIconFile}
        className={['maq-currency-icon', `maq-currency-icon--${size}`, className].filter(Boolean).join(' ')}
        alt=""
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <span
      className={['maq-currency-icon', 'maq-currency-icon--emoji', `maq-currency-icon--${size}`, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      role="img"
    >
      {resolvedSymbol}
    </span>
  );
}

/**
 * Kwota waluty z ikoną (np. „10 🥕”).
 *
 * @param {Object} props
 * @param {number | string} props.amount
 * @param {string} [props.symbol]
 * @param {string} [props.iconFile]
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.showIcon=true]
 * @param {string} [props.className]
 */
export default function CurrencyDisplay({
  amount,
  symbol,
  iconFile,
  iconUrl,
  size = 'md',
  showIcon = true,
  className = '',
}) {
  return (
    <span className={['maq-currency-display', `maq-currency-display--${size}`, className].filter(Boolean).join(' ')}>
      <span className="maq-currency-display__amount">{amount}</span>
      {showIcon ? (
        <CurrencyIcon symbol={symbol} iconFile={iconFile} iconUrl={iconUrl} size={size} />
      ) : null}
    </span>
  );
}
