export const VIEW_LAYOUT = {
  table: 'table',
  tiles: 'tiles',
};

/** @type {Record<string, { label: string, variant: 'secondary' | 'primary', ariaLabel: string }>} */
export const VIEW_LAYOUT_CONFIG = {
  [VIEW_LAYOUT.table]: {
    label: 'Lista',
    variant: 'secondary',
    ariaLabel: 'Przełącz na widok tabelkowy',
  },
  [VIEW_LAYOUT.tiles]: {
    label: 'Kafelki',
    variant: 'primary',
    ariaLabel: 'Przełącz na widok kafelkowy',
  },
};

/**
 * @param {string} layout
 * @returns {keyof typeof VIEW_LAYOUT_CONFIG}
 */
export function resolveViewLayoutConfigKey(layout) {
  return layout === VIEW_LAYOUT.tiles ? VIEW_LAYOUT.tiles : VIEW_LAYOUT.table;
}

/**
 * @param {string} layout
 * @returns {string}
 */
export function getNextViewLayout(layout) {
  return layout === VIEW_LAYOUT.tiles ? VIEW_LAYOUT.table : VIEW_LAYOUT.tiles;
}
