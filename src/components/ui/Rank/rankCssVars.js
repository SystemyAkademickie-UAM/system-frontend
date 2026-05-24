import { getRankThemeConfig } from './rankTheme.js';

/** Zwraca zmienne CSS dla kafelka rangi. */
export function getRankCssVars(theme = 'default') {
  const config = getRankThemeConfig(theme);

  return {
    '--rank-accent-color': `var(${config.accentVar})`,
    '--rank-icon-bg': `var(${config.iconBgVar})`,
    '--rank-icon-color': `var(${config.iconColorVar})`,
    '--rank-label-color': `var(${config.labelColorVar})`,
  };
}
