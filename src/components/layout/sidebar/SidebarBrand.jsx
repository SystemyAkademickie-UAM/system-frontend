import { publicAssetPath } from '../../../utils/publicAssetUrl.js';
import '../navigation-shell.css';

/** Logo + nazwa aplikacji (lewy górny róg sidebara). */
export default function SidebarBrand() {
  const logoSrc = publicAssetPath('assets/logomyacademyquest.png');

  return (
    <div className="sidebar-brand">
      <span className="sidebar-brand__logo-wrap">
        <img className="sidebar-brand__logo" src={logoSrc} alt="" width={46} height={46} decoding="async" />
      </span>
      <span className="sidebar-brand__title">MyAcademyQuest</span>
    </div>
  );
}
