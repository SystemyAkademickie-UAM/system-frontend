import { Link } from 'react-router-dom';
import { appSettingsPath } from '../../../routes/pathRegistry.js';
import { IconSettings } from './ShellIcons.jsx';
import './SuperBar.css';

export default function SuperBarSettingsButton({ onNavigate }) {
  return (
    <Link
      to={appSettingsPath()}
      className="super-bar-settings"
      aria-label="Ustawienia"
      onClick={onNavigate}
    >
      <IconSettings className="super-bar-settings__icon" />
    </Link>
  );
}
