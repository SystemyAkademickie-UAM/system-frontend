import AppLogo from '../../../components/ui/AppLogo/AppLogo.jsx';
import '../navigation-shell.css';

/** Logo + nazwa aplikacji (lewy górny róg sidebara). */
export default function SidebarBrand() {
  return (
    <div className="sidebar-brand">
      <span className="sidebar-brand__logo-wrap">
        <AppLogo className="sidebar-brand__logo" width={46} height={46} alt="" />
      </span>
      <span className="sidebar-brand__title">MyAcademyQuest</span>
    </div>
  );
}
