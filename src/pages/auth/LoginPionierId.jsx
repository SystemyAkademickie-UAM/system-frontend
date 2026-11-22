/**
 * @file LoginPionierId.jsx
 * @description Główny komponent widoku strony dla obszaru LoginPionierId.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import { Button } from '../../components/ui/index.js';
import { welcomePath } from '../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './LoginPionierId.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const BACK_BUTTON__TEXTLABEL = {
  polish: '<- wróć',
  english: '<- back',
};

const ORGANIZATION_BUTTON__TEXTLABEL = {
  polish: 'Zaloguj przez organizację',
  english: 'Sign in with organization'
};

const EMAIL_BUTTON__TEXTLABEL = {
  polish: 'Zaloguj przez e-mail',
  english: 'Sign in with email'
};

const SUBTITLE__TEXTLABEL = {
  polish: 'MyAcademyQuest - system do grywalizacji',
  english: 'MyAcademyQuest - gamification system'
};

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function LoginPionierId({ onContinue, onEmailLogin, onBack }) {

const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <div className="auth-card auth-card--wizard-panel login-pionierid">
      <div className="login-pionierid__header">
        <Button
          to={welcomePath()}
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="login-pionierid__back-btn"
          aria-label={BACK_BUTTON__TEXTLABEL[LANGUAGE]}
        >
          {BACK_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
      </div>

      <div className="login-pionierid__body">
        <div className="login-pionierid__brand" aria-label="MyAcademyQuest">
          <div className="login-pionierid__brand-row">
            <img
              src="/images/maq-logo.png"
              alt="MyAcademyQuest"
              className="login-pionierid__brand-pad"
            />
            <span className="login-pionierid__brand-a" aria-hidden="true">A</span>
            <span className="login-pionierid__brand-q" aria-hidden="true">Q</span>
          </div>
          <p className="login-pionierid__brand-subtitle">
            {SUBTITLE__TEXTLABEL[LANGUAGE]}
          </p>
        </div>

        <div className="login-pionierid__actions">
          <button
            type="button"
            className="auth-card__primary-btn login-pionierid__btn"
            onClick={onContinue}
          >
            {ORGANIZATION_BUTTON__TEXTLABEL[LANGUAGE]}
          </button>

          <button
            type="button"
            className="login-pionierid__email-btn"
            onClick={() => onEmailLogin?.()}
          >
            {EMAIL_BUTTON__TEXTLABEL[LANGUAGE]}
          </button>
        </div>
      </div>
    </div>
  );
}
