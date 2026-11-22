/**
 * @file PageAvailable.jsx
 * @description Komponent interfejsu użytkownika PageAvailable.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { PageHeader, SubNav } from '../ui/index.js';
import './PageUnavailable.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
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

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function PageAvailable({
  title,
  description,

  subNavAriaLabel,
  subNavItems,
  activeSubNavId,
  onSubNavSelect,
  className = '',

  children,
}) {

// === RENDEROWANIE WIDOKU ===
return (
    <section className={['page-unavailable', className].filter(Boolean).join(' ')} aria-label={title}>
      <PageHeader title={title} description={description} />

      {subNavItems && subNavItems.length > 0 && (
        <SubNav
          ariaLabel={subNavAriaLabel ?? 'Nawigacja podstrony'}
          items={subNavItems}
          activeId={activeSubNavId}
          onSelect={onSubNavSelect}
          className="page-unavailable__sub-nav"
        />
      )}

      {children}
    </section>
  );
}
