import SectionPageLayout from '../layout/sectionPage/SectionPageLayout.jsx';
import '../../pages/content/shared/groupSectionPage.css';
import './PageUnavailable.css';

const DEFAULT_UNAVAILABLE_MESSAGE =
  'Ta strona jest obecnie niedostępna. Funkcjonalność zostanie udostępniona w kolejnej wersji aplikacji.';

/**
 * Układ stron aplikacji (admin, superadmin) — oparty na SectionPageLayout.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description] — ignorowane (zachowane dla kompatybilności API)
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
  description: _description,
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
      <SectionPageLayout
        className={['page-unavailable', className].filter(Boolean).join(' ')}
        title={title}
        subNavItems={subNavItems}
        subNavAriaLabel={subNavAriaLabel}
        activeSubNavId={activeSubNavId}
        onSubNavSelect={onSubNavSelect}
        headerAction={headerAction}
      >
        {children}
        {showNotice ? (
          <p className="page-unavailable__notice" role="status">
            {unavailableMessage}
          </p>
        ) : null}
      </SectionPageLayout>
    </div>
  );
}
