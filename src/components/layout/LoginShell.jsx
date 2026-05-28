import { Outlet } from 'react-router-dom';
import AppLogo from '../ui/AppLogo/AppLogo.jsx';
import './LoginShell.css';

export default function LoginShell() {
  return (
    <div className="login-shell">
      <a className="login-shell__skip" href="#login-main-content">
        Przejdź do treści
      </a>

      <header className="login-shell__header">
        <div className="login-shell__brand">
          <AppLogo className="login-shell__brand-logo" width={40} height={40} alt="" />
          <span className="login-shell__brand-title">MyAcademyQuest</span>
        </div>
      </header>

      <main id="login-main-content" className="login-shell__main" tabIndex={-1}>
        <div className="login-shell__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
