import { BADGE_RARITY } from '../../../components/ui/Badge/badgeRarity.js';

export const MEMBER_RANKS = ['Rekrut', 'Uczeń', 'Adept', 'Wojownik', 'Mistrz', 'Legenda'];

/** Katalog wszystkich odznak w systemie (mock). */
export const ALL_BADGES = [
  {
    id: 'badge-1',
    name: 'Pierwszy krok',
    rarity: BADGE_RARITY.common,
    storyDescription: 'Każda wielka podróż zaczyna się od jednego kroku.',
    didacticDescription: 'Ukończ pierwszą aktywność.',
    rewardAmount: 25,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-2',
    name: 'Punktualny/a',
    rarity: BADGE_RARITY.common,
    storyDescription: 'Król ogłosił zbiórkę o wschodzie słońca.',
    didacticDescription: 'Weź udział w zajęciach na czas.',
    rewardAmount: 30,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-3',
    name: 'Strażnik wiedzy',
    rarity: BADGE_RARITY.common,
    storyDescription: 'Biblioteka imperium nigdy nie śpi.',
    didacticDescription: 'Przeczytaj materiał wprowadzający.',
    rewardAmount: 20,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-4',
    name: 'Zbieracz marchewek',
    rarity: BADGE_RARITY.uncommon,
    storyDescription: 'Skarb królestwa rośnie w ciszy.',
    didacticDescription: 'Zgromadź 500 waluty.',
    rewardAmount: 50,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-5',
    name: 'Mistrz laboratorium',
    rarity: BADGE_RARITY.uncommon,
    storyDescription: 'Alchemicy szepczą o twoich eksperymentach.',
    didacticDescription: 'Ukończ wszystkie aktywności w laboratorium.',
    rewardAmount: 75,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-6',
    name: 'Sojusznik drużyny',
    rarity: BADGE_RARITY.uncommon,
    storyDescription: 'Razem pokonacie każdą przeszkodę.',
    didacticDescription: 'Współpracuj w zadaniu grupowym.',
    rewardAmount: 60,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-7',
    name: 'Nocny marek',
    rarity: BADGE_RARITY.rare,
    storyDescription: 'Księżyc był świadkiem twojej wytrwałości.',
    didacticDescription: 'Ukończ zadanie po północy.',
    rewardAmount: 100,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-8',
    name: 'Pogromca deadline\'ów',
    rarity: BADGE_RARITY.rare,
    storyDescription: 'Termin padł na kolana przed twoją determinacją.',
    didacticDescription: 'Oddaj projekt przed terminem.',
    rewardAmount: 120,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-9',
    name: 'Arcymistrz strategii',
    rarity: BADGE_RARITY.rare,
    storyDescription: 'Plansze bitewne drżą na twój widok.',
    didacticDescription: 'Zdobądź maksymalny wynik w quizie.',
    rewardAmount: 90,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-10',
    name: 'Legenda akademii',
    rarity: BADGE_RARITY.epic,
    storyDescription: 'Twoje imię wypisano złotem w kronikach.',
    didacticDescription: 'Osiągnij rangę Legenda.',
    rewardAmount: 200,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-11',
    name: 'Smoczy łowca',
    rarity: BADGE_RARITY.epic,
    storyDescription: 'Smok oddał ci swój skarb bez walki.',
    didacticDescription: 'Ukończ wszystkie etapy kursu.',
    rewardAmount: 250,
    rewardEmoji: '🥕',
  },
  {
    id: 'badge-12',
    name: 'Feniks odrodzony',
    rarity: BADGE_RARITY.epic,
    storyDescription: 'Popiół zamieniłeś w zwycięstwo.',
    didacticDescription: 'Popraw wynik po nieudanej próbie.',
    rewardAmount: 150,
    rewardEmoji: '🥕',
  },
];

