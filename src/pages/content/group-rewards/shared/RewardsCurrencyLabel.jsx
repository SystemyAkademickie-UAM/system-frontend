import { CurrencyIcon } from '../../../../components/ui/index.js';
import { useGroupCurrency } from '../../../../context/GroupCurrencyContext.jsx';

/**
 * Etykieta pola kwoty z ikoną waluty grupy.
 *
 * @param {Object} props
 * @param {string} [props.htmlFor]
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export default function RewardsCurrencyLabel({
  htmlFor,
  children,
  className = '',
}) {
  const { name: currencyName } = useGroupCurrency();

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
