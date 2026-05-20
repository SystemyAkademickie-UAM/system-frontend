import { IconMoney, IconStar } from './ShellIcons.jsx';
import SuperBarSettingsButton from './SuperBarSettingsButton.jsx';
import SuperBarStat from './SuperBarStat.jsx';
import SuperBarUserMenu from './SuperBarUserMenu.jsx';
import './SuperBar.css';

/** Placeholdery — docelowo dane z API / kontekstu sesji. */
const PLACEHOLDER_DISPLAY_NAME = 'NAZWA_GLOBALNA';
const PLACEHOLDER_ROLE_LABEL = 'STUDENT';
const PLACEHOLDER_LIVES = '3/3';
const PLACEHOLDER_CURRENCY = '5000';

/**
 * Górny pasek nawigacji (superBar) — statystyki, ustawienia, konto.
 * @param {Object} props
 * @param {string} [props.displayName]
 * @param {string} [props.roleLabel]
 * @param {string} [props.livesDisplay]
 * @param {string} [props.currencyDisplay]
 * @param {() => void} [props.onNavigate]
 * @param {boolean} [props.showMenuButton]
 * @param {boolean} [props.menuExpanded]
 * @param {() => void} [props.onMenuToggle]
 */
export default function SuperBar({
  displayName = PLACEHOLDER_DISPLAY_NAME,
  roleLabel = PLACEHOLDER_ROLE_LABEL,
  livesDisplay = PLACEHOLDER_LIVES,
  currencyDisplay = PLACEHOLDER_CURRENCY,
  onNavigate,
  showMenuButton = false,
  menuExpanded = false,
  onMenuToggle,
}) {
  return (
    <header className="super-bar">
      <div className="super-bar__start">
        {showMenuButton ? (
          <button
            type="button"
            className="super-bar__menu-btn"
            aria-expanded={menuExpanded}
            aria-label={menuExpanded ? 'Zamknij menu nawigacji' : 'Otwórz menu nawigacji'}
            onClick={onMenuToggle}
          >
            <span className="super-bar__menu-icon" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div className="super-bar__end">
        <SuperBarStat icon={<IconStar />} value={livesDisplay} ariaLabel={`Życia: ${livesDisplay}`} />
        <SuperBarStat icon={<IconMoney />} value={currencyDisplay} ariaLabel={`Waluta: ${currencyDisplay}`} />
        <SuperBarSettingsButton onNavigate={onNavigate} />
        <SuperBarUserMenu displayName={displayName} roleLabel={roleLabel} onNavigate={onNavigate} />
      </div>
    </header>
  );
}
