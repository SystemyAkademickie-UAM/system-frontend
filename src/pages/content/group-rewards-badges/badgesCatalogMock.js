import { BADGE_RARITY } from '../../../components/ui/Badge/badgeRarity.js';

const ICON_FILES = [
  'rocket.svg', 'star.svg', 'shield.svg', 'book.svg',
  'carrot.svg', 'moon.svg', 'sword.svg', 'crown.svg',
];

export function createInitialBadgesCatalog() {
  const templates = [
    { name: 'Pierwszy krok', rarity: BADGE_RARITY.common, storyDescription: 'Każda wielka podróż zaczyna się od jednego kroku.', didacticDescription: 'Ukończ pierwszą aktywność.', rewardAmount: 25 },
    { name: 'Punktualny/a', rarity: BADGE_RARITY.common, storyDescription: 'Król ogłosił zbiórkę o wschodzie słońca.', didacticDescription: 'Weź udział w zajęciach na czas.', rewardAmount: 30 },
    { name: 'Strażnik wiedzy', rarity: BADGE_RARITY.common, storyDescription: 'Biblioteka imperium nigdy nie śpi.', didacticDescription: 'Przeczytaj materiał wprowadzający.', rewardAmount: 20 },
    { name: 'Zbieracz marchewek', rarity: BADGE_RARITY.uncommon, storyDescription: 'Skarb królestwa rośnie w ciszy.', didacticDescription: 'Zgromadź 500 waluty.', rewardAmount: 50 },
    { name: 'Mistrz laboratorium', rarity: BADGE_RARITY.uncommon, storyDescription: 'Alchemicy szepczą o twoich eksperymentach.', didacticDescription: 'Ukończ wszystkie aktywności w laboratorium.', rewardAmount: 75 },
    { name: 'Sojusznik drużyny', rarity: BADGE_RARITY.uncommon, storyDescription: 'Razem pokonacie każdą przeszkodę.', didacticDescription: 'Współpracuj w zadaniu grupowym.', rewardAmount: 60 },
    { name: 'Nocny marek', rarity: BADGE_RARITY.rare, storyDescription: 'Księżyc był świadkiem twojej wytrwałości.', didacticDescription: 'Ukończ zadanie po północy.', rewardAmount: 100 },
    { name: 'Pogromca deadline\'ów', rarity: BADGE_RARITY.rare, storyDescription: 'Termin padł na kolana przed twoją determinacją.', didacticDescription: 'Oddaj projekt przed terminem.', rewardAmount: 120 },
    { name: 'Arcymistrz strategii', rarity: BADGE_RARITY.rare, storyDescription: 'Plansze bitewne drżą na twój widok.', didacticDescription: 'Zdobądź maksymalny wynik w quizie.', rewardAmount: 90 },
    { name: 'Legenda akademii', rarity: BADGE_RARITY.epic, storyDescription: 'Twoje imię wypisano złotem w kronikach.', didacticDescription: 'Osiągnij rangę Legenda.', rewardAmount: 200 },
    { name: 'Smoczy łowca', rarity: BADGE_RARITY.epic, storyDescription: 'Smok oddał ci swój skarb bez walki.', didacticDescription: 'Ukończ wszystkie etapy kursu.', rewardAmount: 250 },
    { name: 'Feniks odrodzony', rarity: BADGE_RARITY.epic, storyDescription: 'Popiół zamieniłeś w zwycięstwo.', didacticDescription: 'Popraw wynik po nieudanej próbie.', rewardAmount: 150 },
  ];

  return templates.map((badge, index) => ({
    id: `badge-${index + 1}`,
    position: index + 1,
    iconFile: ICON_FILES[index % ICON_FILES.length],
    rewardEmoji: '🥕',
    ...badge,
  }));
}

export function createEmptyBadge(position) {
  return {
    id: `badge-${Date.now()}`,
    position,
    name: '',
    iconFile: 'rocket.svg',
    rarity: BADGE_RARITY.common,
    storyDescription: '',
    didacticDescription: '',
    rewardAmount: 0,
    rewardEmoji: '🥕',
  };
}

export function reindexBadges(badges) {
  return badges.map((badge, index) => ({
    ...badge,
    position: index + 1,
  }));
}
