/**
 * Kontener listy nawigacji (pusty pasek lub wypełniony przyciskami).
 */
export default function SidebarNavRail({ 'aria-label': ariaLabel, variant = 'primary', children }) {
  const variantClass = variant === 'footer' ? 'sidebar__nav--footer' : '';
  return (
    <nav className={`sidebar__nav ${variantClass}`.trim()} aria-label={ariaLabel}>
      <ul className="sidebar__list">{children}</ul>
    </nav>
  );
}
