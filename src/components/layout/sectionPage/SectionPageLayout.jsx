import { Divider, SubNav } from '../../ui/index.js';
import './SectionPageLayout.css';

/**
 * Standardowy układ strony (nagłówek 32px, opcjonalny SubNav, kreska, treść).
 * Nie stosować na /main/* ani profilu studenta.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.eyebrow]
 * @param {string} [props.subNavAriaLabel]
 * @param {{ id: string, label: string, to?: string, end?: boolean }[]} [props.subNavItems]
 * @param {string} [props.activeSubNavId]
 * @param {(id: string) => void} [props.onSubNavSelect]
 * @param {import('react').ReactNode} [props.headerAction]
 * @param {import('react').ReactNode} [props.toolbar]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function SectionPageLayout({
  title,
  eyebrow,
  subNavAriaLabel,
  subNavItems,
  activeSubNavId,
  onSubNavSelect,
  headerAction,
  toolbar,
  className = '',
  children,
}) {
  return (
    <section
      className={['maq-section-page', className].filter(Boolean).join(' ')}
      aria-labelledby="maq-section-page-title"
    >
      <div className="maq-section-page__head">
        {eyebrow ? <p className="maq-section-page__eyebrow">{eyebrow}</p> : null}

        <div className="maq-section-page__title-row">
          <h1 id="maq-section-page-title" className="maq-section-page__title">
            {title}
          </h1>
          {headerAction ? <div className="maq-section-page__header-action">{headerAction}</div> : null}
        </div>

        {subNavItems && subNavItems.length > 0 ? (
          <SubNav
            ariaLabel={subNavAriaLabel ?? 'Nawigacja podstrony'}
            items={subNavItems}
            activeId={activeSubNavId}
            onSelect={onSubNavSelect}
            className="maq-section-page__sub-nav"
          />
        ) : null}

        <Divider className="maq-section-page__divider" />
      </div>

      <div className="maq-section-page__body">
        {toolbar ? <div className="maq-section-page__toolbar">{toolbar}</div> : null}
        {children}
      </div>
    </section>
  );
}
