import { IconMoney, IconStar } from './ShellIcons.jsx';
import SuperBarSettingsButton from './SuperBarSettingsButton.jsx';
import SuperBarStat from './SuperBarStat.jsx';
import SuperBarUserMenu from './SuperBarUserMenu.jsx';
import { useOptionalGroupId } from '../../../hooks/useOptionalGroupId.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import './SuperBar.css';

/** Placeholdery — używane gdy brak danych z sesji. */
const PLACEHOLDER_DISPLAY_NAME = 'Użytkownik';
const PLACEHOLDER_ROLE_LABEL = 'Student';
const DEFAULT_LIVES_DISPLAY = '0/0';
const DEFAULT_CURRENCY_DISPLAY = '0';

/**
 * Górny pasek nawigacji (superBar) — statystyki, ustawienia, konto.
 * @param {Object} props
 * @param {string | null} [props.displayName] — ksywka lub nazwa z sesji (null = placeholder)
 * @param {string} [props.roleLabel]
 * @param {string | null} [props.avatarUrl] — awatar z profilu użytkownika
 * @param {string} [props.livesDisplay] — docelowo z API grupy
 * @param {string} [props.currencyDisplay] — aktualna waluta studenta
 * @param {string} [props.currencyTooltip] — podpowiedź przy najechaniu na walutę (np. zgromadzona all-time)
 * @param {() => void} [props.onNavigate]
 * @param {boolean} [props.showMenuButton]
 * @param {boolean} [props.menuExpanded]
 * @param {() => void} [props.onMenuToggle]
 * @param {boolean} [props.isLoading] — czy trwa ładowanie sesji
 */
export default function SuperBar({
  displayName,
  roleLabel = PLACEHOLDER_ROLE_LABEL,
  avatarUrl = null,
  livesDisplay = DEFAULT_LIVES_DISPLAY,
  currencyDisplay = DEFAULT_CURRENCY_DISPLAY,
  currencyTooltip,
  onNavigate,
  showMenuButton = false,
  menuExpanded = false,
  onMenuToggle,
  isLoading = false,
}) {
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const showStudentGroupStats = role === APP_ROLE.STUDENT && groupId !== null;
  const resolvedDisplayName = displayName || PLACEHOLDER_DISPLAY_NAME;

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
        {showStudentGroupStats ? (
          <>
            <SuperBarStat icon={<IconStar />} value={livesDisplay} ariaLabel={`Życia: ${livesDisplay}`} />
            <SuperBarStat
              icon={<IconMoney />}
              value={currencyDisplay}
              ariaLabel={`Waluta: ${currencyDisplay}`}
              title={currencyTooltip || undefined}
            />
          </>
        ) : null}
        <SuperBarSettingsButton onNavigate={onNavigate} />
        <SuperBarUserMenu
          displayName={resolvedDisplayName}
          roleLabel={roleLabel}
          avatarUrl={avatarUrl}
          onNavigate={onNavigate}
          isLoading={isLoading}
        />
      </div>
    </header>
  );
}
