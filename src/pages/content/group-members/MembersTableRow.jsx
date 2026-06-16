import { DataTableRowActions } from '../../../components/ui/DataTable/DataTable.jsx';

export default function MembersTableRow({
  row,
  columns,
  rowActions,
  rowActionsPosition = 'end',
}) {
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
        row.isLecturer ? 'members-table__row--lecturer' : '',
      ].filter(Boolean).join(' ')}
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
