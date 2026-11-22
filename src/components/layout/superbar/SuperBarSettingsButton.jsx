/**
 * @file SuperBarSettingsButton.jsx
 * @description Komponent przycisku SuperBarSettingsButton z obsługą wariantów wizualnych i interakcji.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { Link } from 'react-router-dom';
import { appSettingsPath } from '../../../routes/pathRegistry.js';
import { IconSettings } from './ShellIcons.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './SuperBar.css';

import { useState } from 'react';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const SETTINGS__TEXTLABEL = {

polish: 'Ustawienia',
  english: 'Settings',
};

// === GŁÓWNY KOMPONENT WIDOKU ===
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
