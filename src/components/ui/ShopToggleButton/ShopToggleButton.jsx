/**
 * @file ShopToggleButton.jsx
 * @description Komponent przycisku ShopToggleButton z obsługą wariantów wizualnych i interakcji.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import Button from '../Button/Button.jsx';
import {
  SHOP_TOGGLE_STATE_CONFIG,
  resolveShopToggleState,
} from './shopToggleStates.js';
import './ShopToggleButton.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Przełącznik otwarcia / zamknięcia sklepu (konfigurowalne stany).
 *
 * @param {Object} props
 * @param {boolean} props.isShopOpen
 * @param {() => void} props.onToggle
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function ShopToggleButton({
  isShopOpen,
  onToggle,
  disabled = false,
  className = '',
}) {
  const stateKey = resolveShopToggleState(isShopOpen);

const config = SHOP_TOGGLE_STATE_CONFIG[stateKey];

// === RENDEROWANIE WIDOKU ===
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
