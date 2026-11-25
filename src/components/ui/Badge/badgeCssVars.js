/**
 * @file badgeCssVars.js
 * @description Komponent interfejsu użytkownika badgeCssVars.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { getBadgeRarityConfig } from './badgeRarity.js';
import { hexToRgba, RANK_LOCKED_COLOR } from '../../../utils/rankGradient.js';

/**
 * Zwraca zmienne CSS dla odznaki (pełnej i mini).
 * Gdy `preserveRarityColor` jest `true` (niezdobyta odznaka sekretna),
 * zachowuje kolor wynikający z rzadkości zamiast wyszarzać ramkę.
 *
 * @param {string} rarity
 * @param {{ selected?: boolean, isLocked?: boolean, preserveRarityColor?: boolean }} [options]
 */
export function getBadgeCssVars(rarity, { selected = false, isLocked = false, preserveRarityColor = false } = {}) {
  if (isLocked && !preserveRarityColor) {
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

// === RENDEROWANIE WIDOKU ===
  return vars;
}
