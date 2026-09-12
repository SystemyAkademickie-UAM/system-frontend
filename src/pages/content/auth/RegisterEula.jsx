import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  authLegalDocumentUrl,
} from '../../../constants/authLegalDocuments.constants.js';
import {
  THEME_MODE,
  THEME_OPTIONS,
  applyTheme,
  getSavedTheme,
} from '../../../services/themeService.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './RegisterEula.css';

const BACK_ARIALABEL__TEXTLABEL = {
  polish: 'Wróć',
  english: 'Back'
};

const PAGE_TITLE__TEXTLABEL = {
  polish: 'Ustawienia konta',
  english: 'Account settings'
};

const THEME_SECTION__TEXTLABEL = {
  polish: 'Wybór motywu',
  english: 'Theme selection'
};

const PRIVACY_CHECKBOX__TEXTLABEL = {
  polish: 'Polityka prywatności',
  english: 'Privacy policy'
};

const DOCUMENTATION_CHECKBOX__TEXTLABEL = {
  polish: 'Dokumentacja',
  english: 'Documentation'
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

export default function RegisterEula({
  onAccept,
  onBack,
  errorMessage = null,
  isSubmitting = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(() => getSavedTheme());
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [documentationAccepted, setDocumentationAccepted] = useState(false);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  }, [onBack, navigate]);

  const handleAccept = useCallback(() => {
    if (privacyAccepted && documentationAccepted && onAccept) {
      onAccept({ theme: selectedTheme });
    }
  }, [privacyAccepted, documentationAccepted, onAccept, selectedTheme]);

  const isValid = privacyAccepted && documentationAccepted && !isSubmitting;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned register-eula">
      <div className="auth-card__header">
        <button
          type="button"
          className="auth-card__back-button"
          onClick={handleBack}
          aria-label={BACK_ARIALABEL__TEXTLABEL[LANGUAGE]}
          disabled={isSubmitting}
        >
          <BackIcon className="auth-card__back-icon" />
        </button>

        <h1 className="auth-card__title register-eula__title">
          {PAGE_TITLE__TEXTLABEL[LANGUAGE]}
        </h1>
      </div>

      {errorMessage && (
        <p className="register-eula__error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="register-eula__theme-section">
        <p className="register-eula__section-label">
          {THEME_SECTION__TEXTLABEL[LANGUAGE]}
        </p>
        <div className="register-eula__theme-options" role="radiogroup" aria-label={THEME_SECTION__TEXTLABEL[LANGUAGE]}>
          {THEME_OPTIONS.map((option) => {
            const isSelected = selectedTheme === option.id;
            return (
              <label
                key={option.id}
                className={[
                  'register-eula__theme-card',
                  isSelected ? 'register-eula__theme-card--selected' : '',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="app-theme-selection"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleThemeChange(option.id)}
                  className="register-eula__theme-radio"
                  disabled={isSubmitting}
                />
                <span className="register-eula__theme-radio-circle">
                  {isSelected && <span className="register-eula__theme-radio-dot" />}
                </span>
                <span className="register-eula__theme-info">
                  <span className="register-eula__theme-name">{option.label}</span>
                  <span className="register-eula__theme-desc">{option.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="register-eula__checkboxes">
        <label className="register-eula__checkbox-item">
          <span className="register-eula__checkbox-wrapper">
            <input
              type="checkbox"
              className="register-eula__checkbox-input"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              disabled={isSubmitting}
            />
            <span className="register-eula__checkbox-custom">
              {privacyAccepted && <CheckIcon className="register-eula__check-icon" />}
            </span>
          </span>
          <span className="register-eula__checkbox-label">
            <a
              href={authLegalDocumentUrl('privacyPolicy')}
              target="_blank"
              rel="noopener noreferrer"
              className="register-eula__document-link"
              onClick={(e) => e.stopPropagation()}
            >
              {PRIVACY_CHECKBOX__TEXTLABEL[LANGUAGE]}
            </a>
          </span>
        </label>

        <label className="register-eula__checkbox-item">
          <span className="register-eula__checkbox-wrapper">
            <input
              type="checkbox"
              className="register-eula__checkbox-input"
              checked={documentationAccepted}
              onChange={(e) => setDocumentationAccepted(e.target.checked)}
              disabled={isSubmitting}
            />
            <span className="register-eula__checkbox-custom">
              {documentationAccepted && <CheckIcon className="register-eula__check-icon" />}
            </span>
          </span>
          <span className="register-eula__checkbox-label">
            <a
              href={authLegalDocumentUrl('documentation')}
              target="_blank"
              rel="noopener noreferrer"
              className="register-eula__document-link"
              onClick={(e) => e.stopPropagation()}
            >
              {DOCUMENTATION_CHECKBOX__TEXTLABEL[LANGUAGE]}
            </a>
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
