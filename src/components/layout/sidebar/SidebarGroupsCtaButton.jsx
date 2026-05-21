import { NavLink } from 'react-router-dom';
import '../navigation-shell.css';

function groupsBtnClassName({ isActive }) {
  return ['sidebar-cta__btn', isActive ? 'sidebar-cta__btn--active' : ''].filter(Boolean).join(' ');
}

/** Przycisk „Twoje grupy". */
export default function SidebarGroupsCtaButton({ to, enabled, children, onNavigate }) {
  if (!enabled) {
    return null;
  }

  return (
    <div className="sidebar-cta">
      <NavLink to={to} end className={groupsBtnClassName} onClick={onNavigate}>
        {children}
      </NavLink>
    </div>
  );
}
