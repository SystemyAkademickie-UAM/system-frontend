import { useMemo, useState } from 'react';
import { DataTable, PageHeader, SearchBar, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import './MembersHomeContent.css';

const RANKS = ['Rekrut', 'Uczeń', 'Adept', 'Wojownik', 'Mistrz', 'Legenda'];

const AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Oscar',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
];

const TITLES = [
  'MISTRZ MARCHEWKI', 'STRATEG IMPERIUM', 'REKRUT', 'ŁOWCA ODZNAK',
  'NOCNY MAREK', 'POGROMCA DEADLINEÓW', 'POMOCNA DŁOŃ', 'AKTYWISTA',
];

const NAMES = [
  'Soren Valerius', 'Elena Vance', 'The Architect', 'Kaelen Sun',
  'Mira Blackwood', 'Dante Reyes', 'Luna Sterling', 'Atlas Knight',
  'Nova Chen', 'Zephyr Blake', 'Iris Thorne', 'Orion Fox',
  'Sage Rivera', 'Phoenix Ward', 'Jasper Cole', 'Aria Stone',
  'Leo Martinez', 'Ivy Cross', 'Felix Hart', 'Maya Frost',
  'Theo Nash', 'Stella Park', 'River Quinn', 'Jade Liu',
  'Miles Carter', 'Violet Hayes', 'Ash Morgan', 'Ruby Kim',
  'Quinn Taylor', 'Skye Brooks', 'Cleo James', 'Ezra West',
  'Piper Lane', 'Kai Nakamura', 'Willow Dean', 'Axel Storm',
  'Hazel Wright', 'Finn O\'Brien', 'Aurora Bell', 'Silas Reed',
  'Ember Shaw', 'Rowan Price', 'Lyra Webb', 'Atlas Vega',
  'Eden Moore',
];

function generateMockMembers() {
  return NAMES.map((name, index) => ({
    id: `member-${index + 1}`,
    position: index + 1,
    name,
    avatar: AVATARS[index % AVATARS.length],
    title: TITLES[index % TITLES.length],
    rank: RANKS[index % RANKS.length],
    currency: Math.floor(Math.random() * 500) + 10,
    totalCurrency: Math.floor(Math.random() * 2000) + 50,
    badgesCount: Math.floor(Math.random() * 12),
  }));
}

const MOCK_MEMBERS = generateMockMembers();

const MEMBER_COLUMNS = [
  {
    key: 'position',
    label: 'Numer',
    sort: 'number',
    width: '108px',
    className: 'members-table__th--position',
    colClassName: 'members-table__col--position',
    cellClassName: 'members-table__cell--position',
    render: (member) => (
      <span className="members-table__position">#{member.position}</span>
    ),
  },
  {
    key: 'name',
    label: 'Członek grupy',
    sort: 'text',
    className: 'members-table__th--user',
    colClassName: 'members-table__col--user',
    cellClassName: 'members-table__cell--user',
    render: (member) => (
      <div className="members-table__user">
        <img
          src={member.avatar}
          alt=""
          className="members-table__avatar"
          loading="lazy"
        />
        <div className="members-table__user-info">
          <span className="members-table__name">{member.name}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'rank',
    label: 'Ranga',
    sort: { type: 'custom', order: RANKS },
    width: '120px',
    className: 'members-table__th--rank',
    colClassName: 'members-table__col--rank',
    cellClassName: 'members-table__cell--rank',
    hiddenBelow: 768,
    render: (member) => (
      <span className="members-table__rank-badge">{member.rank}</span>
    ),
  },
  {
    key: 'currency',
    label: 'Waluta',
    sort: 'number',
    width: '110px',
    className: 'members-table__th--currency',
    colClassName: 'members-table__col--currency',
    cellClassName: 'members-table__cell--currency',
    hiddenBelow: 480,
    render: (member) => (
      <span className="members-table__currency">{member.currency}</span>
    ),
  },
  {
    key: 'totalCurrency',
    label: 'Zgromadzona',
    sort: 'number',
    width: '110px',
    className: 'members-table__th--total',
    colClassName: 'members-table__col--total',
    cellClassName: 'members-table__cell--total',
    hiddenBelow: 768,
    render: (member) => (
      <span className="members-table__total-currency">{member.totalCurrency}</span>
    ),
  },
];

export default function MembersHomeContent() {
  const nav = useGroupSubNav('group-members');
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');

  const rowActions = useMemo(() => ({
    onDelete: (member) => {
      setMembers((prev) => prev.filter((item) => item.id !== member.id));
    },
    deleteAriaLabel: (member) => `Usuń ${member.name}`,
    menuItems: [
      {
        id: 'badges',
        label: 'Edytuj odznaki',
        description: 'Przypisz lub odbierz odznaki uczestnikowi.',
        onSelect: (member) => console.log(`badges: ${member.id}`),
      },
      {
        id: 'progress',
        label: 'Edytuj postęp',
        description: 'Zmień poziom, XP lub ukończone zadania.',
        onSelect: (member) => console.log(`progress: ${member.id}`),
      },
      {
        id: 'rank',
        label: 'Zmień rangę',
        description: 'Ustaw rangę w hierarchii grupy.',
        onSelect: (member) => console.log(`rank: ${member.id}`),
      },
      {
        id: 'currency',
        label: 'Zarządzaj walutą',
        description: 'Dodaj lub odejmij punkty waluty uczestnika.',
        onSelect: (member) => console.log(`currency: ${member.id}`),
      },
    ],
  }), []);

  return (
    <section className="page-unavailable" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Zarządzaj uczestnikami kursu — edytuj rangi, odznaki, walutę i postęp."
      />

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj członka grupy…"
          name="member-search"
          className="members-page__search"
          aria-label="Szukaj członka grupy"
        />
      </div>

      <DataTable
        columns={MEMBER_COLUMNS}
        data={members}
        rowKey="id"
        tiebreakerKey="position"
        itemsPerPage={10}
        paginationAriaLabel="Nawigacja stron listy uczestników"
        search={{
          external: true,
          value: searchQuery,
          filter: (member, query) => member.name.toLowerCase().includes(query),
        }}
        rowActions={rowActions}
      />
    </section>
  );
}
