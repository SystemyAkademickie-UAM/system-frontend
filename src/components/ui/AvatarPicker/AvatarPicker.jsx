import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal } from '../index.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { useResponsivePopularCount } from './useResponsivePopularCount.js';
import './AvatarPicker.css';

const AVATARPICKERLABELTEXT = {
  polish: 'Twój awatar',
  english: 'Your avatar',
};

const POPULARLABELTEXT = {
  polish: 'Ostatnio najczęściej używane',
  english: 'Recently most used',
};

const SHOWALLLABELTEXT = {
  polish: 'Pokaż pozostałe awatary',
  english: 'Show all avatars',
};

const HIDEALLLABELTEXT = {
  polish: 'Ukryj pozostałe awatary',
  english: 'Hide all avatars',
};

const SHOWALLBUTTONLABELTEXT = {
  polish: 'Pokaż wszystkie',
  english: 'Show all',
};

const SELECTAVATARMODALLABELTEXT = {
  polish: 'Wybierz awatar',
  english: 'Select avatar',
};

const SELECTTITLELABEL = {
  polish: 'Wybierz awatar',
  english: 'Select avatar',
};

const SELECTEDAVATARLABELTEXT = {
  polish: 'Wybrany awatar',
  english: 'Selected avatar',
};

const REMAININGAVATARSLABELTEXT = {
  polish: 'Pozostałe awatary',
  english: 'Remaining avatars',
};

const ALLAVATARSLABELTEXT = {
  polish: 'Wszystkie awatary',
  english: 'All avatars',
};
function AvatarPlaceholder({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="60" fill="#0D0D18" />
      <path d="M60 40C55.0294 40 51 44.0294 51 49C51 53.9706 55.0294 58 60 58C64.9706 58 69 53.9706 69 49C69 44.0294 64.9706 40 60 40Z" stroke="#BDCABE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 80C45 71.7157 51.7157 65 60 65C68.2843 65 75 71.7157 75 80" stroke="#BDCABE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="43" y="33" width="34" height="54" rx="2" stroke="#BDCABE" strokeWidth="2" />
    </svg>
  );
}

