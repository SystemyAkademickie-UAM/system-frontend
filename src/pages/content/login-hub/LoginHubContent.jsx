import { Link } from 'react-router-dom';
import {
  groupsListPath,
  loginNikitaPath,
  loginTempPath,
} from '../../../routes/pathRegistry.js';
import './LoginHubContent.css';

export default function LoginHubContent() {
  return (
    <section className="login-hub" aria-labelledby="login-hub-title">
      <h1 id="login-hub-title" className="login-hub__title">
        Logowanie
      </h1>
      <p className="login-hub__hint">Wybierz kolejny krok:</p>
      <ul className="login-hub__list">
        <li>
          <Link className="login-hub__link" to={groupsListPath()}>
            Lista grup
          </Link>
        </li>
        <li>
          <Link className="login-hub__link" to={loginTempPath()}>
            Logowanie — tymczasowe (dev)
          </Link>
        </li>
        <li>
          <Link className="login-hub__link" to={loginNikitaPath()}>
            Logowanie — Nikita
          </Link>
        </li>
      </ul>
    </section>
  );
}
