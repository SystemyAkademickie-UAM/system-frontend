import { getMobileColumnSlots, renderDataTableCell } from './dataTableMobile.js';

/**
 * @param {Object} props
 * @param {Object} props.row
 * @param {Object[]} props.columns
 * @param {import('react').ReactNode | ((row: Object) => import('react').ReactNode)} [props.renderActions]
 * @param {string} [props.className]
 * @param {string | null} [props.rowColor]
 */
export default function DataTableMobileRow({
  row,
  columns,
  renderActions = null,
  className = '',
  rowColor = null,
}) {
  const { primary, title, meta } = getMobileColumnSlots(columns);
  const actions = typeof renderActions === 'function' ? renderActions(row) : renderActions;
  const metaItems = meta.filter(Boolean);
  const resolvedColor = rowColor ?? row.rowColor ?? row.color ?? null;
  const colorStyle = resolvedColor ? { '--row-color': resolvedColor } : undefined;

  return (
    <li
      className={[
        'data-table-mobile__item',
        resolvedColor ? 'data-table-mobile__item--colored' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={colorStyle}
    >
      <div
        className={[
          'data-table-mobile__body',
          !primary ? 'data-table-mobile__body--no-primary' : '',
        ].filter(Boolean).join(' ')}
      >
        {primary ? (
          <div className="data-table-mobile__primary">
            {renderDataTableCell(primary, row)}
          </div>
        ) : null}

        {title ? (
          <div className="data-table-mobile__title">
            {renderDataTableCell(title, row)}
          </div>
        ) : null}

        {metaItems.length > 0 ? (
          <div className="data-table-mobile__meta">
            {metaItems.map((column, index) => (
              <span key={column.key} className="data-table-mobile__meta-group">
                {index > 0 ? (
                  <span className="data-table-mobile__meta-separator" aria-hidden="true"> · </span>
                ) : null}
                <span className="data-table-mobile__meta-item">
                  {renderDataTableCell(column, row)}
                </span>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {actions ? (
        <div className="data-table-mobile__actions">
          {actions}
        </div>
      ) : null}
    </li>
  );
}
