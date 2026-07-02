import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Pagination from '../Pagination/Pagination.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { useFloatingPanelPosition } from '../../../hooks/useFloatingPanelPosition.js';
import { positionDropdownMenu } from '../../../utils/ui/positionTooltipInViewport.js';
import { cycleSortRule, sortRows } from './dataTableSort.js';
import DataTableMobileRow from './DataTableMobileRow.jsx';
import './DataTable.css';

const SUPERBAR_HEIGHT = 63;
const HEADER_BORDER_RADIUS = '12px 12px 0 0';
const INLINE_ACTION_ICON_SIZE = 20;
const MOBILE_TABLE_MAX_WIDTH = 639;

/**
 * @param {Object[]} inlineActions
 * @returns {Object[]}
 */
function inlineActionsToMenuItems(inlineActions) {
  return inlineActions.map((item) => ({
    id: `__inline_${item.id}`,
    label: item.label,
    description: item.description,
    onSelect: item.onSelect,
    destructive: item.destructive,
  }));
}

function useMaxWidth(maxWidthPx) {
  const query = `(max-width: ${maxWidthPx}px)`;
  const [matches, setMatches] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(query).matches
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

function SortableHeader({ label, sortKey, sortRules, onSort, className = '' }) {
  const ruleIndex = sortRules.findIndex((rule) => rule.key === sortKey);
  const rule = ruleIndex >= 0 ? sortRules[ruleIndex] : null;
  const priority = ruleIndex >= 0 ? ruleIndex + 1 : null;

  return (
    <th className={['data-table__th', className].filter(Boolean).join(' ')} scope="col">
      <button
        type="button"
        className={[
          'data-table__sort-btn',
          rule ? 'data-table__sort-btn--active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onSort(sortKey)}
        aria-label={
          rule
            ? `Sortuj po ${label}: ${rule.direction === 'asc' ? 'rosnąco' : 'malejąco'}`
            : `Sortuj po ${label}`
        }
      >
        <span className="data-table__sort-label">{label}</span>
        {rule ? (
          <span className="data-table__sort-indicator" aria-hidden="true">
            <span className="data-table__sort-direction">
              {rule.direction === 'asc' ? '↑' : '↓'}
            </span>
            {sortRules.length > 1 ? (
              <span className="data-table__sort-priority">{priority}</span>
            ) : null}
          </span>
        ) : null}
      </button>
    </th>
  );
}

function DataTableRowActions({ row, rowActions, onMenuOpenChange, collapseInlineActions }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const isMobileTableView = useMaxWidth(MOBILE_TABLE_MAX_WIDTH);
  const shouldCollapseInlineActions = collapseInlineActions ?? isMobileTableView;
  const {
    onDelete,
    canDelete,
    deleteLabel = 'Usuń',
    deleteAriaLabel,
    inlineActions = [],
    menuItems = [],
  } = rowActions ?? {};

  const { visibleInlineActions, mergedMenuItems } = useMemo(() => {
    const deleteItem = onDelete && (canDelete == null || canDelete(row))
      ? {
        id: '__delete',
        label: deleteLabel,
        destructive: true,
        onSelect: onDelete,
      }
      : null;

    if (shouldCollapseInlineActions) {
      return {
        visibleInlineActions: [],
        mergedMenuItems: [
          ...inlineActionsToMenuItems(inlineActions),
          ...menuItems,
          ...(deleteItem ? [deleteItem] : []),
        ],
      };
    }

    return {
      visibleInlineActions: inlineActions,
      mergedMenuItems: [
        ...menuItems,
        ...(deleteItem ? [deleteItem] : []),
      ],
    };
  }, [
    canDelete,
    deleteLabel,
    inlineActions,
    menuItems,
    onDelete,
    row,
    shouldCollapseInlineActions,
  ]);

  const getMenuLayout = useCallback(({ triggerRect, panelRect }) => positionDropdownMenu({
    triggerRect,
    panelRect,
    align: 'end',
  }), []);

  const menuLayout = useFloatingPanelPosition({
    open: menuOpen,
    triggerRef: menuButtonRef,
    panelRef: menuRef,
    getLayout: getMenuLayout,
    deps: [mergedMenuItems.length],
  });

  const setMenuState = (nextOpen) => {
    setMenuOpen(nextOpen);
    onMenuOpenChange?.(nextOpen);
  };

  const handleMenuToggle = () => setMenuState(!menuOpen);
  const handleMenuClose = () => setMenuState(false);

  const handleAction = (item) => {
    item.onSelect?.(row);
    handleMenuClose();
  };

  if (visibleInlineActions.length === 0 && mergedMenuItems.length === 0) {
    return null;
  }

  return (
    <div className="data-table__actions">
      {visibleInlineActions.map((item) => (
        <button
          key={item.id}
          type="button"
          className={[
            'data-table__action-btn',
            'data-table__action-btn--inline',
            item.className,
          ].filter(Boolean).join(' ')}
          aria-label={item.ariaLabel ?? item.label}
          title={item.label}
          onClick={() => item.onSelect?.(row)}
        >
          {item.iconFile ? (
            <AssetSvg
              name={item.iconFile}
              className={item.iconClassName}
              width={item.iconSize ?? INLINE_ACTION_ICON_SIZE}
              height={item.iconSize ?? INLINE_ACTION_ICON_SIZE}
              alt=""
            />
          ) : (
            <span className="data-table__action-btn-text">{item.label}</span>
          )}
        </button>
      ))}
      {mergedMenuItems.length > 0 ? (
        <div className="data-table__menu-wrap">
          <button
            ref={menuButtonRef}
            type="button"
            className="data-table__action-btn data-table__action-btn--more"
            aria-label="Więcej opcji"
            aria-expanded={menuOpen}
            onClick={handleMenuToggle}
          >
            <AssetSvg
              name={SVG_ICONS.controls.more}
              width={INLINE_ACTION_ICON_SIZE}
              height={INLINE_ACTION_ICON_SIZE}
              alt=""
            />
          </button>
          {menuOpen && typeof document !== 'undefined'
            ? createPortal(
              <>
                <div
                  className="data-table__menu-backdrop"
                  onClick={handleMenuClose}
                  aria-hidden="true"
                />
                <div
                  ref={menuRef}
                  className="data-table__menu data-table__menu--fixed"
                  role="menu"
                  style={{
                    visibility: menuLayout ? 'visible' : 'hidden',
                    left: menuLayout ? `${menuLayout.left}px` : 0,
                    top: menuLayout ? `${menuLayout.top}px` : 0,
                  }}
                >
                  {mergedMenuItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={[
                        'data-table__menu-item',
                        item.destructive ? 'data-table__menu-item--destructive' : '',
                      ].filter(Boolean).join(' ')}
                      role="menuitem"
                      aria-label={item.destructive ? deleteAriaLabel?.(row) ?? item.label : undefined}
                      onClick={() => handleAction(item)}
                    >
                      <span className="data-table__menu-item-content">
                        <span className="data-table__menu-item-label">{item.label}</span>
                        {item.description ? (
                          <span className="data-table__menu-item-description">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
              </>,
              document.body,
            )
            : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultDataTableRow({ row, columns, rowActions, rowActionsPosition = 'end' }) {
  const actionsCell = rowActions ? (
    <td className="data-table__cell data-table__cell--actions">
      <DataTableRowActions row={row} rowActions={rowActions} />
    </td>
  ) : null;

  return (
    <tr className="data-table__row">
      {rowActionsPosition === 'start' ? actionsCell : null}
      {columns.map((column) => (
        <td
          key={column.key}
          className={[
            'data-table__cell',
            column.cellClassName,
            column.hiddenBelow ? `data-table__cell--hide-below-${column.hiddenBelow}` : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {column.render ? column.render(row) : String(row[column.key] ?? '')}
        </td>
      ))}
      {rowActionsPosition === 'end' ? actionsCell : null}
    </tr>
  );
}

/**
 * Tabela z wyszukiwaniem, sortowaniem wielopoziomowym, paginacją i akcjami wiersza.
 */
export default function DataTable({
  columns,
  data,
  rowKey = 'id',
  search,
  toolbarStart = null,
  itemsPerPage = 10,
  tiebreakerKey,
  rowActions,
  rowActionsPosition = 'end',
  paginationAriaLabel = 'Nawigacja stron tabeli',
  stickyHeader = true,
  className = '',
  renderRow,
  renderMobileRow,
  getMobileItemClassName,
  shouldRenderRowActions,
}) {
  const [page, setPage] = useState(1);
  const [internalSearch, setInternalSearch] = useState('');
  const [sortRules, setSortRules] = useState([]);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const cardRef = useRef(null);
  const headerBarRef = useRef(null);
  const headerScrollRef = useRef(null);
  const bodyScrollRef = useRef(null);
  const isStickyRef = useRef(false);
  const rafIdRef = useRef(null);

  const searchValue = search?.value ?? internalSearch;
  const showSearchInToolbar = search && !search.external;
  const showToolbar = toolbarStart || showSearchInToolbar;

  const getRowKey = useCallback(
    (row) => (typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey])),
    [rowKey],
  );

  const handleSearchChange = (event) => {
    search?.onChange?.(event);
    if (search?.value === undefined) {
      setInternalSearch(event.target.value);
    }
    setPage(1);
  };

  const filteredRows = useMemo(() => {
    const query = searchValue.trim();
    const normalizedQuery = query.toLowerCase();
    const matched = query
      ? data.filter((row) => {
          if (search?.filter) {
            return search.filter(row, normalizedQuery);
          }
          return columns.some((column) => {
            const value = column.accessor ? column.accessor(row) : row[column.key];
            return String(value ?? '').toLowerCase().includes(normalizedQuery);
          });
        })
      : data;

    return sortRows(matched, sortRules, columns, tiebreakerKey);
  }, [columns, data, search, searchValue, sortRules, tiebreakerKey]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));

  const paginatedRows = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, page, totalPages, itemsPerPage]);

  const handleSort = (key) => {
    setSortRules((prev) => cycleSortRule(prev, key));
    setPage(1);
  };

  const syncHeaderScroll = useCallback(() => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  }, []);

  const updateHeaderPosition = useCallback(() => {
    if (!stickyHeader) return;

    const card = cardRef.current;
    const headerBar = headerBarRef.current;
    const bodyScroll = bodyScrollRef.current;
    if (!card || !headerBar || !bodyScroll) return;

    const cardRect = card.getBoundingClientRect();
    const shouldBeSticky = cardRect.top < SUPERBAR_HEIGHT;

    if (shouldBeSticky) {
      const bodyRect = bodyScroll.getBoundingClientRect();
      headerBar.style.position = 'fixed';
      headerBar.style.top = `${SUPERBAR_HEIGHT}px`;
      headerBar.style.left = `${bodyRect.left}px`;
      headerBar.style.width = `${bodyRect.width}px`;
      headerBar.style.zIndex = '10';
      headerBar.style.borderRadius = HEADER_BORDER_RADIUS;
      headerBar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
    } else {
      headerBar.style.position = '';
      headerBar.style.top = '';
      headerBar.style.left = '';
      headerBar.style.width = '';
      headerBar.style.zIndex = '';
      headerBar.style.borderRadius = HEADER_BORDER_RADIUS;
      headerBar.style.boxShadow = '';
    }

    if (isStickyRef.current !== shouldBeSticky) {
      isStickyRef.current = shouldBeSticky;
      setIsHeaderSticky(shouldBeSticky);
    }
  }, [stickyHeader]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!stickyHeader) return undefined;

    const mainEl = document.getElementById('main-content');
    const scrollTarget = mainEl || window;
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;
      updateHeaderPosition();
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    scrollTarget.addEventListener('scroll', updateHeaderPosition, { passive: true });

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      scrollTarget.removeEventListener('scroll', updateHeaderPosition);
    };
  }, [stickyHeader, updateHeaderPosition]);

  const hasRowActions = Boolean(
    rowActions?.onDelete
    || rowActions?.inlineActions?.length
    || rowActions?.menuItems?.length,
  );
  const tableDensityClass = columns.length >= 8
    ? 'data-table--dense'
    : columns.length >= 6
      ? 'data-table--compact'
      : '';
  const RowComponent = renderRow ?? DefaultDataTableRow;
  const MobileRowComponent = renderMobileRow ?? DataTableMobileRow;

  const renderMobileActions = useCallback((row) => {
    if (!rowActions) {
      return null;
    }
    if (shouldRenderRowActions && !shouldRenderRowActions(row)) {
      return null;
    }
    return <DataTableRowActions row={row} rowActions={rowActions} />;
  }, [rowActions, shouldRenderRowActions]);
  const actionsCol = hasRowActions ? (
    <col className="data-table__col data-table__col--actions" />
  ) : null;
  const actionsHeader = hasRowActions ? (
    <th className="data-table__th data-table__th--actions" scope="col">
      <span className="visually-hidden">Akcje</span>
    </th>
  ) : null;

  return (
    <div className={['data-table-wrap', className].filter(Boolean).join(' ')}>
      {showToolbar ? (
        <div className="data-table__toolbar">
          {toolbarStart ? <div className="data-table__toolbar-start">{toolbarStart}</div> : null}
          {showSearchInToolbar ? (
            <SearchBar
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={search.placeholder ?? 'Szukaj…'}
              name={search.name ?? 'data-table-search'}
              className={['data-table__search', search.className].filter(Boolean).join(' ')}
              aria-label={search.ariaLabel ?? search.placeholder ?? 'Szukaj w tabeli'}
            />
          ) : null}
        </div>
      ) : null}

      <div className="data-table__content">
        <div ref={cardRef} className="data-table-card">
          <div className="data-table-card__desktop">
            <div
              ref={headerBarRef}
              className={`data-table-header-bar${isHeaderSticky ? ' data-table-header-bar--sticky' : ''}`}
            >
            <div ref={headerScrollRef} className="data-table-header-scroll">
              <table className={['data-table', 'data-table--header', tableDensityClass].filter(Boolean).join(' ')}>
                <colgroup>
                  {rowActionsPosition === 'start' ? actionsCol : null}
                  {columns.map((column) => (
                    <col
                      key={column.key}
                      className={[
                        'data-table__col',
                        column.colClassName,
                        column.hiddenBelow ? `data-table__col--hide-below-${column.hiddenBelow}` : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={column.width ? { width: column.width } : undefined}
                    />
                  ))}
                  {rowActionsPosition === 'end' ? actionsCol : null}
                </colgroup>
                <thead className="data-table__head">
                  <tr>
                    {rowActionsPosition === 'start' ? actionsHeader : null}
                    {columns.map((column) => (
                      column.sort !== false ? (
                        <SortableHeader
                          key={column.key}
                          label={column.label}
                          sortKey={column.key}
                          sortRules={sortRules}
                          onSort={handleSort}
                          className={[
                            column.className,
                            column.hiddenBelow ? `data-table__th--hide-below-${column.hiddenBelow}` : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      ) : (
                        <th
                          key={column.key}
                          className={[
                            'data-table__th',
                            column.className,
                            column.hiddenBelow ? `data-table__th--hide-below-${column.hiddenBelow}` : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          scope="col"
                        >
                          {column.label}
                        </th>
                      )
                    ))}
                    {rowActionsPosition === 'end' ? actionsHeader : null}
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <div
            ref={bodyScrollRef}
            className="data-table-viewport"
            onScroll={syncHeaderScroll}
          >
            <table className={['data-table', 'data-table--body', tableDensityClass].filter(Boolean).join(' ')}>
              <colgroup>
                {rowActionsPosition === 'start' ? actionsCol : null}
                {columns.map((column) => (
                  <col
                    key={column.key}
                    className={[
                      'data-table__col',
                      column.colClassName,
                      column.hiddenBelow ? `data-table__col--hide-below-${column.hiddenBelow}` : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={column.width ? { width: column.width } : undefined}
                  />
                ))}
                {rowActionsPosition === 'end' ? actionsCol : null}
              </colgroup>
              <tbody className="data-table__body">
                {paginatedRows.map((row) => (
                  <RowComponent
                    key={getRowKey(row)}
                    row={row}
                    columns={columns}
                    rowActions={rowActions}
                    rowActionsPosition={rowActionsPosition}
                    getRowKey={getRowKey}
                  />
                ))}
              </tbody>
            </table>
          </div>
          </div>

          <ul className="data-table-mobile" aria-label="Lista rekordów">
            {paginatedRows.map((row) => (
              <MobileRowComponent
                key={getRowKey(row)}
                row={row}
                columns={columns}
                renderActions={renderMobileActions}
                className={getMobileItemClassName?.(row) ?? ''}
              />
            ))}
          </ul>
        </div>

        {filteredRows.length > itemsPerPage ? (
          <div className="data-table__pagination">
            <Pagination
              totalPages={totalPages}
              page={Math.min(page, totalPages)}
              onPageChange={setPage}
              ariaLabel={paginationAriaLabel}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { DataTableRowActions };
export { default as DataTableMobileRow } from './DataTableMobileRow.jsx';
export { getMobileColumnSlots, renderDataTableCell } from './dataTableMobile.js';
