/**
 * @file SidebarGroupsCtaButton.jsx
 * @description Komponent przycisku SidebarGroupsCtaButton z obsługą wariantów wizualnych i interakcji.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { NavLink } from 'react-router-dom';
import '../navigation-shell.css';

// === GŁÓWNY KOMPONENT WIDOKU ===
function groupsBtnClassName({ isActive }) {
  return ['sidebar-cta__btn', isActive ? 'sidebar-cta__btn--active' : ''].filter(Boolean).join(' ');
}

/** Przycisk „Twoje grupy". */

export default function SidebarGroupsCtaButton({ to, enabled, children, onNavigate }) {
  if (!enabled) {
    return null;
  }

// === RENDEROWANIE WIDOKU ===
  return (
    <div className="sidebar-cta">
      <NavLink to={to} end className={groupsBtnClassName} onClick={onNavigate}>
        {children}
      </NavLink>
    </div>
  );
}
