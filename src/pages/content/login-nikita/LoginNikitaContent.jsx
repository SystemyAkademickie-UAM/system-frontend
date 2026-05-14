import { Link } from 'react-router-dom';
import { loginPath } from '../../../routes/pathRegistry.js';
import './LoginNikitaContent.css';

export default function LoginNikitaContent() {
  return (
    <section className="login-nikita" aria-labelledby="login-nikita-title">
      <h1 id="login-nikita-title" className="login-nikita__title">
        Logowanie — Nikita
      </h1>
      <p className="login-nikita__hint">Podstrona pod integrację logowania (Nikita).</p>
      <p className="login-nikita__back">
        <Link className="login-nikita__link" to={loginPath()}>
          Wróć do hubu logowania
        </Link>
      </p>
    </section>
  );
}
