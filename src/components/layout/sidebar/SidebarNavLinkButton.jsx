import { NavLink } from 'react-router-dom';
import NavGlyph from '../NavGlyph.jsx';

function navClassName({ isActive }) {
  return isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link';
}

/**
 * Pojedynczy link w pasku bocznym — stały `to` z konfiguracji szablonu.
 * @param {{ to: string, label: string, iconId: string, enabled: boolean, matchEnd?: boolean, onNavigate?: () => void }} props
 */
export default function SidebarNavLinkButton({ to, label, iconId, enabled, matchEnd = false, onNavigate }) {
  if (!enabled || !to) {
    return null;
  }

  return (
    <li>
      <NavLink to={to} end={matchEnd} className={navClassName} onClick={onNavigate}>
        <NavGlyph id={iconId} />
        <span>{label}</span>
      </NavLink>
    </li>
  );
}
