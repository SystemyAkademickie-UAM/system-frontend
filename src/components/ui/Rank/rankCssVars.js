import { getRankThemeConfig } from './rankTheme.js';
import { hexToRgba, RANK_LOCKED_COLOR } from '../../../utils/rankGradient.js';

/**
 * Zwraca zmienne CSS dla kafelka rangi.
 *
 * @param {string} [theme='default']
 * @param {{ accentColor?: string, isLocked?: boolean }} [options]
 */
export function getRankCssVars(theme = 'default', options = {}) {
  const { accentColor, isLocked = false } = options;

  if (isLocked) {
    return {
      '--rank-accent-color': hexToRgba(RANK_LOCKED_COLOR, 0.55),
      '--rank-icon-bg': hexToRgba(RANK_LOCKED_COLOR, 0.18),
      '--rank-icon-color': RANK_LOCKED_COLOR,
      '--rank-label-color': RANK_LOCKED_COLOR,
      '--rank-name-color': RANK_LOCKED_COLOR,
      '--rank-check-color': RANK_LOCKED_COLOR,
    };
  }

  if (accentColor) {
    return {
      '--rank-accent-color': accentColor,
      '--rank-icon-bg': hexToRgba(accentColor, 0.18),
      '--rank-icon-color': accentColor,
      '--rank-label-color': accentColor,
      '--rank-name-color': accentColor,
      '--rank-check-color': accentColor,
    };
  }

  const config = getRankThemeConfig(theme);

  return {
    '--rank-accent-color': `var(${config.accentVar})`,
    '--rank-icon-bg': `var(${config.iconBgVar})`,
    '--rank-icon-color': `var(${config.iconColorVar})`,
    '--rank-label-color': `var(${config.labelColorVar})`,
    '--rank-name-color': 'var(--color-rank-text)',
    '--rank-check-color': 'var(--color-accent)',
  };
}
