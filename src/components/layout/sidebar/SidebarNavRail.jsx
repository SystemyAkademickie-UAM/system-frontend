import '../navigation-shell.css';

/** Lista pozycji nawigacji (ul). */
export default function SidebarNavRail({ 'aria-label': ariaLabel, children }) {
  return (
    <ul className="sidebar-nav" aria-label={ariaLabel}>
      {children}
    </ul>
  );
}
