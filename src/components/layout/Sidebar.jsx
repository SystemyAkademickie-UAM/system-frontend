/**
 * @file Sidebar.jsx
 * @description Komponent interfejsu użytkownika Sidebar.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useOptionalGroupId } from '../../hooks/useOptionalGroupId.js';
import { useGroupPreview } from '../../hooks/groups/useGroupPreview.js';
import { APP_ROLE, resolveShellView } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { adminHomePath, groupsListPath, organizationsPath } from '../../routes/pathRegistry.js';
import SidebarBrand from './sidebar/SidebarBrand.jsx';
import SidebarGroupsCtaButton from './sidebar/SidebarGroupsCtaButton.jsx';
import SidebarNavItem from './sidebar/SidebarNavItem.jsx';
import SidebarNavRail from './sidebar/SidebarNavRail.jsx';
import './navigation-shell.css';

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function Sidebar({ onNavigate }) {
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const { isOwner } = useGroupPreview(groupId);

const shell = resolveShellView(role, { groupId, isGroupOwner: isOwner });

  const handleNav = () => {
    onNavigate?.();
  };

  const defaultRoute =
    role === APP_ROLE.SUPERADMIN
      ? organizationsPath()
      : role === APP_ROLE.ADMIN
        ? adminHomePath()
        : (shell.ctaItems.find((item) => item.id === 'twoje-kursy')?.to ?? groupsListPath());

  // === RENDEROWANIE WIDOKU ===
  return (
    <aside className="sidebar" aria-label="Nawigacja aplikacji">
      <SidebarBrand to={defaultRoute} onNavigate={handleNav} />

      <div className="sidebar__cta-group">
        {shell.ctaItems.map((item) => (
          <SidebarGroupsCtaButton key={item.id} to={item.to} enabled={item.enabled} onNavigate={handleNav}>
            {item.label}
          </SidebarGroupsCtaButton>
        ))}
      </div>

      <div className="sidebar__nav-scroll">
        <SidebarNavRail aria-label="Główne sekcje">
          {shell.primaryNavItems.map((item) => (
            <SidebarNavItem key={item.id} item={item} onNavigate={handleNav} />
          ))}
        </SidebarNavRail>
      </div>
    </aside>
  );
}
