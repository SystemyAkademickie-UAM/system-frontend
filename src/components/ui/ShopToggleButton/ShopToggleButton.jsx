import Button from '../Button/Button.jsx';
import {
  SHOP_TOGGLE_STATE_CONFIG,
  resolveShopToggleState,
} from './shopToggleStates.js';
import './ShopToggleButton.css';

/**
 * Przełącznik otwarcia / zamknięcia sklepu (konfigurowalne stany).
 *
 * @param {Object} props
 * @param {boolean} props.isShopOpen
 * @param {() => void} props.onToggle
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */
export default function ShopToggleButton({
  isShopOpen,
  onToggle,
  disabled = false,
  className = '',
}) {
  const stateKey = resolveShopToggleState(isShopOpen);
  const config = SHOP_TOGGLE_STATE_CONFIG[stateKey];

  return (
    <Button
      type="button"
      variant={config.variant}
      size="md"
      disabled={disabled}
      onClick={onToggle}
      className={['maq-shop-toggle-btn', className].filter(Boolean).join(' ')}
      aria-label={config.ariaLabel}
    >
      {config.label}
    </Button>
  );
}

export { SHOP_TOGGLE_STATE, SHOP_TOGGLE_STATE_CONFIG, resolveShopToggleState } from './shopToggleStates.js';
