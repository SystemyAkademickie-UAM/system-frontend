import { NavLink, Outlet } from 'react-router-dom';
import './GroupMainLayout.css';

function subNavClassName({ isActive }) {
  return isActive ? 'group-main-nav__link group-main-nav__link--active' : 'group-main-nav__link';
}

export default function GroupMainLayout() {
  return (
    <div className="group-main-layout">
      <nav className="group-main-nav" aria-label="Nawigacja sekcji grupy">
        <NavLink to="." end className={subNavClassName}>
          Strona główna
        </NavLink>
        <span className="group-main-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="activity" className={subNavClassName}>
          Lista aktywności
        </NavLink>
        <span className="group-main-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="ranks" className={subNavClassName}>
          Rangi i odznaki
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
