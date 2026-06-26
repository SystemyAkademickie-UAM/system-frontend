import Button from '../Button/Button.jsx';
import {
  VIEW_LAYOUT_CONFIG,
  getNextViewLayout,
  resolveViewLayoutConfigKey,
} from './viewLayoutStates.js';
import './ViewLayoutToggle.css';

/**
 * Dwustanowy przełącznik widoku tabelka / kafelki (jak przycisk sklepu).
 *
 * @param {Object} props
 * @param {'table' | 'tiles'} props.layout
 * @param {() => void} props.onToggle
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 */
export default function ViewLayoutToggle({
  layout,
  onToggle,
  disabled = false,
  className = '',
}) {
  const config = VIEW_LAYOUT_CONFIG[resolveViewLayoutConfigKey(layout)];

  return (
    <Button
      type="button"
      variant={config.variant}
      size="md"
      disabled={disabled}
      onClick={onToggle}
      className={['maq-view-layout-toggle', className].filter(Boolean).join(' ')}
      aria-label={config.ariaLabel}
    >
      {config.label}
    </Button>
  );
}

export {
  VIEW_LAYOUT,
  VIEW_LAYOUT_CONFIG,
  getNextViewLayout,
  resolveViewLayoutConfigKey,
} from './viewLayoutStates.js';
