import { useState } from 'react';
import { Link } from 'react-router-dom';
import { groupMainPath } from '../../../routes/pathRegistry.js';
import './GroupCard.css';

function BannerFallbackIcon() {
  return (
    <svg className="group-card__banner-fallback-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6 32l10-10 8 8 6-6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 16h2M32 18v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 38h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * @param {Object} props
 * @param {import('../groupsList.mock.js').GroupListItem} props.group
 */
export default function GroupCard({ group }) {
  const [bannerFailed, setBannerFailed] = useState(!group.bannerUrl);
  const showFallback = bannerFailed || !group.bannerUrl;

  return (
    <article className="group-card">
      <Link className="group-card__link" to={groupMainPath(group.id)}>
        <div className="group-card__banner-wrap">
          {showFallback ? (
            <div className="group-card__banner-fallback" aria-hidden="true">
              <BannerFallbackIcon />
              <span className="group-card__banner-fallback-text">Brak grafiki</span>
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
              <dt className="group-card__label">Przedmiot</dt>
              <dd className="group-card__value">{group.subject}</dd>
            </div>
            <div className="group-card__meta-col">
              <dt className="group-card__label">Prowadzący</dt>
              <dd className="group-card__value">{group.lecturer}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
