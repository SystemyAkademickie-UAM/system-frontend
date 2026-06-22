import { NavLink } from 'react-router-dom';
import NavGlyph from '../NavGlyph.jsx';
import '../navigation-shell.css';

function navClassName({ isActive }) {
  return ['sidebar-nav__link', isActive ? 'sidebar-nav__link--active' : ''].filter(Boolean).join(' ');
}

/** Pojedyncza pozycja nawigacji w sidebarze. */
export default function SidebarNavLinkButton({ to, label, iconId, enabled, matchEnd = false, onNavigate }) {
  if (!enabled || !to) {
    return null;
  }

  return (
    <li className="sidebar-nav__item">
      <NavLink to={to} end={matchEnd} className={navClassName} onClick={onNavigate}>
        <NavGlyph id={iconId} />
        <span className="sidebar-nav__label">{label}</span>
      </NavLink>
    </li>
  );
}
