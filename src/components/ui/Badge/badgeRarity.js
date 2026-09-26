import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

/** Identyfikatory rzadkości odznak. */
export const BADGE_RARITY = {
  common: 'common',
  uncommon: 'uncommon',
  rare: 'rare',
  epic: 'epic',
};

const LANGUAGE = READLANGUAGECOOKIE();

const BADGERARITY__TEXTLABEL = {
  polish: {
    [BADGE_RARITY.common]: 'Zwykła',
    [BADGE_RARITY.uncommon]: 'Niezwykła',
    [BADGE_RARITY.rare]: 'Rzadka',
    [BADGE_RARITY.epic]: 'Epicka',
  },
  english: {
    [BADGE_RARITY.common]: 'Common',
    [BADGE_RARITY.uncommon]: 'Uncommon',
    [BADGE_RARITY.rare]: 'Rare',
    [BADGE_RARITY.epic]: 'Epic',
  },
};

export const BADGE_RARITY_LABELS = BADGERARITY__TEXTLABEL[LANGUAGE];

/**
 * Konfiguracja wizualna rzadkości — powiązana z tokenami w tokens.css.
 * @type {Record<string, { label: string, cssVar: string, iconBgVar: string, iconColorVar: string }>}
 */
export const BADGE_RARITY_CONFIG = {
  [BADGE_RARITY.common]: {
    label: BADGE_RARITY_LABELS[BADGE_RARITY.common],
    cssVar: '--color-badge-rarity-common',
    iconBgVar: '--color-badge-icon-bg-common',
    iconColorVar: '--color-badge-icon-common',
    selectedBgVar: '--color-badge-mini-selected-common',
  },
  [BADGE_RARITY.uncommon]: {
    label: BADGE_RARITY_LABELS[BADGE_RARITY.uncommon],
    cssVar: '--color-badge-rarity-uncommon',
    iconBgVar: '--color-badge-icon-bg-uncommon',
    iconColorVar: '--color-badge-icon-uncommon',
    selectedBgVar: '--color-badge-mini-selected-uncommon',
  },
  [BADGE_RARITY.rare]: {
    label: BADGE_RARITY_LABELS[BADGE_RARITY.rare],
    cssVar: '--color-badge-rarity-rare',
    iconBgVar: '--color-badge-icon-bg-rare',
    iconColorVar: '--color-badge-icon-rare',
    selectedBgVar: '--color-badge-mini-selected-rare',
  },
  [BADGE_RARITY.epic]: {
    label: BADGE_RARITY_LABELS[BADGE_RARITY.epic],
    cssVar: '--color-badge-rarity-epic',
    iconBgVar: '--color-badge-icon-bg-epic',
    iconColorVar: '--color-badge-icon-epic',
    selectedBgVar: '--color-badge-mini-selected-epic',
  },
};

/**
 * @param {string} rarity
 * @returns {typeof BADGE_RARITY_CONFIG[keyof typeof BADGE_RARITY_CONFIG]}
 */
export function getBadgeRarityConfig(rarity) {
  return BADGE_RARITY_CONFIG[rarity] ?? BADGE_RARITY_CONFIG[BADGE_RARITY.common];
}
