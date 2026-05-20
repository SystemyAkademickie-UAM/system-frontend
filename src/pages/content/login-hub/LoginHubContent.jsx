import {
  groupsListPath,
  loginNikitaPath,
  loginTempPath,
} from '../../../routes/pathRegistry.js';
import { Button, PageHeader } from '../../../components/ui/index.js';
import './LoginHubContent.css';

export default function LoginHubContent() {
  return (
    <section className="login-hub" aria-labelledby="login-hub-title">
      <PageHeader title="Logowanie" description="Wybierz kolejny krok:" />

      <ul className="login-hub__list">
        <li>
          <Button to={groupsListPath()} variant="primary">
            Lista grup
          </Button>
        </li>
        <li>
          <Button to={loginTempPath()} variant="secondary">
            Logowanie — tymczasowe (dev)
          </Button>
        </li>
        <li>
          <Button to={loginNikitaPath()} variant="secondary">
            Logowanie — Nikita
          </Button>
        </li>
      </ul>
    </section>
  );
}
