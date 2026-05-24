import AuthAnimatedOutlet from './AuthAnimatedOutlet.jsx';
import './AuthShell.css';
import './authLogos.css';
import './authTransition.css';

export default function AuthShell() {
  return (
    <div className="auth-shell">
      <div className="auth-shell__bg-texture" aria-hidden="true" />
      <div className="auth-shell__bg-gradient" aria-hidden="true" />

      <a className="auth-shell__skip" href="#auth-main-content">
        Przejdź do treści
      </a>

      <main id="auth-main-content" className="auth-shell__main" tabIndex={-1}>
        <section className="auth-shell__panel" aria-label="Logowanie">
          <div className="auth-shell__panel-inner">
            <div className="auth-shell__content">
              <AuthAnimatedOutlet />
            </div>

            <footer className="auth-shell__footer">
              <img
                src="/images/maq-logo.png"
                alt=""
                className="auth-shell__footer-logo auth-logo--maq-muted"
                aria-hidden="true"
              />
              <span className="auth-shell__footer-text">MyAcademyQuest 2026 ©</span>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
