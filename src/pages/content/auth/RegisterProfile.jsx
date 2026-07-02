import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPath } from '../../../routes/pathRegistry.js';
import { fetchAvatars } from '../../../services/profile.api.js';
import { PROFILE_NICKNAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { CharacterLimitedField } from '../../../components/ui/index.js';
import AvatarPicker from '../../../components/ui/AvatarPicker/AvatarPicker.jsx';
import './AuthCard.css';
import './RegisterProfile.css';

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
}) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingAvatars(true);
    fetchAvatars()
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

  const isValid = nickname.trim().length > 0 && avatars.length > 0 && !isLoadingAvatars;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned register-profile">
      <button
        type="button"
        className="auth-card__back-button"
        onClick={handleBack}
        aria-label="Wróć"
      >
        <BackIcon className="auth-card__back-icon" />
      </button>

      <h1 className="auth-card__title">Jak Cię nazywać?</h1>

      {errorMessage ? (
        <p className="login-institution__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="auth-card__input-wrapper">
        <CharacterLimitedField value={nickname} maxLength={PROFILE_NICKNAME_MAX_LENGTH}>
          <div className="auth-card__input-container register-profile__input-container">
            <input
              type="text"
              className="auth-card__input"
              placeholder="MegaKrolik"
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
            />
          </div>
        </CharacterLimitedField>
      </div>

      <div className="register-profile__avatar-section">
        {isLoadingAvatars ? (
          <p className="register-profile__avatar-label">Ładowanie awatarów…</p>
        ) : (
          <AvatarPicker
            variant="compact"
            avatars={avatars}
            value={selectedAvatarId}
            onChange={setSelectedAvatarId}
            className="register-profile__avatar-picker"
          />
        )}
      </div>

      <button
        type="button"
        className="auth-card__primary-btn"
        onClick={handleContinue}
        disabled={!isValid}
      >
        Kontynuuj
      </button>
    </div>
  );
}