/** Etapy kursu z aktywnościami (mock). */
export const ACTIVITY_STAGES = [
  {
    id: 'lab-1',
    name: 'Laboratorium 1',
    activities: [
      {
        id: 'lab-1-a1',
        name: 'Zbiórka na dziedzińcu',
        storyDescription: 'Król ogłosił zbiórkę o wschodzie słońca.',
        didacticDescription: 'Punktualny/a',
        rewardAmount: 50,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-1-a2',
        name: 'Mapa skarbów',
        storyDescription: 'Stary pirat zostawił wskazówki w piwnicy.',
        didacticDescription: 'Orientacja w materiale',
        rewardAmount: 40,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-1-a3',
        name: 'Eliksir wiedzy',
        storyDescription: 'Mikstura wymaga idealnych proporcji.',
        didacticDescription: 'Quiz wprowadzający',
        rewardAmount: 60,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-1-a4',
        name: 'Pieczęć ukończenia',
        storyDescription: 'Rada magów zatwierdziła twój postęp.',
        didacticDescription: 'Podsumowanie etapu',
        rewardAmount: 80,
        rewardEmoji: '🥕',
      },
    ],
  },
  {
    id: 'lab-2',
    name: 'Laboratorium 2',
    activities: [
      {
        id: 'lab-2-a1',
        name: 'Most nad przepaścią',
        storyDescription: 'Tylko solidne fundamenty utrzymają konstrukcję.',
        didacticDescription: 'Projekt grupowy',
        rewardAmount: 70,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-2-a2',
        name: 'Zagadka strażnika',
        storyDescription: 'Strażnik nie ustąpi bez właściwej odpowiedzi.',
        didacticDescription: 'Zadanie problemowe',
        rewardAmount: 55,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-2-a3',
        name: 'Kronika bitew',
        storyDescription: 'Historia uczy, kto nie słucha — powtarza błędy.',
        didacticDescription: 'Analiza case study',
        rewardAmount: 65,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-2-a4',
        name: 'Herold zwycięstwa',
        storyDescription: 'Trąbka ogłasza twój sukces w całym królestwie.',
        didacticDescription: 'Prezentacja wyników',
        rewardAmount: 90,
        rewardEmoji: '🥕',
      },
    ],
  },
  {
    id: 'lab-3',
    name: 'Laboratorium 3',
    activities: [
      {
        id: 'lab-3-a1',
        name: 'Labirynt decyzji',
        storyDescription: 'Każdy korytarz kryje inną konsekwencję.',
        didacticDescription: 'Symulacja decyzyjna',
        rewardAmount: 75,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-3-a2',
        name: 'Kuźnia pomysłów',
        storyDescription: 'Iskry unoszą się nad rozgrzaną stalą.',
        didacticDescription: 'Burza mózgów',
        rewardAmount: 45,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-3-a3',
        name: 'Test wytrwałości',
        storyDescription: 'Mgła zasłania drogę, lecz idziesz dalej.',
        didacticDescription: 'Zadanie domowe',
        rewardAmount: 50,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-3-a4',
        name: 'Korona laboranta',
        storyDescription: 'Mentor kiwa głową z uznaniem.',
        didacticDescription: 'Egzamin praktyczny',
        rewardAmount: 100,
        rewardEmoji: '🥕',
      },
    ],
  },
  {
    id: 'lab-4',
    name: 'Laboratorium 4',
    activities: [
      {
        id: 'lab-4-a1',
        name: 'Wielka strategia',
        storyDescription: 'Mapa kampanii rozciąga się po horyzont.',
        didacticDescription: 'Plan projektu końcowego',
        rewardAmount: 80,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-4-a2',
        name: 'Rada weteranów',
        storyDescription: 'Doświadczeni rycerze dzielą się radą.',
        didacticDescription: 'Feedback mentorski',
        rewardAmount: 60,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-4-a3',
        name: 'Ostateczna próba',
        storyDescription: 'Smok czeka na szczycie góry.',
        didacticDescription: 'Projekt końcowy',
        rewardAmount: 150,
        rewardEmoji: '🥕',
      },
      {
        id: 'lab-4-a4',
        name: 'Dawn legenda',
        storyDescription: 'Słońce wschodzi nad nową erą.',
        didacticDescription: 'Obrona projektu',
        rewardAmount: 200,
        rewardEmoji: '🥕',
      },
    ],
  },
];

