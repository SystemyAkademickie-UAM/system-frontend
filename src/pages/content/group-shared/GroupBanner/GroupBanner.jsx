import { useEffect, useState } from 'react';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { isColorBannerRef, parseColorBannerRef } from '../../../../constants/drive.constants.js';
import { SVG_PLACEHOLDER } from '../../../../constants/svgIcons.js';
import { splitGroupStoryTitle } from './splitGroupStoryTitle.js';
import './GroupBanner.css';

/**
 * Baner grupy — grafika z gradientem, nazwa fabularna i opis.
 *
 * @param {Object} props
 * @param {string | null | undefined} props.storyName
 * @param {string | null | undefined} props.description
 * @param {string | null | undefined} props.bannerUrl
 * @param {boolean} [props.isLoading]
 * @param {string} [props.className]
 */
export default function GroupBanner({
  storyName,
  description,
  bannerUrl,
  isLoading = false,
  className = '',
}) {
  const [bannerFailed, setBannerFailed] = useState(!bannerUrl);
  const isColorBanner = isColorBannerRef(bannerUrl);
  const colorBannerValue = parseColorBannerRef(bannerUrl);
  const showFallback = !isColorBanner && (bannerFailed || !bannerUrl);
  const { primary, accentLines } = splitGroupStoryTitle(storyName);
  const trimmedDescription = String(description ?? '').trim();
  const bannerLabel = [primary, ...accentLines].filter(Boolean).join(' ');

  useEffect(() => {
    setBannerFailed(!bannerUrl || isColorBannerRef(bannerUrl));
  }, [bannerUrl]);

  return (
    <section
      className={['group-banner', className].filter(Boolean).join(' ')}
      aria-label={bannerLabel || 'Grupa'}
    >
      <div className="group-banner__media">
        {isColorBanner ? (
          <div
            className="group-banner__image group-banner__image--color"
            style={{ backgroundColor: colorBannerValue ?? '#3b82f6' }}
            aria-hidden="true"
          />
        ) : showFallback ? (
          <div className="group-banner__fallback" aria-hidden="true">
            <AssetSvg
              name={SVG_PLACEHOLDER}
              className="group-banner__fallback-icon"
              width={56}
              height={56}
              alt=""
            />
            <span className="group-banner__fallback-text">Brak grafiki</span>
          </div>
        ) : (
          <img
            className="group-banner__image"
            src={bannerUrl}
            alt=""
            decoding="async"
            onError={() => setBannerFailed(true)}
          />
        )}
        <div className="group-banner__overlay" aria-hidden="true" />
      </div>

      <div className="group-banner__content">
        {isLoading ? (
          <p className="group-banner__loading" role="status">
            Ładowanie danych grupy…
          </p>
        ) : (
          <>
            <h1 className="group-banner__title">
              <span className="group-banner__title-primary">{primary}</span>
              {accentLines.map((line) => (
                <span key={line} className="group-banner__title-accent">
                  {line}
                </span>
              ))}
            </h1>
            {trimmedDescription ? (
              <p className="group-banner__description">{trimmedDescription}</p>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
