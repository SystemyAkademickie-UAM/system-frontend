import { PageHeader, SubNav } from '../ui/index.js';
import '../../pages/content/shared/groupSectionPage.css';
import './PageUnavailable.css';

const DEFAULT_UNAVAILABLE_MESSAGE =
  'Ta strona jest obecnie niedostępna. Funkcjonalność zostanie udostępniona w kolejnej wersji aplikacji.';

/**
 * Układ stron aplikacji (admin, superadmin, ustawienia) — wzorzec jak Uczestnicy.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.className]
 * @param {string} [props.subNavAriaLabel]
 * @param {{ id: string, label: string, to?: string, end?: boolean }[]} [props.subNavItems]
 * @param {string} [props.activeSubNavId]
 * @param {(id: string) => void} [props.onSubNavSelect]
 * @param {import('react').ReactNode} [props.headerAction]
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.unavailableMessage]
 * @param {boolean} [props.showUnavailableNotice]
 */
export default function AppSectionPage({
  title,
  description,
  className = '',
  subNavAriaLabel,
  subNavItems,
  activeSubNavId,
  onSubNavSelect,
  headerAction,
  children,
  unavailableMessage = DEFAULT_UNAVAILABLE_MESSAGE,
  showUnavailableNotice,
}) {
  const showNotice = showUnavailableNotice ?? !children;

  return (
    <div className="app-page-layout">
      <section
        className={['page-unavailable', 'members-page', className].filter(Boolean).join(' ')}
        aria-label={title}
      >
        {headerAction ? (
          <div className="members-page__header-row">
            <PageHeader title={title} description={description} />
            <div className="members-page__header-action">
              {headerAction}
            </div>
          </div>
        ) : (
          <PageHeader title={title} description={description} />
        )}

        {subNavItems && subNavItems.length > 0 ? (
          <div className="members-page__nav-row">
            <SubNav
              ariaLabel={subNavAriaLabel ?? 'Nawigacja podstrony'}
              items={subNavItems}
              activeId={activeSubNavId}
              onSelect={onSubNavSelect}
              className="members-page__sub-nav"
            />
          </div>
        ) : null}

        {children}

        {showNotice ? (
          <p className="members-page__notice" role="status">
            {unavailableMessage}
          </p>
        ) : null}
      </section>
    </div>
  );
}
