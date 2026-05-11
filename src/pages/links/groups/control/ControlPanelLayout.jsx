import { NavLink, Outlet } from 'react-router-dom';
import './ControlPanelLayout.css';

function subNavClassName({ isActive }) {
  return isActive ? 'control-panel-nav__link control-panel-nav__link--active' : 'control-panel-nav__link';
}

export default function ControlPanelLayout() {
  return (
    <div className="control-panel-layout">
      <nav className="control-panel-nav" aria-label="Nawigacja panelu prowadzącego">
        <NavLink to="." end className={subNavClassName}>
          Strona główna
        </NavLink>
        <span className="control-panel-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="users" className={subNavClassName}>
          Użytkownicy
        </NavLink>
        <span className="control-panel-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="activity" className={subNavClassName}>
          Etapy i aktywności
        </NavLink>
        <span className="control-panel-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="posts" className={subNavClassName}>
          Wpisy
        </NavLink>
        <span className="control-panel-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="ranksandbadges" className={subNavClassName}>
          Odznaki i rangi
        </NavLink>
        <span className="control-panel-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="shopitems" className={subNavClassName}>
          Przedmioty sklepowe
        </NavLink>
        <span className="control-panel-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="currency" className={subNavClassName}>
          Waluta
        </NavLink>
        <span className="control-panel-nav__sep" aria-hidden="true">
          |
        </span>
        <NavLink to="health" className={subNavClassName}>
          System żyć
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
