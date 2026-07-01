import { useState } from 'react';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { buildPaginationItems } from './buildPaginationItems.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './Pagination.css';

const PAG__TEXTLABEL = {
  polish: 'Paginacja',
  english: 'Pagination',
};

const PREVIOUSBUTTON__TEXTLABEL = {
  polish: 'Poprzednia strona',
  english: 'Previous page',
};

const NEXTBUTTON__TEXTLABEL = {
  polish: 'Następna strona',
  english: 'Next page',
};

const PAGELABEL__TEXTLABEL = {
  polish: 'Strona',
  english: 'Page',
};

/**
 * Paginacja list / tabel.
 *
 * @param {Object} props
 * @param {number} props.totalPages — liczba stron (≥ 1); przy 0 nic nie renderuje
 * @param {number} [props.page] — sterowana bieżąca strona (1-based)
 * @param {number} [props.defaultPage=1] — gdy brak `page`
 * @param {(page: number) => void} [props.onPageChange]
 * @param {string} [props.ariaLabel]
 * @param {string} [props.className]
 */
export default function Pagination({
  totalPages,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  ariaLabel,
  className = '',
}) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = pageProp !== undefined;
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const resolvedAriaLabel = ariaLabel ?? PAG__TEXTLABEL[LANGUAGE];
  const total = Math.max(0, Math.floor(totalPages));

  if (total <= 0) {
    return null;
  }

  const currentPage = isControlled
    ? Math.min(Math.max(1, pageProp), total)
    : Math.min(Math.max(1, internalPage), total);

  const setPage = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), total);
    if (!isControlled) {
      setInternalPage(clamped);
    }
    if (clamped !== currentPage) {
      onPageChange?.(clamped);
    }
  };

  const items = buildPaginationItems(currentPage, total);

  return (
    <nav className={['maq-pagination', className].filter(Boolean).join(' ')} aria-label={resolvedAriaLabel}>
      <button
        type="button"
        className="maq-pagination__btn maq-pagination__btn--nav"
        aria-label={PREVIOUSBUTTON__TEXTLABEL[LANGUAGE]}
        disabled={currentPage <= 1}
        onClick={() => setPage(currentPage - 1)}
      >
        <AssetSvg
          name={SVG_ICONS.controls.chevronLeft}
          className="maq-pagination__chevron"
          width={7}
          height={10}
          alt=""
        />
      </button>

      <div className="maq-pagination__pages">
        {items.map((item, index) => {
          if (item.type === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="maq-pagination__ellipsis" aria-hidden="true">
                …
              </span>
            );
          }

          const isActive = item.page === currentPage;
          return (
            <button
              key={`page-${item.page}`}
              type="button"
              className={['maq-pagination__btn', 'maq-pagination__btn--page', isActive ? 'maq-pagination__btn--active' : '']
                .filter(Boolean)
                .join(' ')}
              aria-label={`${PAGELABEL__TEXTLABEL[LANGUAGE]} ${item.page}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setPage(item.page)}
            >
              {item.page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="maq-pagination__btn maq-pagination__btn--nav"
        aria-label={NEXTBUTTON__TEXTLABEL[LANGUAGE]}
        disabled={currentPage >= total}
        onClick={() => setPage(currentPage + 1)}
      >
        <AssetSvg
          name={SVG_ICONS.controls.chevronRight}
          className="maq-pagination__chevron"
          width={7}
          height={10}
          alt=""
        />
      </button>
    </nav>
  );
}
