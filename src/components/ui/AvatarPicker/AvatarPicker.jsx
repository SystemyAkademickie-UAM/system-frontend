import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from '../index.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import {
  AVATAR_CATEGORY,
  AVATAR_CATEGORY_TABS,
  filterAvatarsByCategory,
  pickRandomAvatars,
} from '../../../utils/avatarCategories.js';
import './AvatarPicker.css';

const AVATARPICKERLABELTEXT = {
  polish: 'Twój awatar',
  english: 'Your avatar',
};

const POPULARLABELTEXT = {
  polish: 'Ostatnio najczęściej wybierane',
  english: 'Recently most chosen',
};

const SHOWALLBUTTONLABELTEXT = {
  polish: 'Pokaż wszystkie',
  english: 'Show all',
};

const SELECTAVATARMODALLABELTEXT = {
  polish: 'Wybór awataru',
  english: 'Avatar selection',
};

const SELECTTITLELABEL = {
  polish: 'Wybierz awatar',
  english: 'Select avatar',
};

const SELECTEDAVATARLABELTEXT = {
  polish: 'Wybrany awatar',
  english: 'Selected avatar',
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

/**
 * Kafelkowy wybór awatara — aktualny podgląd, 4 losowe awatary oraz pop-up ze wszystkimi awatarami i kategoriami.
 *
 * @param {Object} props
 * @param {{ id: number, name?: string, imageUrl?: string }[]} props.avatars
 * @param {number | null} props.value — wybrane `avatarId`
 * @param {(avatarId: number) => void} props.onChange
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isLoading] — skeleton zamiast pustego przełączenia layoutu
 * @param {'default' | 'compact' | 'left' | 'center'} [props.variant='default']
 * @param {'left' | 'center'} [props.align] — opcjonalne nadpisanie wyrównania
 * @param {string} [props.className]
 * @param {string} [props.LANGUAGE='polish']
 */
export default function AvatarPicker({
  avatars,
  value,
  onChange,
  disabled = false,
  isLoading = false,
  variant = 'default',
  align,
  className = '',
  LANGUAGE = 'polish',
}) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(AVATAR_CATEGORY.ALL);
  const [popularAvatars, setPopularAvatars] = useState([]);
  const hasInitializedPopularRef = useRef(false);

  const isCentered = align === 'center' || variant === 'compact' || variant === 'center';

  useEffect(() => {
    if (avatars.length === 0) {
      setPopularAvatars([]);
      hasInitializedPopularRef.current = false;
      return;
    }
    if (!hasInitializedPopularRef.current) {
      setPopularAvatars(pickRandomAvatars(avatars, 4));
      hasInitializedPopularRef.current = true;
    }
  }, [avatars]);

  const selectedAvatar = useMemo(
    () => avatars.find((avatar) => avatar.id === value) ?? null,
    [avatars, value],
  );

  const filteredAvatars = useMemo(
    () => filterAvatarsByCategory(avatars, activeCategory),
    [avatars, activeCategory],
  );

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

  const renderCategoryTabs = () => (
    <div className="maq-avatar-picker__tabs" role="tablist" aria-label="Kategorie awatarów">
      {AVATAR_CATEGORY_TABS.map((tab) => {
        const isSelected = activeCategory === tab.id;
        const labelText = typeof tab.label === 'object'
          ? (tab.label[LANGUAGE] || tab.label.polish)
          : tab.label;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={[
              'maq-avatar-picker__tab-button',
              isSelected ? 'maq-avatar-picker__tab-button--active' : '',
            ].join(' ')}
            onClick={() => setActiveCategory(tab.id)}
          >
            {labelText}
          </button>
        );
      })}
    </div>
  );

  const showAllButton = !isLoading && avatars.length > 0;
  const skeletonTileCount = 4;

  return (
    <div
      className={[
        'maq-avatar-picker',
        isCentered ? 'maq-avatar-picker--center' : 'maq-avatar-picker--left',
        isLoading ? 'maq-avatar-picker--loading' : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-busy={isLoading || undefined}
    >
      <div className="maq-avatar-picker__current">
        <p className="maq-avatar-picker__label">{AVATARPICKERLABELTEXT[LANGUAGE]}</p>
        {isLoading ? (
          <div className="maq-avatar-picker__current-preview" aria-hidden="true">
            <div className="maq-avatar-picker__current-frame maq-avatar-picker__skeleton" />
          </div>
        ) : (
          renderCurrentPreview()
        )}
      </div>

      {isLoading ? (
        <div className="maq-avatar-picker__popular">
          <p className="maq-avatar-picker__label">{POPULARLABELTEXT[LANGUAGE]}</p>
          <div className="maq-avatar-picker__popular-grid" aria-hidden="true">
            {Array.from({ length: skeletonTileCount }, (_, index) => (
              <span
                key={`avatar-skeleton-${index}`}
                className="maq-avatar-picker__tile maq-avatar-picker__tile--sm maq-avatar-picker__skeleton"
              />
            ))}
          </div>
        </div>
      ) : popularAvatars.length > 0 ? (
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
            onClick={() => setShowAllModal(true)}
            aria-expanded={showAllModal}
          >
            {SHOWALLBUTTONLABELTEXT[LANGUAGE]}
          </Button>
        </div>
      ) : null}

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
          {renderCategoryTabs()}
          <div className="maq-avatar-picker__modal-gallery" role="list" aria-label={ALLAVATARSLABELTEXT[LANGUAGE]}>
            {filteredAvatars.map((avatar) => renderTile(avatar, 'md'))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
