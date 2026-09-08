import { useState, useCallback, useEffect } from 'react';
import { getCachedAvatarList, loadAvatarList } from '../../../services/avatarListCache.js';
import AvatarPicker from '../../../components/ui/AvatarPicker/AvatarPicker.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './RegisterAvatar.css';

const BACK_ARIALABEL__TEXTLABEL = {
  polish: 'Wróć',
  english: 'Back'
};

const PAGE_TITLE__TEXTLABEL = {
  polish: 'Awatar',
  english: 'Avatar'
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

export default function RegisterAvatar({
  onContinue,
  onBack,
  initialAvatarId = 1,
  errorMessage = null,
  isBootstrapping = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [avatars, setAvatars] = useState(() => getCachedAvatarList() ?? []);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(() => getCachedAvatarList() === null);

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
    }
  }, [onBack]);

  const handleContinue = useCallback(() => {
    if (onContinue && selectedAvatarId) {
      onContinue({ avatarId: selectedAvatarId });
    }
  }, [onContinue, selectedAvatarId]);

  const isAvatarSectionLoading = isBootstrapping || isLoadingAvatars;
  const isValid = selectedAvatarId !== null && avatars.length > 0 && !isAvatarSectionLoading;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned register-avatar">
      <div className="auth-card__header">
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
      </div>

      {errorMessage ? (
        <p className="login-institution__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="register-avatar__picker-section">
        <AvatarPicker
          variant="compact"
          avatars={avatars}
          value={selectedAvatarId}
          onChange={setSelectedAvatarId}
          isLoading={isAvatarSectionLoading}
          className="register-avatar__picker"
          LANGUAGE={LANGUAGE}
        />
      </div>

      <button
        type="button"
        className="auth-card__primary-btn register-avatar__submit"
        onClick={handleContinue}
        disabled={!isValid}
      >
        {CONTINUE_BUTTON__TEXTLABEL[LANGUAGE]}
      </button>
    </div>
  );
}
