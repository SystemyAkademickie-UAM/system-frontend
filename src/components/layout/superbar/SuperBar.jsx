import SuperBarBreadcrumb from './SuperBarBreadcrumb.jsx';
import SuperBarBackButton from './SuperBarBackButton.jsx';
import SuperBarCurrencyStat from './SuperBarCurrencyStat.jsx';
import SuperBarLivesStat from './SuperBarLivesStat.jsx';
import SuperBarSettingsButton from './SuperBarSettingsButton.jsx';
import NotificationBell from './NotificationBell.jsx';
import SuperBarUserMenu from './SuperBarUserMenu.jsx';
import { useOptionalGroupId } from '../../../hooks/useOptionalGroupId.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import './SuperBar.css';

/** Placeholdery — używane gdy brak danych z sesji. */
const PLACEHOLDER_DISPLAY_NAME = 'Użytkownik';
const PLACEHOLDER_ROLE_LABEL = 'Student';
const DEFAULT_LIVES_DISPLAY = '0';
const DEFAULT_CURRENCY_DISPLAY = '0';

/**
 * Górny pasek nawigacji (superBar) — statystyki, ustawienia, konto.
 * @param {Object} props
 * @param {string | null} [props.displayName] — ksywka lub nazwa z sesji (null = placeholder)
 * @param {string} [props.roleLabel]
 * @param {string | null} [props.avatarUrl] — awatar z profilu użytkownika
 * @param {string} [props.livesLabel] — etykieta systemu żyć z konfiguracji grupy
 * @param {boolean} [props.livesEnabled] — czy system żyć jest włączony
 * @param {number | null} [props.livesMax] — maksymalna liczba żyć
 * @param {boolean} [props.livesShopEnabled] — czy życia można kupić w sklepie
 * @param {string} [props.currencyDisplay] — aktualna waluta studenta
 * @param {string} [props.totalEarnedDisplay] — zgromadzona waluta (podgląd hover)
 * @param {string} [props.currencyLabel] — nazwa waluty grupy
 * @param {() => void} [props.onNavigate]
 * @param {boolean} [props.showMenuButton]
 * @param {boolean} [props.menuExpanded]
 * @param {() => void} [props.onMenuToggle]
 * @param {boolean} [props.isLoading] — czy trwa ładowanie sesji
 * @param {{ groupName: string | null, groupPath: string | null, segments: { label: string, to?: string }[], back?: { ariaLabel?: string, fallbackTo: string } | null } | null} [props.breadcrumb]
 */
export default function SuperBar({
  displayName,
  roleLabel = PLACEHOLDER_ROLE_LABEL,
  avatarUrl = null,
  livesDisplay = DEFAULT_LIVES_DISPLAY,
  livesLabel = 'Życia',
  livesEnabled = false,
  livesMax = null,
  livesShopEnabled = false,
  currencyDisplay = DEFAULT_CURRENCY_DISPLAY,
  totalEarnedDisplay = '0',
  currencyLabel = 'Waluta',
  onNavigate,
  showMenuButton = false,
  menuExpanded = false,
  onMenuToggle,
  isLoading = false,
  breadcrumb = null,
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
        {breadcrumb?.back ? (
          <SuperBarBackButton
            ariaLabel={breadcrumb.back.ariaLabel}
            fallbackTo={breadcrumb.back.fallbackTo}
            onNavigate={onNavigate}
          />
        ) : null}
        {breadcrumb ? (
          <SuperBarBreadcrumb
            homePath={breadcrumb.homePath}
            groupName={breadcrumb.groupName}
            groupPath={breadcrumb.groupPath}
            segments={breadcrumb.segments}
          />
        ) : null}
      </div>
      <div className="super-bar__end">
        {showStudentGroupStats ? (
          <>
            {livesEnabled ? (
              <SuperBarLivesStat
                currentAmount={livesDisplay}
                livesLabel={livesLabel}
                livesMax={livesMax}
                livesShopEnabled={livesShopEnabled}
                ariaLabel={`${livesLabel}: ${livesDisplay}`}
              />
            ) : null}
            <SuperBarCurrencyStat
              currentAmount={currencyDisplay}
              totalEarned={totalEarnedDisplay}
              currencyLabel={currencyLabel}
              ariaLabel={`${currencyLabel}: ${currencyDisplay}`}
            />
          </>
        ) : null}
        <NotificationBell />
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
