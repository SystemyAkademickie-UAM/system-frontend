import { useOptionalGroupId } from '../../hooks/useOptionalGroupId.js';
import { APP_ROLE, ROLE_UI_LABEL, resolveShellView } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import SidebarBrand from './sidebar/SidebarBrand.jsx';
import SidebarCoursesCtaButton from './sidebar/SidebarCoursesCtaButton.jsx';
import SidebarLogoutButton from './sidebar/SidebarLogoutButton.jsx';
import SidebarNavLinkButton from './sidebar/SidebarNavLinkButton.jsx';
import SidebarNavRail from './sidebar/SidebarNavRail.jsx';

/** Placeholder — docelowo nick studenta z API (sesja / profil). */
const PLACEHOLDER_STUDENT_NICKNAME = 'NAZWA_GLOBALNA';

export default function Sidebar({ onNavigate, onLogoutClick }) {
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const shell = resolveShellView(role, { groupId });
  const userRoleLabel = ROLE_UI_LABEL[role] ?? ROLE_UI_LABEL[APP_ROLE.STUDENT];

  const handleNav = () => {
    onNavigate?.();
  };

  return (
    <aside className="sidebar" aria-label="Nawigacja aplikacji">
      <SidebarBrand userDisplayName={PLACEHOLDER_STUDENT_NICKNAME} userRoleLabel={userRoleLabel} />

      <div className="sidebar__cta">
        {shell.ctaItems.map((item) => (
          <SidebarCoursesCtaButton key={item.id} to={item.to} enabled={item.enabled} onNavigate={handleNav}>
            {item.label}
          </SidebarCoursesCtaButton>
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

      <div className="sidebar__footer">
        <SidebarNavRail variant="footer" aria-label="Ustawienia i wylogowanie">
          {shell.footerItems.map((item) =>
            item.kind === 'logout' ? (
              <SidebarLogoutButton key={item.id} enabled={item.enabled} onLogoutClick={onLogoutClick} onNavigate={handleNav} />
            ) : (
              <SidebarNavLinkButton
                key={item.id}
                to={item.to}
                label={item.label}
                iconId={item.iconId}
                enabled={item.enabled}
                matchEnd={item.matchEnd}
                onNavigate={handleNav}
              />
            ),
          )}
        </SidebarNavRail>
      </div>
    </aside>
  );
}