function pickPopularAvatars(avatars, count = 5) {
  if (avatars.length <= count) {
    return [...avatars];
  }
  const pool = [...avatars];
  const picked = [];
  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

/**
 * Kafelkowy wybór awatara — aktualny podgląd, 5 popularnych oraz pełna galeria.
 *
 * @param {Object} props
 * @param {{ id: number, name?: string, imageUrl?: string }[]} props.avatars
 * @param {number | null} props.value — wybrane `avatarId`
 * @param {(avatarId: number) => void} props.onChange
 * @param {boolean} [props.disabled]
 * @param {'default' | 'compact'} [props.variant='default'] — `compact` dla rejestracji (mniejszy podgląd, modal z pełną listą)
 * @param {string} [props.className]
 */
export default function AvatarPicker({
  avatars,
  value,
  onChange,
  disabled = false,
  variant = 'default',
  className = '',
  LANGUAGE = 'polish',
}) {
  const isCompact = variant === 'compact';
  const responsivePopularCount = useResponsivePopularCount();
  const popularLimit = isCompact ? responsivePopularCount : 5;
  const [showGallery, setShowGallery] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [popularAvatars, setPopularAvatars] = useState([]);
  useEffect(() => {
    if (avatars.length === 0) {
      setPopularAvatars([]);
      return;
    }
    setPopularAvatars(pickPopularAvatars(avatars, popularLimit));
  }, [avatars, popularLimit]);
  const selectedAvatar = useMemo(
    () => avatars.find((avatar) => avatar.id === value) ?? null,
    [avatars, value],
  );

  const remainingAvatars = useMemo(() => {
    const popularIds = new Set(popularAvatars.map((avatar) => avatar.id));
    return avatars.filter((avatar) => !popularIds.has(avatar.id));
  }, [avatars, popularAvatars]);

  const handleSelect = useCallback((avatarId) => {
    if (disabled) return;
    onChange(avatarId);
  }, [disabled, onChange]);

  const renderTile = (avatar, size = 'md') => {
    const isActive = avatar.id === value;
    return (
      <button
        key={avatar.id}
        type="button"
        className={[
          'maq-avatar-picker__tile',
          `maq-avatar-picker__tile--${size}`,
          isActive ? 'maq-avatar-picker__tile--active' : '',
        ].join(' ')}
        onClick={() => handleSelect(avatar.id)}
        disabled={disabled}
        aria-pressed={isActive}
        aria-label={avatar.name ? `${SELECTTITLELABEL[LANGUAGE]} ${avatar.name}` : `${SELECTTITLELABEL[LANGUAGE]} ${avatar.id}`}
      >
        <span className="maq-avatar-picker__tile-frame">
          {avatar.imageUrl ? (
            <img
              src={avatar.imageUrl}
              alt=""
              className={getAvatarImageClassName(avatar.imageUrl, 'maq-avatar-picker__tile-image')}
            />
          ) : (
            <AvatarPlaceholder className="maq-avatar-picker__tile-image" />
          )}
        </span>
      </button>
    );
  };

  const renderCurrentPreview = (frameClassName = 'maq-avatar-picker__current-frame') => (
    <div className="maq-avatar-picker__current-preview" aria-live="polite">
      <div className={frameClassName}>
        {selectedAvatar?.imageUrl ? (
          <img
            src={selectedAvatar.imageUrl}
            alt={selectedAvatar.name ?? SELECTEDAVATARLABELTEXT[LANGUAGE]}
            className={getAvatarImageClassName(selectedAvatar.imageUrl, 'maq-avatar-picker__current-image')}
          />
        ) : (
          <AvatarPlaceholder className="maq-avatar-picker__current-image" />
        )}
      </div>
    </div>
  );

  const showAllButton = isCompact
    ? avatars.length > popularAvatars.length
    : remainingAvatars.length > 0;

  return (
    <div
      className={[
        'maq-avatar-picker',
        isCompact ? 'maq-avatar-picker--compact' : '',
        showGallery ? 'maq-avatar-picker--gallery-open' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="maq-avatar-picker__current">
        <p className="maq-avatar-picker__label">{AVATARPICKERLABELTEXT[LANGUAGE]}</p>
        {renderCurrentPreview()}
      </div>
      {popularAvatars.length > 0 ? (
        <div className="maq-avatar-picker__popular">
          <p className="maq-avatar-picker__label">{POPULARLABELTEXT[LANGUAGE]}</p>
          <div className="maq-avatar-picker__popular-grid" role="list">
            {popularAvatars.map((avatar) => renderTile(avatar, 'sm'))}
          </div>
        </div>
      ) : null}

      {showAllButton ? (
        <div className="maq-avatar-picker__more">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={disabled}
            onClick={() => {
              if (isCompact) {
                setShowAllModal(true);
                return;
              }
              setShowGallery((expanded) => !expanded);
            }}
            aria-expanded={isCompact ? showAllModal : showGallery}
          >
            {isCompact
              ? SHOWALLBUTTONLABELTEXT[LANGUAGE]
              : (showGallery ? HIDEALLLABELTEXT[LANGUAGE] : SHOWALLLABELTEXT[LANGUAGE])}
          </Button>
        </div>
      ) : null}

      {!isCompact && showGallery && avatars.length > 0 ? (
        <div className="maq-avatar-picker__gallery" role="list" aria-label={REMAININGAVATARSLABELTEXT[LANGUAGE]}>
          {(remainingAvatars.length > 0 ? remainingAvatars : avatars).map((avatar) => renderTile(avatar, 'md'))}
        </div>
      ) : null}

      {isCompact ? (
        <Modal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          title={SELECTAVATARMODALLABELTEXT[LANGUAGE]}
          size="lg"
          showFooter={false}
          className="maq-avatar-picker__modal"
        >
          <div className="maq-avatar-picker__modal-content">
            <div className="maq-avatar-picker__modal-preview">
              <p className="maq-avatar-picker__label">{AVATARPICKERLABELTEXT[LANGUAGE]}</p>
              {renderCurrentPreview('maq-avatar-picker__current-frame maq-avatar-picker__current-frame--modal')}
            </div>
            <div className="maq-avatar-picker__modal-gallery" role="list" aria-label={ALLAVATARSLABELTEXT[LANGUAGE]}>
              {avatars.map((avatar) => renderTile(avatar, 'md'))}
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
