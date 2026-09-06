import { useState } from 'react';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './LoginPionierId.css';

const PIONIER_BUTTON__TEXTLABEL = {
  polish: 'Zaloguj się przez PIONIER.ID',
  english: 'Log in via PIONIER.ID'
};

const EMAIL_LINK__TEXTLABEL = {
  polish: 'Zaloguj się przez e-mail',
  english: 'Log in via email'
};

export default function LoginPionierId({ onContinue, onEmailLogin }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <div className="auth-card auth-card--wizard-panel login-pionierid">
      <div className="login-pionierid__body">
        <img
          src="/images/pionierid-logo.png"
          alt="PIONIER.id"
          className="login-pionierid__logo auth-logo--pionier"
        />

        <div className="login-pionierid__actions">
          <button
            type="button"
            className="auth-card__primary-btn login-pionierid__btn"
            onClick={onContinue}
          >
            {PIONIER_BUTTON__TEXTLABEL[LANGUAGE]}
          </button>

          <button
            type="button"
            className="auth-card__secondary-link login-pionierid__email-link"
            onClick={() => onEmailLogin?.()}
          >
            {EMAIL_LINK__TEXTLABEL[LANGUAGE]}
          </button>
        </div>
      </div>
    </div>
  );
}
