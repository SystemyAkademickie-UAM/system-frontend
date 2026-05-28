import { getBadgeRarityConfig } from './badgeRarity.js';

/** Zwraca zmienne CSS dla odznaki (pełnej i mini). */
export function getBadgeCssVars(rarity, { selected = false } = {}) {
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
