/**
 * @file SidebarNavSpacer.jsx
 * @description Komponent interfejsu użytkownika SidebarNavSpacer.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import '../navigation-shell.css';

/** Pionowa przerwa na pasku nawigacji (połowa wysokości przycisku). */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function SidebarNavSpacer() {
  return <li className="sidebar-nav__spacer" aria-hidden="true" />;
}
