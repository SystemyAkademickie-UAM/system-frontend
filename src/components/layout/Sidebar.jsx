import { useOptionalGroupId } from '../../hooks/useOptionalGroupId.js';
import { useGroupPreview } from '../../hooks/groups/useGroupPreview.js';
import { resolveShellView } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { groupsListPath } from '../../routes/pathRegistry.js';
import SidebarBrand from './sidebar/SidebarBrand.jsx';
import SidebarGroupsCtaButton from './sidebar/SidebarGroupsCtaButton.jsx';
import SidebarNavItem from './sidebar/SidebarNavItem.jsx';
import SidebarNavRail from './sidebar/SidebarNavRail.jsx';
import './navigation-shell.css';

export default function Sidebar({ onNavigate }) {
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const { isOwner } = useGroupPreview(groupId);
  const shell = resolveShellView(role, { groupId, isGroupOwner: isOwner });

  const handleNav = () => {
    onNavigate?.();
  };

  const groupsListRoute = shell.ctaItems.find((item) => item.id === 'twoje-kursy')?.to ?? groupsListPath();

  return (
    <aside className="sidebar" aria-label="Nawigacja aplikacji">
      <SidebarBrand to={groupsListRoute} onNavigate={handleNav} />

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
