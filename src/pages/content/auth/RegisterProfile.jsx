import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPath } from '../../../routes/pathRegistry.js';
import { PROFILE_NICKNAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { CharacterLimitedField } from '../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './RegisterProfile.css';

const BACK_ARIALABEL__TEXTLABEL = {
  polish: 'Wróć',
  english: 'Back'
};

const PAGE_TITLE__TEXTLABEL = {
  polish: 'Pierwsze logowanie',
  english: 'First login'
};

const NICKNAME_SECTION_LABEL = {
  polish: 'Twoja ksywka',
  english: 'Your nickname'
};

const NICKNAME_PLACEHOLDER__TEXTLABEL = {
  polish: 'MegaKrolik',
  english: 'MegaRabbit'
};

const SHOW_NICKNAME_LABEL = {
  polish: 'Widoczność ksywki',
  english: 'Nickname visibility'
};

const SHOW_NICKNAME_DESCRIPTION = {
  polish: 'Ksywka staje się widoczna dla innych użytkowników (wyświetlana jest dodatkowo obok imienia i nazwiska).',
  english: 'Your nickname becomes visible to other users (displayed alongside your full name).'
};

const CONTINUE_BUTTON__TEXTLABEL = {
  polish: 'Kontynuuj',
  english: 'Continue'
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

export default function RegisterProfile({
  onContinue,
  onBack,
  initialNickname = '',
  initialShowNickname = true,
  showNicknameToggle = true,
  errorMessage = null,
  isBootstrapping = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const [showNickname, setShowNickname] = useState(initialShowNickname);

  useEffect(() => {
    setNickname(initialNickname);
  }, [initialNickname]);

  useEffect(() => {
    if (initialShowNickname !== undefined) {
      setShowNickname(initialShowNickname);
    }
  }, [initialShowNickname]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(loginPath());
  }, [navigate, onBack]);

  const handleContinue = useCallback(() => {
    if (nickname.trim().length === 0) {
      return;
    }
    if (onContinue) {
      onContinue({ nickname: nickname.trim(), showNickname });
    }
  }, [nickname, onContinue, showNickname]);

  const isValid = nickname.trim().length > 0 && !isBootstrapping;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned register-profile">
      <button
        type="button"
        className="auth-card__back-link"
        onClick={handleBack}
        aria-label={BACK_ARIALABEL__TEXTLABEL[LANGUAGE]}
        disabled={isBootstrapping}
      >
        <BackIcon className="auth-card__back-icon" />
        <span>{BACK_ARIALABEL__TEXTLABEL[LANGUAGE].toLowerCase()}</span>
      </button>

      <h1 className="auth-card__title">{PAGE_TITLE__TEXTLABEL[LANGUAGE]}</h1>

      {errorMessage ? (
        <p className="login-institution__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="register-profile__body">
        <div className="register-profile__field-group">
          <label className="register-profile__label">
            {NICKNAME_SECTION_LABEL[LANGUAGE]}
          </label>
          <div className="auth-card__input-wrapper">
            <CharacterLimitedField value={nickname} maxLength={PROFILE_NICKNAME_MAX_LENGTH}>
              <div className="auth-card__input-container register-profile__input-container">
                <input
                  type="text"
                  className="auth-card__input"
                  placeholder={NICKNAME_PLACEHOLDER__TEXTLABEL[LANGUAGE]}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && isValid) {
                      event.preventDefault();
                      handleContinue();
                    }
                  }}
                  maxLength={PROFILE_NICKNAME_MAX_LENGTH}
                  autoComplete="nickname"
                  disabled={isBootstrapping}
                />
              </div>
            </CharacterLimitedField>
          </div>
        </div>

        {showNicknameToggle ? (
          <div className="register-profile__checkbox-section">
            <label className="register-profile__checkbox-item">
              <span className="register-profile__checkbox-wrapper">
                <input
                  type="checkbox"
                  className="register-profile__checkbox-input"
                  checked={showNickname}
                  onChange={(e) => setShowNickname(e.target.checked)}
                  disabled={isBootstrapping}
                />
                <span className="register-profile__checkbox-custom">
                  {showNickname && <CheckIcon className="register-profile__check-icon" />}
                </span>
              </span>
              <span className="register-profile__checkbox-text-wrap">
                <span className="register-profile__checkbox-title">
                  {SHOW_NICKNAME_LABEL[LANGUAGE]}
                </span>
                <span className="register-profile__checkbox-hint">
                  {SHOW_NICKNAME_DESCRIPTION[LANGUAGE]}
                </span>
              </span>
            </label>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="auth-card__primary-btn register-profile__submit"
        onClick={handleContinue}
        disabled={!isValid}
      >
        {CONTINUE_BUTTON__TEXTLABEL[LANGUAGE]}
      </button>
    </div>
  );
}
