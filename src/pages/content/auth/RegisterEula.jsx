import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AUTH_LEGAL_DOCUMENTS,
  authLegalDocumentUrl,
} from '../../../constants/authLegalDocuments.constants.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './RegisterEula.css';

const BACK_ARIALABEL__TEXTLABEL = {
  polish: 'Wróć',
  english: 'Back'
};

const SUBTITLE__TEXTLABEL = {
  polish: 'Tworząc nowe konto zgadzasz się z poniższą polityką MyAcademyQuest',
  english: 'By creating a new account you agree to the MyAcademyQuest policy below'
};

const TERMS_CHECKBOX__TEXTLABEL = {
  polish: 'Warunki użytkowania',
  english: 'Terms of use'
};

const PRIVACY_CHECKBOX__TEXTLABEL = {
  polish: 'Polityka prywatności',
  english: 'Privacy policy'
};

const SUBMIT_CREATING__TEXTLABEL = {
  polish: 'Tworzenie konta...',
  english: 'Creating account...'
};

const SUBMIT_CREATE__TEXTLABEL = {
  polish: 'Utwórz nowe konto',
  english: 'Create new account'
};

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LegalDownloadLink({ documentKey, LANGUAGE }) {
  const document = AUTH_LEGAL_DOCUMENTS[documentKey];

  const DOWNLOAD_LINK__TEXTLABEL = {
    polish: 'pobierz',
    english: 'download'
  };

  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <a
      href={authLegalDocumentUrl(documentKey)}
      target="_blank"
      rel="noopener noreferrer"

      className="register-eula__download-link"
      onClick={handleClick}
    >
      {DOWNLOAD_LINK__TEXTLABEL[LANGUAGE]}
    </a>
  );
}

export default function RegisterEula({ onAccept, onBack, errorMessage = null, isSubmitting = false }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  }, [onBack, navigate]);

  const handleAccept = useCallback(() => {
    if (termsAccepted && privacyAccepted && onAccept) {
      onAccept();
    }
  }, [termsAccepted, privacyAccepted, onAccept]);

  const isValid = termsAccepted && privacyAccepted && !isSubmitting;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned register-eula">
      <button
        type="button"
        className="auth-card__back-button"
        onClick={handleBack}
        aria-label={BACK_ARIALABEL__TEXTLABEL[LANGUAGE]}
        disabled={isSubmitting}
      >
        <BackIcon className="auth-card__back-icon" />
      </button>

      <p className="auth-card__subtitle register-eula__subtitle">
        {SUBTITLE__TEXTLABEL[LANGUAGE]}
      </p>

      {errorMessage && (
        <p className="register-eula__error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="register-eula__checkboxes">
        <label className="register-eula__checkbox-item">
          <span className="register-eula__checkbox-wrapper">
            <input
              type="checkbox"
              className="register-eula__checkbox-input"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className="register-eula__checkbox-custom">
              {termsAccepted && <CheckIcon className="register-eula__check-icon" />}
            </span>
          </span>
          <span className="register-eula__checkbox-label">
            {TERMS_CHECKBOX__TEXTLABEL[LANGUAGE]}
            {' '}
            <LegalDownloadLink documentKey="termsOfUse" LANGUAGE={LANGUAGE} />
          </span>
        </label>

        <label className="register-eula__checkbox-item">
          <span className="register-eula__checkbox-wrapper">
            <input
              type="checkbox"
              className="register-eula__checkbox-input"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
            />
            <span className="register-eula__checkbox-custom">
              {privacyAccepted && <CheckIcon className="register-eula__check-icon" />}
            </span>
          </span>
          <span className="register-eula__checkbox-label">
            {PRIVACY_CHECKBOX__TEXTLABEL[LANGUAGE]}
            {' '}
            <LegalDownloadLink documentKey="privacyPolicy" LANGUAGE={LANGUAGE} />
          </span>
        </label>
      </div>

      <button
        type="button"
        className="auth-card__primary-btn register-eula__submit"
        onClick={handleAccept}
        disabled={!isValid}
      >
        {isSubmitting ? SUBMIT_CREATING__TEXTLABEL[LANGUAGE] : SUBMIT_CREATE__TEXTLABEL[LANGUAGE]}
      </button>
    </div>
  );
}
