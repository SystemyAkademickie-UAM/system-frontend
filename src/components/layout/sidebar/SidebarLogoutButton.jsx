/**
 * @file SidebarLogoutButton.jsx
 * @description Komponent przycisku SidebarLogoutButton z obsługą wariantów wizualnych i interakcji.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import NavGlyph from '../NavGlyph.jsx';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * @param {{ enabled: boolean, onLogoutClick: () => void, onNavigate?: () => void }} props
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function SidebarLogoutButton({ enabled, onLogoutClick, onNavigate }) {

if (!enabled) {
    return null;
  }

// === RENDEROWANIE WIDOKU ===
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
