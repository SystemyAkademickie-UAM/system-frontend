/**
 * @file SidebarNavRail.jsx
 * @description Komponent interfejsu użytkownika SidebarNavRail.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import '../navigation-shell.css';

/** Lista pozycji nawigacji (ul). */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function SidebarNavRail({ 'aria-label': ariaLabel, children }) {
  return (
    <ul className="sidebar-nav" aria-label={ariaLabel}>
      {children}
    </ul>
  );
}
