import NavGlyph from '../NavGlyph.jsx';

/**
 * @param {{ enabled: boolean, onLogoutClick: () => void, onNavigate?: () => void }} props
 */
export default function SidebarLogoutButton({ enabled, onLogoutClick, onNavigate }) {
  if (!enabled) {
    return null;
  }

  return (
    <li>
      <button
        type="button"
        className="sidebar__link sidebar__link--button"
        onClick={() => {
          onLogoutClick();
          onNavigate?.();
        }}
      >
        <NavGlyph id="nav/logout" />
        <span>Wyloguj</span>
      </button>
    </li>
  );
}
