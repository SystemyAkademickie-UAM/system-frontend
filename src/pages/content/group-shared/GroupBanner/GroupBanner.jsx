import { useEffect, useState } from 'react';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import ContentWithMeasuredDivider from '../../../../components/ui/ContentWithMeasuredDivider/ContentWithMeasuredDivider.jsx';
import { isColorBannerRef, parseColorBannerRef } from '../../../../constants/drive.constants.js';
import { SVG_PLACEHOLDER } from '../../../../constants/svgIcons.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import { splitGroupStoryTitle } from './splitGroupStoryTitle.js';
import './GroupBanner.css';

const NOIMAGE__TEXTLABEL = {
  polish: 'Brak grafiki',
  english: 'No image',
};

const LOADINGGROUPDATA__TEXTLABEL = {
  polish: 'Ładowanie danych grupy…',
  english: 'Loading group data…',
};

/**
 * Baner grupy — grafika z gradientem, nazwa fabularna i opis.
 *
 * @param {Object} props
 * @param {string | null | undefined} props.storyName
 * @param {string | null | undefined} props.description
 * @param {string | null | undefined} props.bannerUrl
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.showDescription=true]
 * @param {string} [props.className]
 */
export default function GroupBanner({
  storyName,
  description,
  bannerUrl,
  isLoading = false,
  showDescription = true,
  className = '',
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
      className={[
        'group-banner',
        showDescription ? '' : 'group-banner--compact',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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
            <span className="group-banner__fallback-text">{NOIMAGE__TEXTLABEL[LANGUAGE]}</span>
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
            {LOADINGGROUPDATA__TEXTLABEL[LANGUAGE]}
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
            {showDescription && trimmedDescription ? (
              <div className="group-banner__description-block">
                <ContentWithMeasuredDivider
                  className="group-banner__description"
                  dividerClassName="group-banner__description-divider"
                >
                  {trimmedDescription}
                </ContentWithMeasuredDivider>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
