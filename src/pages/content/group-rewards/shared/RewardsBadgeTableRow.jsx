import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '../../../../components/ui/index.js';
import { DataTableRowActions } from '../../../../components/ui/DataTable/DataTable.jsx';
import { useRewardsTablePreview } from './useRewardsTablePreview.js';
import './rewardsTablePreview.css';

export default function RewardsBadgeTableRow({ row, columns, rowActions }) {
  const rowRef = useRef(null);
  const { previewVisible, layout, bubbleRef, showPreview, hidePreview, handleMenuOpenChange } = useRewardsTablePreview();

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
            ref={bubbleRef}
            className="rewards-table-preview rewards-table-preview--badge"
            style={{
              visibility: layout ? 'visible' : 'hidden',
              left: layout ? `${layout.left}px` : 0,
              top: layout ? `${layout.top}px` : 0,
            }}
            aria-hidden="true"
          >
            <Badge
              rarity={row.rarity}
              name={row.name}
              storyDescription={row.storyDescription}
              didacticDescription={row.didacticDescription}
              rewardAmount={row.rewardAmount}
              rewardEmoji={row.rewardEmoji}
              iconFile={row.iconFile}
              showEarnedAt={false}
            />
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
