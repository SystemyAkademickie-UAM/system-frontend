import { NavLink } from 'react-router-dom';

function coursesBtnClassName({ isActive }) {
  return ['sidebar__courses-btn', isActive ? 'sidebar__courses-btn--active' : ''].filter(Boolean).join(' ');
}

/**
 * Przycisk „Twoje Kursy” — zawsze ten sam adres z pathRegistry (przekazywany jako `to`).
 */
export default function SidebarCoursesCtaButton({ to, enabled, children, onNavigate }) {
  if (!enabled) {
    return null;
  }

  return (
    <NavLink to={to} end className={coursesBtnClassName} onClick={onNavigate}>
      {children}
    </NavLink>
  );
}
