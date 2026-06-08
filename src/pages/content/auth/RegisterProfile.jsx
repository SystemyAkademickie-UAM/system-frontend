import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPath } from '../../../routes/pathRegistry.js';
import { fetchAvatars } from '../../../services/profile.api.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import './AuthCard.css';
import './RegisterProfile.css';

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AvatarPlaceholder({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="8" fill="#0D0D18"/>
      <path d="M60 40C55.0294 40 51 44.0294 51 49C51 53.9706 55.0294 58 60 58C64.9706 58 69 53.9706 69 49C69 44.0294 64.9706 40 60 40Z" stroke="#BDCABE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M45 80C45 71.7157 51.7157 65 60 65C68.2843 65 75 71.7157 75 80" stroke="#BDCABE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="43" y="33" width="34" height="54" rx="2" stroke="#BDCABE" strokeWidth="2"/>
    </svg>
  );
}

export default function RegisterProfile({
  onContinue,
  onBack,
  initialNickname = '',
  initialAvatarId = 1,
}) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);

  // Awatary pobieramy z backendu (`GET /profile/avatars`) — w bazie jest tylko
  // 6 zaseedowanych, więc trzymanie `AVATAR_COUNT = 8` po stronie frontu
  // powodowało FK violation przy zapisie profilu.
  useEffect(() => {
    let cancelled = false;
    setIsLoadingAvatars(true);
    fetchAvatars()
      .then((list) => {
        if (cancelled) return;
        setAvatars(list);
        if (list.length === 0) return;
        const initialIndex = list.findIndex((a) => a.id === initialAvatarId);
        setSelectedAvatarIndex(initialIndex >= 0 ? initialIndex : 0);
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

  const handlePrevAvatar = useCallback(() => {
    setSelectedAvatarIndex((prev) => {
      if (avatars.length === 0) return prev;
      return prev <= 0 ? avatars.length - 1 : prev - 1;
    });
  }, [avatars.length]);

  const handleNextAvatar = useCallback(() => {
    setSelectedAvatarIndex((prev) => {
      if (avatars.length === 0) return prev;
      return prev >= avatars.length - 1 ? 0 : prev + 1;
    });
  }, [avatars.length]);

  const handleContinue = useCallback(() => {
    if (nickname.trim().length === 0) {
      return;
    }
    if (onContinue) {
      const selectedAvatar = avatars[selectedAvatarIndex];
      const avatarIdToSubmit = selectedAvatar?.id ?? initialAvatarId;
      onContinue({ nickname: nickname.trim(), avatarId: avatarIdToSubmit });
    }
  }, [nickname, avatars, selectedAvatarIndex, initialAvatarId, onContinue]);

  const selectedAvatar = avatars[selectedAvatarIndex] ?? null;
  const displayedAvatarLabel = selectedAvatar
    ? selectedAvatar.id
    : isLoadingAvatars
      ? '…'
      : '—';
  const isValid = nickname.trim().length > 0 && avatars.length > 0;

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

      <div className="auth-card__input-wrapper">
        <div className="auth-card__input-container">
          <SearchIcon className="auth-card__input-icon" />
          <input
            type="text"
            className="auth-card__input"
            placeholder="MegaKrolik"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={100}
            autoComplete="nickname"
          />
        </div>
      </div>

      <div className="register-profile__avatar-section">
        <p className="register-profile__avatar-label">Wybierz Avatar</p>
        <div className="register-profile__avatar-selector">
          <button
            type="button"
            className="register-profile__avatar-arrow"
            onClick={handlePrevAvatar}
            aria-label="Poprzedni avatar"
          >
            <ArrowLeftIcon className="register-profile__arrow-icon" />
          </button>
          <div className="register-profile__avatar-preview">
            {selectedAvatar?.imageUrl ? (
              <img
                src={selectedAvatar.imageUrl}
                alt={selectedAvatar.name ?? `Avatar ${selectedAvatar.id}`}
                className={getAvatarImageClassName(selectedAvatar.imageUrl, 'register-profile__avatar-image')}
              />
            ) : (
              <AvatarPlaceholder className="register-profile__avatar-image" />
            )}
            <span className="register-profile__avatar-number">{displayedAvatarLabel}</span>
          </div>
          <button
            type="button"
            className="register-profile__avatar-arrow"
            onClick={handleNextAvatar}
            aria-label="Następny avatar"
          >
            <ArrowRightIcon className="register-profile__arrow-icon" />
          </button>
        </div>
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
