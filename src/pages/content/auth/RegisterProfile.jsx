import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPath } from '../../../routes/pathRegistry.js';
import { getCachedAvatarList, loadAvatarList } from '../../../services/avatarListCache.js';
import { PROFILE_NICKNAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { CharacterLimitedField } from '../../../components/ui/index.js';
import AvatarPicker from '../../../components/ui/AvatarPicker/AvatarPicker.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './RegisterProfile.css';

const BACK_ARIALABEL__TEXTLABEL = {
  polish: 'Wróć',
  english: 'Back'
};

const PAGE_TITLE__TEXTLABEL = {
  polish: 'Jak Cię nazywać?',
  english: 'What should we call you?'
};

const NICKNAME_PLACEHOLDER__TEXTLABEL = {
  polish: 'MegaKrolik',
  english: 'MegaRabbit'
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

export default function RegisterProfile({
  onContinue,
  onBack,
  initialNickname = '',
  initialAvatarId = 1,
  errorMessage = null,
  isBootstrapping = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const [avatars, setAvatars] = useState(() => getCachedAvatarList() ?? []);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(() => getCachedAvatarList() === null);

  useEffect(() => {
    setNickname(initialNickname);
  }, [initialNickname]);

  useEffect(() => {
    let cancelled = false;

    loadAvatarList()
      .then((list) => {
        if (cancelled) return;
        setAvatars(list);
        if (list.length === 0) return;
        const hasInitial = list.some((avatar) => avatar.id === initialAvatarId);
        setSelectedAvatarId(hasInitial ? initialAvatarId : list[0].id);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingAvatars(false);
      });

    return () => { cancelled = true; };
  }, [initialAvatarId]);

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
      onContinue({ nickname: nickname.trim(), avatarId: selectedAvatarId });
    }
  }, [nickname, onContinue, selectedAvatarId]);

  const isAvatarSectionLoading = isBootstrapping || isLoadingAvatars;
  const isValid = nickname.trim().length > 0 && avatars.length > 0 && !isAvatarSectionLoading;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned register-profile">
      <button
        type="button"
        className="auth-card__back-button"
        onClick={handleBack}
        aria-label={BACK_ARIALABEL__TEXTLABEL[LANGUAGE]}
        disabled={isBootstrapping}
      >
        <BackIcon className="auth-card__back-icon" />
      </button>

      <h1 className="auth-card__title">{PAGE_TITLE__TEXTLABEL[LANGUAGE]}</h1>

      {errorMessage ? (
        <p className="login-institution__error" role="alert">{errorMessage}</p>
      ) : null}

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

      <div className="register-profile__avatar-section">
        <AvatarPicker
          variant="compact"
          avatars={avatars}
          value={selectedAvatarId}
          onChange={setSelectedAvatarId}
          isLoading={isAvatarSectionLoading}
          className="register-profile__avatar-picker"
        />
      </div>

      <button
        type="button"
        className="auth-card__primary-btn"
        onClick={handleContinue}
        disabled={!isValid}
      >
        {CONTINUE_BUTTON__TEXTLABEL[LANGUAGE]}
      </button>
    </div>
  );
}
