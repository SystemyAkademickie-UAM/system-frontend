import { Outlet } from 'react-router-dom';
import './LoginShell.css';

export default function LoginShell() {
  return (
    <div className="login-shell">
      <a className="login-shell__skip" href="#login-main-content">
        Przejdź do treści
      </a>

      <header className="login-shell__header">
        <span className="login-shell__brand">MyAcademyQuest</span>
      </header>

      <main id="login-main-content" className="login-shell__main" tabIndex={-1}>
        <div className="login-shell__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
