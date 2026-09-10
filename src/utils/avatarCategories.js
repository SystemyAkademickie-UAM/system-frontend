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
  // Ludzie (12 awatarów)
  [AVATAR_CATEGORY.PEOPLE]: [
    61, // Woman Beach
    31, // Man Headphones
    64, // Woman Hijab
    46, // Senior Woman
    63, // Woman Glasses
    33, // Man Laptop
    65, // Woman Reading
    30, // Man Guitar
    29, // Man Glasses
    66, // Woman Smiling
    32, // Man Hiker
    62, // Woman Curly
  ],

  // Fantasy (16 awatarów)
  [AVATAR_CATEGORY.FANTASY]: [
    25, // Fantasy Treasure
    26, // Fantasy Viking
    8,  // Blue Wizard
    12, // Fantasy Alchemist
    13, // Fantasy Centaur
    14, // Fantasy Dragon
    15, // Fantasy Dwarf
    16, // Fantasy Elf
    17, // Fantasy Goblin
    18, // Fantasy Griffin
    19, // Fantasy Knight
    20, // Fantasy Mage
    21, // Fantasy Necromancer
    22, // Fantasy Orc
    23, // Fantasy Portal
    24, // Fantasy Sword
  ],

  // Roboty (6 awatarów)
  [AVATAR_CATEGORY.ROBOTS]: [
    1, 2, 3, 4, 5, 6
  ],

  // Kosmos (13 awatarów)
  [AVATAR_CATEGORY.SPACE]: [
    38, // Rabbit Blackhole
    39, // Rabbit Mechanic
    40, // Rabbit Nebula
    41, // Rabbit Rocket
    42, // Rabbit Rover
    43, // Rabbit Satellite
    44, // Rabbit Spacestation
    47, // Space Carrots
    58, // Ufo Alien
    9,  // Carrot Radar
    7,  // Astronaut Helmet
    27, // Green Alien
    45, // Retro Rocket
  ],

  // Steampunk (9 awatarów)
  [AVATAR_CATEGORY.STEAMPUNK]: [
    48, // Steampunk Airship
    56, // Steampunk Rabbit
    49, // Steampunk Binoculars
    50, // Steampunk Clock
    51, // Steampunk Gears
    52, // Steampunk Gentleman
    53, // Steampunk King
    54, // Steampunk Machine
    55, // Steampunk Orrery
  ],

  // Różne (9 awatarów)
  [AVATAR_CATEGORY.VARIOUS]: [
    37, // Pizza Slice
    59, // Vinyl Player
    60, // Vinyl Record
    10, // Desert Cactus
    11, // Egyptian Pharaoh
    28, // Green Chameleon
    57, // Tiger Face
    35, // Panda Eating
    36, // Panda Leaf
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

  // Wykluczamy Nikitę
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
