/**
 * @file avatarCategories.js
 * @description Funkcje pomocnicze i narzędziowe modułu avatarCategories.
 */

// === IMPORTY I STAŁE MODUŁU ===
/**
 * Narzędzie kategoryzacji i filtrowania awatarów.
 */

export const AVATAR_CATEGORY = {
  ALL: 'all',
  PEOPLE: 'people',
  FANTASY: 'fantasy',
  ROBOTS: 'robots',
  SPACE: 'space',
  STEAMPUNK: 'steampunk',
  VARIOUS: 'various',
};

export const AVATAR_CATEGORY_TABS = [
  { id: AVATAR_CATEGORY.ALL, label: { polish: 'Wszystkie', english: 'All' } },
  { id: AVATAR_CATEGORY.PEOPLE, label: { polish: 'Ludzie', english: 'People' } },
  { id: AVATAR_CATEGORY.FANTASY, label: { polish: 'Fantasy', english: 'Fantasy' } },
  { id: AVATAR_CATEGORY.ROBOTS, label: { polish: 'Roboty', english: 'Robots' } },
  { id: AVATAR_CATEGORY.SPACE, label: { polish: 'Kosmos', english: 'Space' } },
  { id: AVATAR_CATEGORY.STEAMPUNK, label: { polish: 'Steampunk', english: 'Steampunk' } },
  { id: AVATAR_CATEGORY.VARIOUS, label: { polish: 'Różne', english: 'Various' } },
];

/**
 * Ustalona kolejność ID awatarów wewnątrz każdej z grup (dokładnie jak na grafice).
 */
export const ORDERED_AVATAR_IDS = {
  [AVATAR_CATEGORY.PEOPLE]: [
    61,
    31,
    64,
    46,
    63,
    33,
    65,
    30,
    29,
    66,
    32,
    62,
  ],

  [AVATAR_CATEGORY.FANTASY]: [
    25,
    26,
    8,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
  ],

  [AVATAR_CATEGORY.ROBOTS]: [
    1, 2, 3, 4, 5, 6
  ],

  [AVATAR_CATEGORY.SPACE]: [
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    47,
    58,
    9,
    7,
    27,
    45,
  ],

  [AVATAR_CATEGORY.STEAMPUNK]: [
    48,
    56,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
  ],

  [AVATAR_CATEGORY.VARIOUS]: [
    37,
    59,
    60,
    10,
    11,
    28,
    57,
    35,
    36,
  ],
};

export const ALL_ORDERED_AVATAR_IDS = [
  ...ORDERED_AVATAR_IDS[AVATAR_CATEGORY.PEOPLE],
  ...ORDERED_AVATAR_IDS[AVATAR_CATEGORY.FANTASY],
  ...ORDERED_AVATAR_IDS[AVATAR_CATEGORY.ROBOTS],
  ...ORDERED_AVATAR_IDS[AVATAR_CATEGORY.SPACE],
  ...ORDERED_AVATAR_IDS[AVATAR_CATEGORY.STEAMPUNK],
  ...ORDERED_AVATAR_IDS[AVATAR_CATEGORY.VARIOUS],
];

/**
 * Bezpośrednie mapowanie ID awatara do kategorii.
 */

const AVATAR_ID_TO_CATEGORY = {};
for (const [category, ids] of Object.entries(ORDERED_AVATAR_IDS)) {
  for (const id of ids) {
    AVATAR_ID_TO_CATEGORY[id] = category;
  }
}

// === GŁÓWNA LOGIKA NARZĘDZIOWA I EKSPORTY ===
/**
 * Sprawdza, czy dany awatar ma zostać wykluczony z wyboru (np. Nikita / nobodgeit).
 * @param {{ id: number, name?: string, imageUrl?: string }} avatar
 * @returns {boolean}
 */
export function isExcludedAvatar(avatar) {
  if (!avatar) return true;
  if (avatar.id === 34) return true;
  const target = `${avatar.name ?? ''} ${avatar.imageUrl ?? ''}`.toLowerCase();
  return target.includes('nobodgeit') || target.includes('nikita');
}

