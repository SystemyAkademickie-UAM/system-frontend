import { useEffect, useState } from 'react';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { DataTableRowActions } from '../DataTable/DataTable.jsx';
import { isColorBannerRef, parseColorBannerRef } from '../../../constants/drive.constants.js';
import { SVG_ICONS, SVG_PLACEHOLDER } from '../../../constants/svgIcons.js';
import './TemplateListingCard.css';

/**
 * Poziomy kafelek szablonu (inspiracja: ogłoszenia oto-dom).
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string | null} [props.description]
 * @param {string | null} [props.bannerUrl]
 * @param {string} [props.subjectName]
 * @param {boolean} [props.isPublic]
 * @param {string} [props.createdAt]
 * @param {{ badges?: number, ranks?: number, items?: number, stages?: number, activities?: number, posts?: number }} [props.stats]
 * @param {boolean} [props.isFavorite=false]
 * @param {(event: import('react').MouseEvent) => void} [props.onToggleFavorite]
 * @param {() => void} [props.onClick]
 * @param {string} [props.creatorLabel] — galeria: ksywka / imię i nazwisko autora
 * @param {boolean} [props.isOwnTemplate=false] — galeria: szablon bieżącego prowadzącego
 * @param {boolean} [props.showVisibilityBadge=true] — „Moje szablony”: publiczny / prywatny
 * @param {object} [props.row]
 * @param {import('../DataTable/DataTable.jsx').DataTableRowActionsConfig} [props.rowActions]
 * @param {string} [props.className]
 */
export default function TemplateListingCard({
  name,
  description,
  bannerUrl = null,
  subjectName,
  isPublic,
  createdAt,
  stats,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  creatorLabel,
  isOwnTemplate = false,
  showVisibilityBadge = true,
  row,
  rowActions,
  className = '',
}) {
  const [bannerFailed, setBannerFailed] = useState(!bannerUrl);
  const isColorBanner = isColorBannerRef(bannerUrl);
  const colorBannerValue = parseColorBannerRef(bannerUrl);
  const showFallback = !isColorBanner && (bannerFailed || !bannerUrl);
  const hasHeadActions = Boolean(onToggleFavorite || (rowActions && row));

  useEffect(() => {
    setBannerFailed(!bannerUrl || isColorBannerRef(bannerUrl));
  }, [bannerUrl]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  const headActions = hasHeadActions ? (
    <div
      className="maq-template-listing-card__head-actions"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {onToggleFavorite ? (
        <button
          type="button"
          className={[
            'maq-template-listing-card__favorite',
            isFavorite ? 'maq-template-listing-card__favorite--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(event);
          }}
        >
          <AssetSvg
            name={SVG_ICONS.content.star}
            className="maq-template-listing-card__favorite-icon"
            width={20}
            height={20}
            alt=""
          />
        </button>
      ) : null}
      {rowActions && row ? (
        <div className="maq-template-listing-card__menu">
          <DataTableRowActions row={row} rowActions={rowActions} />
        </div>
      ) : null}
    </div>
  ) : null;

  const mainContent = (
    <>
      <div className="maq-template-listing-card__media">
        {isColorBanner ? (
          <div
            className="maq-template-listing-card__banner maq-template-listing-card__banner--color"
            style={{ backgroundColor: colorBannerValue ?? '#3b82f6' }}
            aria-hidden="true"
          />
        ) : showFallback ? (
          <div className="maq-template-listing-card__banner-fallback" aria-hidden="true">
            <AssetSvg name={SVG_PLACEHOLDER} width={40} height={40} alt="" />
          </div>
        ) : (
          <img
            className="maq-template-listing-card__banner"
            src={bannerUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setBannerFailed(true)}
          />
        )}
      </div>

      <div className="maq-template-listing-card__body">
        <div className="maq-template-listing-card__head">
          <h3
            className={[
              'maq-template-listing-card__title',
              hasHeadActions ? 'maq-template-listing-card__title--with-actions' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {name}
          </h3>
        </div>

        {subjectName ? (
          <p className="maq-template-listing-card__subject">{subjectName}</p>
        ) : null}

        {description ? (
          <p className="maq-template-listing-card__description">{description}</p>
        ) : (
          <p className="maq-template-listing-card__description maq-template-listing-card__description--muted">
            Brak opisu szablonu.
          </p>
        )}

        {stats ? (
          <ul className="maq-template-listing-card__stats" aria-label="Statystyki szablonu">
            <li>{stats.badges ?? 0} odznak</li>
            <li>{stats.ranks ?? 0} rang</li>
            <li>{stats.items ?? 0} przedmiotów</li>
            <li>{stats.stages ?? 0} etapów</li>
            <li>{stats.activities ?? 0} aktywności</li>
          </ul>
        ) : null}

        <div className="maq-template-listing-card__footer">
          {isOwnTemplate ? (
            <span className="maq-template-listing-card__badge maq-template-listing-card__badge--own">
              Twój szablon
            </span>
          ) : null}
          {creatorLabel ? (
            <span className="maq-template-listing-card__badge maq-template-listing-card__badge--creator">
              {creatorLabel}
            </span>
          ) : null}
          {showVisibilityBadge && typeof isPublic === 'boolean' ? (
            <span
              className={[
                'maq-template-listing-card__badge',
                isPublic ? 'maq-template-listing-card__badge--public' : 'maq-template-listing-card__badge--private',
              ].join(' ')}
            >
              {isPublic ? 'Publiczny' : 'Prywatny'}
            </span>
          ) : null}
          {formattedDate ? <span className="maq-template-listing-card__date">{formattedDate}</span> : null}
        </div>
      </div>
    </>
  );

  const classNames = ['maq-template-listing-card', className].filter(Boolean).join(' ');

  if (onClick) {
    return (
      <article className={classNames}>
        <div className="maq-template-listing-card__shell">
          <button type="button" className="maq-template-listing-card__button" onClick={onClick}>
            {mainContent}
          </button>
          {headActions}
        </div>
      </article>
    );
  }

  return (
    <article className={classNames}>
      <div className="maq-template-listing-card__shell maq-template-listing-card__shell--static">
        {mainContent}
        {headActions}
      </div>
    </article>
  );
}
