/**
 * @typedef {'asc' | 'desc'} SortDirection
 * @typedef {{ key: string, direction: SortDirection }} SortRule
 * @typedef {'number' | 'text'} SortType
 * @typedef {{ type: 'custom', order: readonly string[] }} CustomSort
 */

function compareByCustomOrder(valueA, valueB, orderedValues) {
  const indexA = orderedValues.indexOf(valueA);
  const indexB = orderedValues.indexOf(valueB);
  const orderA = indexA === -1 ? orderedValues.length : indexA;
  const orderB = indexB === -1 ? orderedValues.length : indexB;
  return orderA - orderB;
}

/**
 * @param {unknown} valueA
 * @param {unknown} valueB
 * @param {SortType | CustomSort | false | undefined} sort
 */
export function compareSortValues(valueA, valueB, sort) {
  if (!sort) return 0;

  if (sort === 'number') {
    return Number(valueA) - Number(valueB);
  }

  if (sort === 'text') {
    return String(valueA).localeCompare(String(valueB), 'pl', { sensitivity: 'base' });
  }

  if (sort.type === 'custom') {
    return compareByCustomOrder(String(valueA), String(valueB), sort.order);
  }

  return 0;
}

/**
 * @param {Record<string, unknown>} rowA
 * @param {Record<string, unknown>} rowB
 * @param {string} key
 * @param {SortDirection} direction
 * @param {{ key: string, sort?: SortType | CustomSort | false, accessor?: (row: Record<string, unknown>) => unknown }[]} columns
 */
export function compareRowsByColumn(rowA, rowB, key, direction, columns) {
  const column = columns.find((col) => col.key === key);
  if (column?.sort === false) return 0;

  const getValue = column?.accessor ?? ((row) => row[key]);
  const sortType = column?.sort ?? 'text';
  const result = compareSortValues(getValue(rowA), getValue(rowB), sortType);
  return direction === 'desc' ? -result : result;
}

/**
 * @param {Record<string, unknown>[]} rows
 * @param {SortRule[]} sortRules
 * @param {{ key: string, sort?: SortType | CustomSort | false, accessor?: (row: Record<string, unknown>) => unknown }[]} columns
 * @param {string} [tiebreakerKey]
 */
export function sortRows(rows, sortRules, columns, tiebreakerKey) {
  const effectiveRules = [...sortRules];

  if (tiebreakerKey && !effectiveRules.some((rule) => rule.key === tiebreakerKey)) {
    effectiveRules.push({ key: tiebreakerKey, direction: 'asc' });
  }

  return [...rows].sort((rowA, rowB) => {
    for (const rule of effectiveRules) {
      const comparison = compareRowsByColumn(rowA, rowB, rule.key, rule.direction, columns);
      if (comparison !== 0) {
        return comparison;
      }
    }
    return 0;
  });
}

/**
 * @param {SortRule[]} prevRules
 * @param {string} key
 * @returns {SortRule[]}
 */
export function cycleSortRule(prevRules, key) {
  const index = prevRules.findIndex((rule) => rule.key === key);

  if (index === -1) {
    return [...prevRules, { key, direction: 'asc' }];
  }

  if (prevRules[index].direction === 'asc') {
    return prevRules.map((rule, ruleIndex) =>
      ruleIndex === index ? { ...rule, direction: 'desc' } : rule,
    );
  }

  return prevRules.filter((_, ruleIndex) => ruleIndex !== index);
}
