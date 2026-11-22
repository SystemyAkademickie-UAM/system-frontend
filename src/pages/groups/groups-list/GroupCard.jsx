/**
 * @file GroupCard.jsx
 * @description Główny komponent widoku strony dla obszaru GroupCard.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { isColorBannerRef, parseColorBannerRef } from '../../../constants/drive.constants.js';
import { SVG_PLACEHOLDER } from '../../../constants/svgIcons.js';
import { groupMainPath, groupRootPath } from '../../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import './GroupCard.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const NOIMAGE__TEXTLABEL = {
  polish: 'Brak baneru',
  english: 'No banner',
};
const SUBJECT__TEXTLABEL = {
  polish: 'Przedmiot',
  english: 'Subject',
};
const LECTURER__TEXTLABEL = {
  polish: 'Osoba prowadząca',
  english: 'Lecturer',
};

/**
 * @param {Object} props
 * @param {import('../../../services/groups.api.js').GroupListItem} props.group
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function GroupCard({
  group,
  onEditGroup = null,
  onDeleteGroup = null,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [bannerFailed, setBannerFailed] = useState(!group.bannerUrl);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isColorBanner = isColorBannerRef(group.bannerUrl);
  const colorBannerValue = parseColorBannerRef(group.bannerUrl);

  const showFallback = !isColorBanner && (bannerFailed || !group.bannerUrl);

  const { profile } = useUserProfile();
  const { role } = useAppRole();
  const session = useSessionOptional();
  const isAdminOrSuper = role === APP_ROLE.ADMIN || role === APP_ROLE.SUPERADMIN || session?.role === APP_ROLE.ADMIN || session?.role === APP_ROLE.SUPERADMIN;

  var userNickname = profile.nickname;

  var displayLecturer = group.lecturer;

  if (group.isMine && role == APP_ROLE.LECTURER && !displayLecturer.startsWith(userNickname + ' (')) {
    displayLecturer = userNickname + ' (' + group.lecturer + ')';
  }

  useEffect(() => {
    setBannerFailed(!group.bannerUrl || isColorBannerRef(group.bannerUrl));
  }, [group.bannerUrl]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [menuOpen]);

  const targetPath = isAdminOrSuper
    ? `/groups/${group.id}/admin/home`
    : (group.isMine ? groupMainPath(group.id) : groupRootPath(group.id));

// === RENDEROWANIE WIDOKU ===
  return (
    <article className="group-card">
      <Link className="group-card__link" to={targetPath}>
        <div className="group-card__banner-wrap">
          {isAdminOrSuper ? (
            <div
              className="group-card__admin-actions"
              ref={menuRef}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                className="group-card__menu-trigger"
                aria-label="Więcej opcji grupy"
                aria-expanded={menuOpen}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <circle cx="10" cy="4" r="2" />
                  <circle cx="10" cy="10" r="2" />
                  <circle cx="10" cy="16" r="2" />
                </svg>
              </button>

              {menuOpen ? (
                <div className="group-card__menu-dropdown" role="menu">
                  <button
                    type="button"
                    className="group-card__menu-item"
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEditGroup?.(group);
                    }}
                  >
                    Edytuj grupę i członków
                  </button>
                  <button
                    type="button"
                    className="group-card__menu-item group-card__menu-item--danger"
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDeleteGroup?.(group);
                    }}
                  >
                    Usuń grupę
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {isColorBanner ? (
            <div
              className="group-card__banner group-card__banner--color"
              style={{ backgroundColor: colorBannerValue ?? '#3b82f6' }}
              aria-hidden="true"
            />
          ) : showFallback ? (
            <div className="group-card__banner-fallback" aria-hidden="true">
              <AssetSvg
                name={SVG_PLACEHOLDER}
                className="group-card__banner-fallback-icon"
                width={48}
                height={48}
                alt=""
              />
              <span className="group-card__banner-fallback-text">{NOIMAGE__TEXTLABEL[LANGUAGE]}</span>
            </div>
          ) : (
            <img
              className="group-card__banner"
              src={group.bannerUrl}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setBannerFailed(true)}
            />
          )}
        </div>

        <div className="group-card__body">
          <h2 className="group-card__title">{group.storyName}</h2>

          <dl className="group-card__meta">
            <div className="group-card__meta-col">
              <dt className="group-card__label">{SUBJECT__TEXTLABEL[LANGUAGE]}</dt>
              <dd className="group-card__value">{group.subject}</dd>
            </div>
            <div className="group-card__meta-col">
              <dt className="group-card__label">{LECTURER__TEXTLABEL[LANGUAGE]}</dt>
              <dd className="group-card__value">{displayLecturer}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
