import { useState } from 'react';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { buildPaginationItems } from './buildPaginationItems.js';
import './Pagination.css';

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
  ariaLabel = 'Paginacja',
  className = '',
}) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = pageProp !== undefined;
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
    <nav className={['maq-pagination', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <button
        type="button"
        className="maq-pagination__btn maq-pagination__btn--nav"
        aria-label="Poprzednia strona"
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
              aria-label={`Strona ${item.page}`}
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
        aria-label="Następna strona"
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
