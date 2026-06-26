import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { isColorBannerRef, parseColorBannerRef } from '../../../constants/drive.constants.js';
import { SVG_PLACEHOLDER } from '../../../constants/svgIcons.js';
import { groupMainPath, groupRootPath } from '../../../routes/pathRegistry.js';
import './GroupCard.css';

/**
 * @param {Object} props
 * @param {import('../../../services/groups.api.js').GroupListItem} props.group
 */
export default function GroupCard({ group }) {
  const [bannerFailed, setBannerFailed] = useState(!group.bannerUrl);
  const isColorBanner = isColorBannerRef(group.bannerUrl);
  const colorBannerValue = parseColorBannerRef(group.bannerUrl);
  const showFallback = !isColorBanner && (bannerFailed || !group.bannerUrl);

  useEffect(() => {
    setBannerFailed(!group.bannerUrl || isColorBannerRef(group.bannerUrl));
  }, [group.bannerUrl]);

  const targetPath = group.isMine ? groupMainPath(group.id) : groupRootPath(group.id);

  return (
    <article className="group-card">
      <Link className="group-card__link" to={targetPath}>
        <div className="group-card__banner-wrap">
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
