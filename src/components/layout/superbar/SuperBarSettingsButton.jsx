import { Link } from 'react-router-dom';
import { appSettingsPath } from '../../../routes/pathRegistry.js';
import { IconSettings } from './ShellIcons.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './SuperBar.css';

import { useState } from 'react';

const SETTINGS__TEXTLABEL = {
  polish: 'Ustawienia',
  english: 'Settings',
};

export default function SuperBarSettingsButton({ onNavigate }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  return (
    <Link
      to={appSettingsPath()}
      className="super-bar-settings"
      aria-label={SETTINGS__TEXTLABEL[LANGUAGE]}
      onClick={onNavigate}
    >
      <IconSettings className="super-bar-settings__icon" />
    </Link>
  );
}
