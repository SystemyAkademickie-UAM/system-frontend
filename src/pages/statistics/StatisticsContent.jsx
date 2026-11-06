/**
 * @file StatisticsContent.jsx
 * @description Główny komponent widoku strony dla obszaru StatisticsContent.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const TITLE__TEXTLABEL = {
  polish: 'Statystyki',

english: 'Statistics'
};

const DESCRIPTION__TEXTLABEL = {
  polish: 'Podgląd wskaźników aktywności, logowań i wykorzystania platformy w organizacji.',
  english: 'Overview of activity, login, and platform usage metrics in the organization.'
};

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function StatisticsContent() {

const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <AppSectionPage
      title={TITLE__TEXTLABEL[LANGUAGE]}
      description={DESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}
