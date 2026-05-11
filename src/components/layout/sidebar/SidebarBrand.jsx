import { publicAssetPath } from '../../../utils/publicAssetUrl.js';

export default function SidebarBrand({ userDisplayName, userRoleLabel }) {
  const logoSrc = publicAssetPath('assets/logomyacademyquest.png');

  return (
    <div className="sidebar__brand">
      <img className="sidebar__logo" src={logoSrc} alt="MyAcademyQuest" width={48} height={48} decoding="async" />
      <div className="sidebar__identity">
        <p className="sidebar__name">{userDisplayName}</p>
        <p className="sidebar__role">{userRoleLabel}</p>
      </div>
    </div>
  );
}
