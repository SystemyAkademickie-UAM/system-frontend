export function createInitialRanksCatalog() {
  const templates = [
    {
      name: 'Rekrut',
      iconFile: 'recruit.svg',
      costAmount: 0,
      storyDescription: 'Nowicjusz stawia pierwsze kroki w akademii.',
      shopItems: ['Podstawowy miecz', 'Plecak podróżnika'],
    },
    {
      name: 'Uczeń',
      iconFile: 'student.svg',
      costAmount: 100,
      storyDescription: 'Opanowujesz podstawy i zyskujesz uznanie mentorów.',
      shopItems: ['Notes alchemika', 'Latarnia'],
    },
    {
      name: 'Adept',
      iconFile: 'adept.svg',
      costAmount: 250,
      storyDescription: 'Twoje umiejętności rosną szybciej niż oczekiwano.',
      shopItems: ['Amulet ochrony', 'Eliksir koncentracji'],
    },
    {
      name: 'Wojownik',
      iconFile: 'warrior.svg',
      costAmount: 500,
      storyDescription: 'Stajesz na froncie i podejmujesz trudne wyzwania.',
      shopItems: ['Tarcza strażnika', 'Mapa lochów'],
    },
    {
      name: 'Mistrz',
      iconFile: 'master.svg',
      costAmount: 1000,
      storyDescription: 'Inni studenci patrzą na ciebie z szacunkiem.',
      shopItems: ['Korona mentora', 'Skrzydła nocnego lotu'],
    },
    {
      name: 'Legenda',
      iconFile: 'legend.svg',
      costAmount: 2000,
      storyDescription: 'Twoje imię będzie pamiętane przez pokolenia.',
      shopItems: ['Smoczy pancerz', 'Księga legend'],
    },
  ];

  return templates.map((rank, index) => ({
    id: `rank-${index + 1}`,
    position: index + 1,
    costEmoji: '🥕',
    ...rank,
  }));
}

export function createEmptyRank(position) {
  return {
    id: `rank-${Date.now()}`,
    position,
    name: '',
    iconFile: 'rank.svg',
    costAmount: 0,
    costEmoji: '🥕',
    storyDescription: '',
    shopItems: [],
  };
}

export function reindexRanks(ranks) {
  return ranks.map((rank, index) => ({
    ...rank,
    position: index + 1,
  }));
}

export function parseShopItems(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatShopItems(items) {
  return (items ?? []).join('\n');
}
