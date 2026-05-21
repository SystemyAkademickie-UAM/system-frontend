import { PageHeader, SubNav } from '../ui/index.js';
import './PageUnavailable.css';

/**
 * Placeholder strony w budowie: nagłówek, opcjonalny SubNav, komunikat o niedostępności.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.message]
 * @param {string} [props.subNavAriaLabel]
 * @param {{ id: string, label: string, to?: string, end?: boolean }[]} [props.subNavItems]
 * @param {string} [props.activeSubNavId]
 * @param {(id: string) => void} [props.onSubNavSelect]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function PageUnavailable({
  title,
  description,
  message = 'Ta strona jest obecnie niedostępna. Funkcjonalność zostanie udostępniona w kolejnej wersji aplikacji.',
  subNavAriaLabel,
  subNavItems,
  activeSubNavId,
  onSubNavSelect,
  className = '',
  children,
}) {
  return (
    <section className={['page-unavailable', className].filter(Boolean).join(' ')} aria-label={title}>
      <PageHeader title={title} description={description} />

      {subNavItems && subNavItems.length > 0 ? (
        <SubNav
          ariaLabel={subNavAriaLabel ?? 'Nawigacja podstrony'}
          items={subNavItems}
          activeId={activeSubNavId}
          onSelect={onSubNavSelect}
          className="page-unavailable__sub-nav"
        />
      ) : null}

      {children}

      <p className="page-unavailable__notice" role="status">
        {message}
      </p>
    </section>
  );
}
