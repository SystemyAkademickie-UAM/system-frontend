import { getBadgeRarityConfig } from './badgeRarity.js';
import { hexToRgba, RANK_LOCKED_COLOR } from '../../../utils/rankGradient.js';

/** Zwraca zmienne CSS dla odznaki (pełnej i mini). */
export function getBadgeCssVars(rarity, { selected = false, isLocked = false } = {}) {
  if (isLocked) {
    return {
      '--badge-rarity-color': hexToRgba(RANK_LOCKED_COLOR, 0.55),
      '--badge-icon-bg': hexToRgba(RANK_LOCKED_COLOR, 0.18),
      '--badge-icon-color': RANK_LOCKED_COLOR,
    };
  }

  const config = getBadgeRarityConfig(rarity);

  const vars = {
    '--badge-rarity-color': `var(${config.cssVar})`,
    '--badge-icon-bg': `var(${config.iconBgVar})`,
    '--badge-icon-color': `var(${config.iconColorVar})`,
  };

  if (selected) {
    vars['--badge-mini-bg'] = `var(${config.selectedBgVar})`;
  }

  return vars;
}
