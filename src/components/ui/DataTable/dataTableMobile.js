/** @typedef {'primary' | 'title' | 'meta' | 'hidden'} DataTableMobileRole */

/**
 * @param {Object} column
 * @returns {boolean}
 */
export function isSpacerColumn(column) {
  if (column.mobileHidden) {
    return true;
  }
  if (column.key === '_spacer' || column.key?.startsWith('_spacer')) {
    return true;
  }
  return String(column.label ?? '').trim() === '';
}

/**
 * @param {Object[]} columns
 * @returns {Object[]}
 */
export function getMobileEligibleColumns(columns) {
  return columns.filter((column) => !isSpacerColumn(column));
}

/**
 * @param {Object} column
 * @param {Object} row
 * @returns {import('react').ReactNode}
 */
export function renderDataTableCell(column, row) {
  if (column.render) {
    return column.render(row);
  }
  return String(row[column.key] ?? '');
}

/**
 * Domyślny podział kolumn mobilnych:
 * - 1. i 2. kolumna: wiersz główny (numer + nazwa)
 * - 3. i 4. kolumna: meta pod nazwą
 * - reszta: ukryta
 *
 * Kolumna może nadpisać rolę przez `mobileRole`.
 *
 * @param {Object[]} columns
 * @returns {{
 *   primary: Object | null,
 *   title: Object | null,
 *   meta: Object[],
 * }}
 */
export function getMobileColumnSlots(columns) {
  const eligible = getMobileEligibleColumns(columns);
  const slots = {
    primary: null,
    title: null,
    meta: [],
  };

  const explicit = eligible.filter((column) => column.mobileRole && column.mobileRole !== 'hidden');
  const hiddenKeys = new Set(
    eligible.filter((column) => column.mobileRole === 'hidden').map((column) => column.key),
  );
  const ordered = eligible.filter((column) => !hiddenKeys.has(column.key));

  if (explicit.length > 0) {
    slots.primary = ordered.find((column) => column.mobileRole === 'primary') ?? ordered[0] ?? null;
    slots.title = ordered.find((column) => column.mobileRole === 'title')
      ?? ordered.find((column) => column !== slots.primary)
      ?? null;
    slots.meta = ordered.filter((column) => column.mobileRole === 'meta').slice(0, 2);

    if (slots.meta.length === 0) {
      slots.meta = ordered
        .filter((column) => column !== slots.primary && column !== slots.title)
        .slice(0, 2);
    }

    return slots;
  }

  slots.primary = ordered[0] ?? null;
  slots.title = ordered[1] ?? null;
  slots.meta = ordered.slice(2, 4);

  if (ordered.length === 1) {
    slots.primary = null;
    slots.title = ordered[0];
    slots.meta = [];
  }

  return slots;
}
