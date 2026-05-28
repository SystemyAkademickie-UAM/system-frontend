/** Domyślny motyw rangi — później kolorystyka zależna od liczby rang w grupie. */
export const RANK_THEME = {
  default: 'default',
};

export const RANK_THEME_CONFIG = {
  [RANK_THEME.default]: {
    accentVar: '--color-rank-accent',
    iconBgVar: '--color-rank-icon-bg',
    iconColorVar: '--color-rank-icon-color',
    labelColorVar: '--color-rank-label',
  },
};

/**
 * @param {string} [theme='default']
 */
export function getRankThemeConfig(theme = RANK_THEME.default) {
  return RANK_THEME_CONFIG[theme] ?? RANK_THEME_CONFIG[RANK_THEME.default];
}
