import { NavLink } from 'react-router-dom';
import '../navigation-shell.css';

function coursesBtnClassName({ isActive }) {
  return ['sidebar-cta__btn', isActive ? 'sidebar-cta__btn--active' : ''].filter(Boolean).join(' ');
}

/** Przycisk „Twoje grupy” / „Twoje Kursy”. */
export default function SidebarCoursesCtaButton({ to, enabled, children, onNavigate }) {
  if (!enabled) {
    return null;
  }

  return (
    <div className="sidebar-cta">
      <NavLink to={to} end className={coursesBtnClassName} onClick={onNavigate}>
        {children}
      </NavLink>
    </div>
  );
}
