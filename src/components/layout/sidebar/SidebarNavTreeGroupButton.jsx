import { NavLink } from 'react-router-dom';
import NavGlyph from '../NavGlyph.jsx';
import { getFirstNavChildPath, isAnyNavItemActive, useNavPathname } from './sidebarNavUtils.js';
import '../navigation-shell.css';

/**
 * Nagłówek grupy drzewka — klik prowadzi do pierwszego elementu potomnego;
 * aktywny, gdy aktywny jest dowolny element potomny.
 */
export default function SidebarNavTreeGroupButton({
  label,
  iconId,
  children = [],
  onNavigate,
}) {
  const pathname = useNavPathname();
  const firstChildPath = getFirstNavChildPath(children);
  const isGroupActive = isAnyNavItemActive(pathname, children);

  if (!firstChildPath) {
    return null;
  }

  const className = [
    'sidebar-nav__link',
    'sidebar-nav__link--tree-group',
    isGroupActive ? 'sidebar-nav__link--active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <NavLink
      to={firstChildPath}
      className={() => className}
      onClick={onNavigate}
      aria-current={isGroupActive ? 'page' : undefined}
    >
      {iconId ? <NavGlyph id={iconId} /> : null}
      <span className="sidebar-nav__label">{label}</span>
    </NavLink>
  );
}
