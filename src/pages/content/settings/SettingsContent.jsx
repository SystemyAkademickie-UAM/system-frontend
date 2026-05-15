import { Link } from 'react-router-dom';
import { appHelpPath } from '../../../routes/pathRegistry.js';
import './SettingsContent.css';

export default function SettingsContent() {
  return (
    <section className="route-content settings-content" aria-labelledby="settings-content-title">
      <h1 id="settings-content-title" className="route-content__title">
        Ustawienia
      </h1>
      <p className="settings-content__help">
        <Link className="settings-content__help-link" to={appHelpPath()}>
          Centrum pomocy
        </Link>
        {' — '}
        informacje, dokumentacja i wsparcie.
      </p>
    </section>
  );
}
