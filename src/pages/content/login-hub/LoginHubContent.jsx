import {
  devApiTestPath,
  groupsListPath,
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
          <Button to={devApiTestPath()} variant="secondary">
            Dev API Test
          </Button>
        </li>
      </ul>
    </section>
  );
}
