/**
 * @file SidebarNavTreeItemButton.jsx
 * @description Komponent przycisku SidebarNavTreeItemButton z obsługą wariantów wizualnych i interakcji.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { NavLink } from 'react-router-dom';
import NavGlyph from '../NavGlyph.jsx';
import '../navigation-shell.css';

// === GŁÓWNY KOMPONENT WIDOKU ===
function navClassName({ isActive }) {
  return [
    'sidebar-nav__link',
    'sidebar-nav__link--tree-item',
    isActive ? 'sidebar-nav__link--active' : '',
  ]
    .filter(Boolean)

.join(' ');
}

/** Element drzewka — ikona i etykieta lekko wcięte w prawo. */
export default function SidebarNavTreeItemButton({
  to,
  label,
  iconId,
  matchEnd = false,
  onNavigate,
}) {

if (!to) {
    return null;
  }

// === RENDEROWANIE WIDOKU ===
  return (
    <li className="sidebar-nav__item sidebar-nav__item--tree-child">
      <NavLink to={to} end={matchEnd} className={navClassName} onClick={onNavigate}>
        {iconId ? <NavGlyph id={iconId} /> : null}
        <span className="sidebar-nav__label">{label}</span>
      </NavLink>
    </li>
  );
}