/**
 * Rozpoznaje kategorię danego awatara na podstawie jego ID, nazwy lub adresu URL grafiki.
 * @param {{ id: number, name?: string, imageUrl?: string }} avatar
 * @returns {string}
 */
export function getAvatarCategory(avatar) {

if (!avatar || isExcludedAvatar(avatar)) return AVATAR_CATEGORY.VARIOUS;

  if (avatar.id && AVATAR_ID_TO_CATEGORY[avatar.id]) {
    return AVATAR_ID_TO_CATEGORY[avatar.id];
  }

  const target = `${avatar.name ?? ''} ${avatar.imageUrl ?? ''}`.toLowerCase();

  if (
    target.includes('man_') ||
    target.includes('woman_') ||
    target.includes('senior_woman') ||
    target.includes('man ') ||
    target.includes('woman ') ||
    target.includes('ludzie')
  ) {
    return AVATAR_CATEGORY.PEOPLE;
  }

  if (
    target.includes('fantasy') ||
    target.includes('wizard') ||
    target.includes('alchemist') ||
    target.includes('centaur') ||
    target.includes('dragon') ||
    target.includes('dwarf') ||
    target.includes('elf') ||
    target.includes('goblin') ||
    target.includes('griffin') ||
    target.includes('knight') ||
    target.includes('mage') ||
    target.includes('necromancer') ||
    target.includes('orc') ||
    target.includes('portal') ||
    target.includes('sword') ||
    target.includes('treasure') ||
    target.includes('viking')
  ) {
    return AVATAR_CATEGORY.FANTASY;
  }

  if (target.includes('robot') || target.includes('avatar_')) {
    return AVATAR_CATEGORY.ROBOTS;
  }

  if (
    target.includes('space') ||
    target.includes('rocket') ||
    target.includes('astronaut') ||
    target.includes('alien') ||
    target.includes('blackhole') ||
    target.includes('nebula') ||
    target.includes('rover') ||
    target.includes('satellite') ||
    target.includes('spacestation') ||
    target.includes('ufo') ||
    target.includes('carrot')
  ) {
    return AVATAR_CATEGORY.SPACE;
  }

  if (target.includes('steampunk')) {
    return AVATAR_CATEGORY.STEAMPUNK;
  }

  return AVATAR_CATEGORY.VARIOUS;
}

/**
 * Zwraca indeks sortowania dla danego awatara.
 * @param {{ id: number }} avatar
 * @returns {number}
 */
function getAvatarSortIndex(avatar) {
  if (!avatar) return 9999;
  const index = ALL_ORDERED_AVATAR_IDS.indexOf(avatar.id);
  return index >= 0 ? index : 9999;
}

/**
 * Filtruje i sortuje listę awatarów według wybranej kategorii.
 * @param {{ id: number, name?: string, imageUrl?: string }[]} avatars
 * @param {string} categoryId
 * @returns {{ id: number, name?: string, imageUrl?: string }[]}
 */
export function filterAvatarsByCategory(avatars, categoryId) {
  if (!Array.isArray(avatars)) return [];

  const available = avatars.filter((avatar) => !isExcludedAvatar(avatar));

  let result;
  if (!categoryId || categoryId === AVATAR_CATEGORY.ALL) {
    result = available;
  } else {
    result = available.filter((avatar) => getAvatarCategory(avatar) === categoryId);
  }

  return [...result].sort((a, b) => getAvatarSortIndex(a) - getAvatarSortIndex(b));
}

/**
 * Losuje określoną liczbę unikalnych awatarów z listy (z pominięciem wykluczonych).
 * @param {{ id: number, name?: string, imageUrl?: string }[]} avatars
 * @param {number} [count=4]
 * @returns {{ id: number, name?: string, imageUrl?: string }[]}
 */
export function pickRandomAvatars(avatars, count = 4) {
  if (!Array.isArray(avatars) || avatars.length === 0) {
    return [];
  }

  const available = avatars.filter((avatar) => !isExcludedAvatar(avatar));
  if (available.length <= count) {
    return [...available];
  }

  const shuffled = [...available];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}
