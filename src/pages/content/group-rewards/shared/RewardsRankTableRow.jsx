import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Rank } from '../../../../components/ui/index.js';
import { DataTableRowActions } from '../../../../components/ui/DataTable/DataTable.jsx';
import { useRewardsTablePreview } from './useRewardsTablePreview.js';
import './rewardsTablePreview.css';

export default function RewardsRankTableRow({ row, columns, rowActions }) {
  const rowRef = useRef(null);
  const { previewVisible, previewPos, showPreview, hidePreview, handleMenuOpenChange } = useRewardsTablePreview({
    previewWidth: 520,
    previewHeight: 320,
  });

  const handleMouseEnter = () => {
    showPreview(rowRef.current);
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="data-table__row rewards-table__row"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hidePreview}
      >
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
        {rowActions ? (
          <td className="data-table__cell data-table__cell--actions">
            <DataTableRowActions
              row={row}
              rowActions={rowActions}
              onMenuOpenChange={handleMenuOpenChange}
            />
          </td>
        ) : null}
      </tr>

      {previewVisible
        ? createPortal(
          <div
            className="rewards-table-preview rewards-table-preview--rank"
            style={{ left: `${previewPos.x}px`, top: `${previewPos.y}px` }}
            aria-hidden="true"
          >
            <Rank
              name={row.name}
              costAmount={row.costAmount}
              costEmoji={row.costEmoji ?? '🥕'}
              storyDescription={row.storyDescription}
              shopItems={row.shopItems ?? []}
              discountPercent={row.discount ?? 0}
              iconFile={row.iconFile}
            />
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
