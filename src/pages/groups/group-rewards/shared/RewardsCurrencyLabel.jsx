/**
 * @file RewardsCurrencyLabel.jsx
 * @description Główny komponent widoku strony dla obszaru RewardsCurrencyLabel.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { CurrencyIcon } from '../../../../components/ui/index.js';
import { useGroupCurrency } from '../../../../context/GroupCurrencyContext.jsx';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Etykieta pola kwoty z ikoną waluty grupy.
 *
 * @param {Object} props
 * @param {string} [props.htmlFor]
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function RewardsCurrencyLabel({
  htmlFor,
  children,
  className = '',
}) {

const { name: currencyName } = useGroupCurrency();

// === RENDEROWANIE WIDOKU ===
  return (
    <label
      htmlFor={htmlFor}
      className={['rewards-modal__label', 'rewards-modal__label--with-icon', className].filter(Boolean).join(' ')}
    >
      <span>{children}</span>
      <CurrencyIcon size="sm" ariaLabel={currencyName} />
    </label>
  );
}
