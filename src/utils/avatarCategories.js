/**
 * Narzędzie kategoryzacji i filtrowania awatarów.
 */

export const AVATAR_CATEGORY = {
  MEN: 'men',
  WOMEN: 'women',
  VARIOUS: 'various',
  ALL: 'all',
};

export const AVATAR_CATEGORY_TABS = [
  { id: AVATAR_CATEGORY.MEN, label: 'Dla mężczyzn' },
  { id: AVATAR_CATEGORY.WOMEN, label: 'Dla kobiet' },
  { id: AVATAR_CATEGORY.VARIOUS, label: 'Różne' },
  { id: AVATAR_CATEGORY.ALL, label: 'Wszystkie' },
];

const MEN_KEYWORDS = [
  'man_', 'man ', 'gentleman', 'pharaoh', 'blue_wizard', 'wizard',
  'fantasy_alchemist', 'alchemist', 'fantasy_dwarf', 'dwarf',
  'fantasy_knight', 'knight', 'fantasy_mage', 'mage',
  'fantasy_necromancer', 'necromancer', 'fantasy_viking', 'viking',
  'steampunk_king', 'king', 'steampunk_gentleman', 'mężczyzn'
];

const WOMEN_KEYWORDS = [
  'woman_', 'woman ', 'senior_woman', 'queen', 'lady', 'girl',
  'fantasy_elf', 'kobieta'
];

/**
 * Rozpoznaje kategorię danego awatara na podstawie jego nazwy lub adresu URL grafiki.
 * @param {{ id: number, name?: string, imageUrl?: string }} avatar
 * @returns {'men' | 'women' | 'various'}
 */
export function getAvatarCategory(avatar) {
  if (!avatar) return AVATAR_CATEGORY.VARIOUS;

  const target = `${avatar.name ?? ''} ${avatar.imageUrl ?? ''}`.toLowerCase();

  for (const keyword of WOMEN_KEYWORDS) {
    if (target.includes(keyword.toLowerCase())) {
      return AVATAR_CATEGORY.WOMEN;
    }
  }

  for (const keyword of MEN_KEYWORDS) {
    if (target.includes(keyword.toLowerCase())) {
      return AVATAR_CATEGORY.MEN;
    }
  }

  return AVATAR_CATEGORY.VARIOUS;
}

/**
 * Filtruje listę awatarów według wybranej kategorii.
 * @param {{ id: number, name?: string, imageUrl?: string }[]} avatars
 * @param {string} categoryId
 * @returns {{ id: number, name?: string, imageUrl?: string }[]}
 */
export function filterAvatarsByCategory(avatars, categoryId) {
  if (!Array.isArray(avatars)) return [];
  if (!categoryId || categoryId === AVATAR_CATEGORY.ALL) {
    return avatars;
  }
  return avatars.filter((avatar) => getAvatarCategory(avatar) === categoryId);
}

/**
 * Losuje określoną liczbę unikalnych awatarów z listy.
 * @param {{ id: number, name?: string, imageUrl?: string }[]} avatars
 * @param {number} [count=4]
 * @returns {{ id: number, name?: string, imageUrl?: string }[]}
 */
export function pickRandomAvatars(avatars, count = 4) {
  if (!Array.isArray(avatars) || avatars.length === 0) {
    return [];
  }
  if (avatars.length <= count) {
    return [...avatars];
  }

  const shuffled = [...avatars];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}
