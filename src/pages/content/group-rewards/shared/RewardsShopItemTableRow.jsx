import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { ProductCard } from '../../../../components/ui/index.js';
import { DataTableRowActions } from '../../../../components/ui/DataTable/DataTable.jsx';
import { resolveShopCategoryLabels } from '../../../../utils/shop/shopCategories.js';
import { useRewardsTablePreview } from './useRewardsTablePreview.js';
import './rewardsTablePreview.css';

export default function RewardsShopItemTableRow({ row, columns, rowActions, rowColor, onRowDoubleClick, isHighlighted = false }) {
  const rowRef = useRef(null);
  const { previewVisible, layout, bubbleRef, showPreview, hidePreview, handleMenuOpenChange } = useRewardsTablePreview();

  const handleMouseEnter = () => {
    showPreview(rowRef.current);
  };

  const resolvedColor = rowColor ?? row.rowColor ?? row.categoryColor ?? null;
  const colorStyle = resolvedColor ? { '--row-color': resolvedColor } : undefined;

  return (
    <>
      <tr
        ref={rowRef}
        id={`shop-item-row-${row.id}`}
        className={[
          'data-table__row',
          'rewards-table__row',
          resolvedColor ? 'data-table__row--colored' : '',
          isHighlighted || row.isHighlighted ? 'data-table__row--highlighted' : '',
        ].filter(Boolean).join(' ')}
        style={colorStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hidePreview}
        onDoubleClick={() => onRowDoubleClick(row)}
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
            className="rewards-table-preview rewards-table-preview--shop-item"
            style={{
              visibility: layout ? 'visible' : 'hidden',
              left: layout ? `${layout.left}px` : 0,
              top: layout ? `${layout.top}px` : 0,
            }}
            aria-hidden="true"
          >
            <ProductCard
              variant="preview"
              hideActions
              showLecturerActions
              itemId={row.id}
              name={row.name}
              storyDescription={row.storyDescription}
              didacticDescription={row.didacticDescription}
              priceAmount={row.priceAmount}
              minPrice={row.minPrice}
              salePriceAmount={row.salePriceAmount}
              imageRef={row.imageRef}
              categories={resolveShopCategoryLabels(row.categories)}
            />
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
