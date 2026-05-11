import { Link } from 'react-router-dom';
import PagePlaceholder from '../../components/page/PagePlaceholder.jsx';
import { appHelpPath } from '../../routes/pathRegistry.js';

export default function GroupSettingsPage() {
  return (
    <>
      <PagePlaceholder name="USTAWIENIA" />
      <p className="settings-page__help">
        <Link className="settings-page__help-link" to={appHelpPath()}>
          Centrum pomocy
        </Link>
        {' — '}
        informacje, dokumentacja i wsparcie.
      </p>
    </>
  );
}
