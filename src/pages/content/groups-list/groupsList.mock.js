/**
 * Tymczasowe dane grup — zastąpione odpowiedzią z API w fetchUserGroups().
 *
 * @typedef {Object} GroupListItem
 * @property {string} id
 * @property {string} storyName — nazwa fabularna grupy
 * @property {string} subject — nazwa dydaktyczna przedmiotu
 * @property {string} lecturer — prowadzący
 * @property {string | null} [bannerUrl] — opcjonalny URL baneru; brak lub błąd ładowania → placeholder
 */

/** @type {GroupListItem[]} */
export const MOCK_GROUPS_LIST = [
  {
    id: '100001',
    storyName: 'Marchewkowa Gwardia anty-orkowa',
    subject: 'Bazy danych',
    lecturer: 'Dr Andrzej Marchwiński',
    bannerUrl: 'https://picsum.photos/seed/carrot-guard/640/360',
  },
  {
    id: '100002',
    storyName: 'Klątwa Zapomnianych Ruin',
    subject: 'Technologie Informatyczne',
    lecturer: 'Dr N. Exploit',
    bannerUrl: 'https://picsum.photos/seed/forgotten-ruins/640/360',
  },
  {
    id: '100003',
    storyName: 'Szkolenie Magów Wody',
    subject: 'Bazy danych',
    lecturer: 'Dr John Mocny',
    bannerUrl: 'https://picsum.photos/seed/water-mages/640/360',
  },
  {
    id: '100004',
    storyName: 'Bunt Żelaznych Golemów',
    subject: 'Ochrona Systemów',
    lecturer: 'Prof. dr hab. Ewa Szymańska',
    bannerUrl: 'https://picsum.photos/seed/iron-golems/640/360',
  },
  {
    id: '100005',
    storyName: 'Czarna Wieża Algorytmów',
    subject: 'Algorytmy i struktury danych',
    lecturer: 'Dr Katarzyna Ciemność',
    bannerUrl: 'https://picsum.photos/seed/dark-tower/640/360',
  },
  {
    id: '100006',
    storyName: 'Cybercity: Protokół Fajerwerków',
    subject: 'Programowanie obiektowe',
    lecturer: 'Dr N. Exploit',
    bannerUrl: 'https://picsum.photos/seed/cybercity/640/360',
  },
  {
    id: '100007',
    storyName: 'Mgliste Wzgórza Ruby',
    subject: 'Języki skryptowe',
    lecturer: 'Dr Tomasz Mgła',
    bannerUrl: null,
  },
  {
    id: '100008',
    storyName: 'Oblężenie Zamku Lambda',
    subject: 'Programowanie funkcyjne',
    lecturer: 'Prof. Helena Funkcyjna',
    bannerUrl: '/assets/banners/brakujacy-baner.png',
  },
  {
    id: '100009',
    storyName: 'Tajemnice Lochu Git',
    subject: 'Inżynieria oprogramowania',
    lecturer: 'Dr Andrzej Marchwiński',
    bannerUrl: 'https://picsum.photos/seed/git-dungeon/640/360',
  },
  {
    id: '100010',
    storyName: 'Królestwo Dockerlandii',
    subject: 'Systemy operacyjne',
    lecturer: 'Dr John Mocny',
    bannerUrl: 'https://picsum.photos/seed/docker-kingdom/640/360',
  },
  {
    id: '100011',
    storyName: 'Wyprawa przez Sieć Neuronową',
    subject: 'Sztuczna inteligencja',
    lecturer: 'Prof. dr hab. Ewa Szymańska',
    bannerUrl: 'https://picsum.photos/seed/neural-net/640/360',
  },
];
