import { useOptionalGroupId } from '../../hooks/useOptionalGroupId.js';
import { resolveShellView } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import SidebarBrand from './sidebar/SidebarBrand.jsx';
import SidebarGroupsCtaButton from './sidebar/SidebarGroupsCtaButton.jsx';
import SidebarNavLinkButton from './sidebar/SidebarNavLinkButton.jsx';
import SidebarNavRail from './sidebar/SidebarNavRail.jsx';
import './navigation-shell.css';

export default function Sidebar({ onNavigate }) {
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const shell = resolveShellView(role, { groupId });

  const handleNav = () => {
    onNavigate?.();
  };

  return (
    <aside className="sidebar" aria-label="Nawigacja aplikacji">
      <SidebarBrand />

      <div className="sidebar__cta-group">
        {shell.ctaItems.map((item) => (
          <SidebarGroupsCtaButton key={item.id} to={item.to} enabled={item.enabled} onNavigate={handleNav}>
            {item.label}
          </SidebarGroupsCtaButton>
        ))}
      </div>

      <SidebarNavRail aria-label="Główne sekcje">
        {shell.primaryNavItems.map((item) => (
          <SidebarNavLinkButton
            key={item.id}
            to={item.to}
            label={item.label}
            iconId={item.iconId}
            enabled={item.enabled}
            matchEnd={item.matchEnd}
            onNavigate={handleNav}
          />
        ))}
      </SidebarNavRail>
    </aside>
  );
}
