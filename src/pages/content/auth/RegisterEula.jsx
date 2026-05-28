import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthCard.css';
import './RegisterEula.css';

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

export default function RegisterEula({ onAccept, onBack, errorMessage = null, isSubmitting = false }) {
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
        aria-label="Wróć"
        disabled={isSubmitting}
      >
        <BackIcon className="auth-card__back-icon" />
      </button>

      <p className="auth-card__subtitle register-eula__subtitle">
        Tworząc nowe konto zgadzasz się z poniższą polityką MyAcademyQuest
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
          <span className="register-eula__checkbox-label">Warunki użytkowania</span>
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
          <span className="register-eula__checkbox-label">Polityka prywatności</span>
        </label>
      </div>

      <button
        type="button"
        className="auth-card__primary-btn register-eula__submit"
        onClick={handleAccept}
        disabled={!isValid}
      >
        {isSubmitting ? 'Tworzenie konta...' : 'Utwórz nowe konto'}
      </button>
    </div>
  );
}
