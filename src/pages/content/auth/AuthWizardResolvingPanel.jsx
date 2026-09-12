import { useState } from 'react';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './AuthWizardResolvingPanel.css';

const LOADING_ARIALABEL__TEXTLABEL = {
  polish: 'Ładowanie',
  english: 'Loading'
};

/** Krótki placeholder w karcie logowania — unika migania między krokami podczas sprawdzania sesji. */
export default function AuthWizardResolvingPanel() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <div
      className="auth-card auth-card--wizard-panel auth-wizard-resolving"
      aria-busy="true"
      aria-label={LOADING_ARIALABEL__TEXTLABEL[LANGUAGE]}
    >
      <span className="auth-wizard-resolving__spinner" />
    </div>
  );
}
