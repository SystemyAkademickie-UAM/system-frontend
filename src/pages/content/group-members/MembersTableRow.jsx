import { DataTableRowActions } from '../../../components/ui/DataTable/DataTable.jsx';

export default function MembersTableRow({
  row,
  columns,
  rowActions,
  rowActionsPosition = 'end',
  rowColor,
}) {
  const resolvedColor = rowColor ?? row.rowColor ?? row.color ?? null;
  const colorStyle = resolvedColor ? { '--row-color': resolvedColor } : undefined;
  const showActionsCell = Boolean(rowActions);
  const actionsCell = showActionsCell ? (
    <td className="data-table__cell data-table__cell--actions">
      {row.isLecturer ? null : <DataTableRowActions row={row} rowActions={rowActions} />}
    </td>
  ) : null;

  return (
    <tr
      className={[
        'data-table__row',
        resolvedColor ? 'data-table__row--colored' : '',
        row.isLecturer ? 'members-table__row--lecturer' : '',
      ].filter(Boolean).join(' ')}
      style={colorStyle}
    >
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
