import { NavLink } from 'react-router-dom';
import AppLogo from '../../../components/ui/AppLogo/AppLogo.jsx';
import '../navigation-shell.css';

/**
 * Logo + nazwa aplikacji (lewy górny róg sidebara).
 * Kliknięcie prowadzi do listy grup — jak przycisk „Twoje grupy”.
 *
 * @param {Object} props
 * @param {string | null | undefined} props.to
 * @param {() => void} [props.onNavigate]
 */
export default function SidebarBrand({ to, onNavigate }) {
  const content = (
    <>
      <span className="sidebar-brand__logo-wrap">
        <AppLogo className="sidebar-brand__logo" width={46} height={46} alt="" />
      </span>
      <span className="sidebar-brand__title">MyAcademyQuest</span>
    </>
  );

  if (!to) {
    return <div className="sidebar-brand">{content}</div>;
  }

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => [
        'sidebar-brand',
        'sidebar-brand--link',
        isActive ? 'sidebar-brand--active' : '',
      ].filter(Boolean).join(' ')}
      onClick={onNavigate}
      aria-label="MyAcademyQuest — przejdź do listy grup"
    >
      {content}
    </NavLink>
  );
}