const ALL_ACTIVITY_IDS = ACTIVITY_STAGES.flatMap((stage) => stage.activities.map((a) => a.id));

/**
 * Generuje początkowy zestaw zdobytych odznak na podstawie badgesCount.
 * @param {number} memberIndex
 * @param {number} badgesCount
 */
export function buildInitialEarnedBadgeIds(memberIndex, badgesCount) {
  const count = Math.min(badgesCount, ALL_BADGES.length);
  const earned = [];

  for (let i = 0; i < count; i += 1) {
    earned.push(ALL_BADGES[(memberIndex + i * 3) % ALL_BADGES.length].id);
  }

  return [...new Set(earned)];
}

/**
 * Generuje początkowy postęp aktywności (mock).
 * @param {number} memberIndex
 */
export function buildInitialActivityProgress(memberIndex) {
  const progress = {};

  ALL_ACTIVITY_IDS.forEach((activityId, index) => {
    progress[activityId] = (index + memberIndex) % 3 !== 0;
  });

  return progress;
}

/**
 * Liczy ukończone aktywności na podstawie mapy postępu.
 * @param {Record<string, boolean>} activityProgress
 */
export function countCompletedActivities(activityProgress = {}) {
  return Object.values(activityProgress).filter(Boolean).length;
}

/**
 * Sortuje odznaki: zdobyte przed niezdobytymi.
 */
export function sortBadgesByEarned(badges, earnedIds) {
  const earnedSet = new Set(earnedIds);

  return [...badges].sort((a, b) => {
    const aEarned = earnedSet.has(a.id);
    const bEarned = earnedSet.has(b.id);

    if (aEarned === bEarned) {
      return a.name.localeCompare(b.name, 'pl');
    }

    return aEarned ? -1 : 1;
  });
}

const BADGE_RARITY_ORDER = {
  [BADGE_RARITY.common]: 0,
  [BADGE_RARITY.uncommon]: 1,
  [BADGE_RARITY.rare]: 2,
  [BADGE_RARITY.epic]: 3,
};

/** Dostępne opcje sortowania odznak w modalu edycji. */
export const BADGE_SORT_OPTIONS = [
  { id: 'earned-first', label: 'Zdobyte → niezdobyte' },
  { id: 'unearned-first', label: 'Niezdobyte → zdobyte' },
  { id: 'name-asc', label: 'Nazwa A–Z' },
  { id: 'name-desc', label: 'Nazwa Z–A' },
  { id: 'rarity-asc', label: 'Rzadkość rosnąco' },
  { id: 'rarity-desc', label: 'Rzadkość malejąco' },
  { id: 'reward-desc', label: 'Nagroda malejąco' },
  { id: 'reward-asc', label: 'Nagroda rosnąco' },
];

/**
 * Sortuje listę odznak według wybranej opcji.
 * @param {typeof ALL_BADGES} badges
 * @param {string} sortBy — id z BADGE_SORT_OPTIONS
 * @param {string[]} [earnedIds]
 */
export function sortBadges(badges, sortBy, earnedIds = []) {
  const earnedSet = new Set(earnedIds);
  const sorted = [...badges];

  switch (sortBy) {
    case 'earned-first':
      return sortBadgesByEarned(sorted, earnedIds);
    case 'unearned-first':
      return sorted.sort((a, b) => {
        const aEarned = earnedSet.has(a.id);
        const bEarned = earnedSet.has(b.id);

        if (aEarned === bEarned) {
          return a.name.localeCompare(b.name, 'pl');
        }

        return aEarned ? 1 : -1;
      });
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'pl'));
    case 'rarity-asc':
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[a.rarity] ?? 0) - (BADGE_RARITY_ORDER[b.rarity] ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    case 'rarity-desc':
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    case 'reward-desc':
      return sorted.sort((a, b) => (
        b.rewardAmount - a.rewardAmount || a.name.localeCompare(b.name, 'pl')
      ));
    case 'reward-asc':
      return sorted.sort((a, b) => (
        a.rewardAmount - b.rewardAmount || a.name.localeCompare(b.name, 'pl')
      ));
    default:
      return sorted;
  }
}

export { ALL_ACTIVITY_IDS };
