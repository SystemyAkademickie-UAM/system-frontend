import { Link } from 'react-router-dom';
import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import { appHelpPath } from '../../../routes/pathRegistry.js';
import './SettingsContent.css';

export default function SettingsContent() {
  return (
    <PageUnavailable
      className="settings-content"
      title="Ustawienia"
      description="Zarządzaj preferencjami konta, językiem interfejsu i powiadomieniami."
    >
      <p className="settings-content__help">
        <Link className="settings-content__help-link" to={appHelpPath()}>
          Centrum pomocy
        </Link>
        {' — '}
        informacje, dokumentacja i wsparcie.
      </p>
    </PageUnavailable>
  );
}
