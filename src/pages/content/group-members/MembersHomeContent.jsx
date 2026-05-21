import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader, SubNav, Pagination } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import './MembersHomeContent.css';

const SUPERBAR_HEIGHT = 63;

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

const RANKS = ['Rekrut', 'Uczeń', 'Adept', 'Wojownik', 'Mistrz', 'Legenda'];
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
const ITEMS_PER_PAGE = 10;

function MembersTableColgroup() {
  return (
    <colgroup>
      <col className="members-table__col members-table__col--position" />
      <col className="members-table__col members-table__col--user" />
      <col className="members-table__col members-table__col--rank" />
      <col className="members-table__col members-table__col--currency" />
      <col className="members-table__col members-table__col--total" />
      <col className="members-table__col members-table__col--actions" />
    </colgroup>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h12M7.5 4.5V3a1.5 1.5 0 0 1 1.5-1.5h0a1.5 1.5 0 0 1 1.5 1.5v1.5M14.25 4.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5V4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="4" r="1.25" fill="currentColor" />
      <circle cx="9" cy="9" r="1.25" fill="currentColor" />
      <circle cx="9" cy="14" r="1.25" fill="currentColor" />
    </svg>
  );
}

function MemberRow({ member, onDelete, onMenuAction }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  const handleAction = (action) => {
    onMenuAction?.(member.id, action);
    handleMenuClose();
  };

  return (
    <tr className="members-table__row">
      <td className="members-table__cell members-table__cell--position">
        <span className="members-table__position">#{member.position}</span>
      </td>
      <td className="members-table__cell members-table__cell--user">
        <div className="members-table__user">
          <img
            src={member.avatar}
            alt=""
            className="members-table__avatar"
            loading="lazy"
          />
          <div className="members-table__user-info">
            <span className="members-table__name">{member.name}</span>
            <span className="members-table__title">{member.title}</span>
          </div>
        </div>
      </td>
      <td className="members-table__cell members-table__cell--rank">
        <span className="members-table__rank-badge">{member.rank}</span>
      </td>
      <td className="members-table__cell members-table__cell--currency">
        <span className="members-table__currency">{member.currency}</span>
      </td>
      <td className="members-table__cell members-table__cell--total">
        <span className="members-table__total-currency">{member.totalCurrency}</span>
      </td>
      <td className="members-table__cell members-table__cell--actions">
        <div className="members-table__actions">
          <button
            type="button"
            className="members-table__action-btn members-table__action-btn--delete"
            aria-label={`Usuń ${member.name}`}
            onClick={() => onDelete?.(member.id)}
          >
            <TrashIcon />
          </button>
          <div className="members-table__menu-wrap">
            <button
              type="button"
              className="members-table__action-btn members-table__action-btn--more"
              aria-label="Więcej opcji"
              aria-expanded={menuOpen}
              onClick={handleMenuToggle}
            >
              <MoreIcon />
            </button>
            {menuOpen && (
              <>
                <div
                  className="members-table__menu-backdrop"
                  onClick={handleMenuClose}
                  aria-hidden="true"
                />
                <div className="members-table__menu" role="menu">
                  <button
                    type="button"
                    className="members-table__menu-item"
                    role="menuitem"
                    onClick={() => handleAction('badges')}
                  >
                    Edytuj odznaki
                  </button>
                  <button
                    type="button"
                    className="members-table__menu-item"
                    role="menuitem"
                    onClick={() => handleAction('progress')}
                  >
                    Edytuj postęp
                  </button>
                  <button
                    type="button"
                    className="members-table__menu-item"
                    role="menuitem"
                    onClick={() => handleAction('rank')}
                  >
                    Zmień rangę
                  </button>
                  <button
                    type="button"
                    className="members-table__menu-item"
                    role="menuitem"
                    onClick={() => handleAction('currency')}
                  >
                    Zarządzaj walutą
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function MembersHomeContent() {
  const nav = useGroupSubNav('group-members');
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const cardRef = useRef(null);
  const headerBarRef = useRef(null);
  const headerScrollRef = useRef(null);
  const bodyScrollRef = useRef(null);

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);

  const paginatedMembers = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return members.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [members, page]);

  const handleDelete = (memberId) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleMenuAction = (memberId, action) => {
    console.log(`Action: ${action} for member: ${memberId}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const syncHeaderScroll = useCallback(() => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  }, []);

  const isStickyRef = useRef(false);
  const rafIdRef = useRef(null);

  const updateHeaderPosition = useCallback(() => {
    const card = cardRef.current;
    const headerBar = headerBarRef.current;
    const bodyScroll = bodyScrollRef.current;
    if (!card || !headerBar || !bodyScroll) return;

    const cardRect = card.getBoundingClientRect();
    const shouldBeSticky = cardRect.top < SUPERBAR_HEIGHT;

    if (shouldBeSticky) {
      const bodyRect = bodyScroll.getBoundingClientRect();
      headerBar.style.position = 'fixed';
      headerBar.style.top = `${SUPERBAR_HEIGHT}px`;
      headerBar.style.left = `${bodyRect.left}px`;
      headerBar.style.width = `${bodyRect.width}px`;
      headerBar.style.zIndex = '10';
      headerBar.style.borderRadius = '0';
      headerBar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
    } else {
      headerBar.style.position = '';
      headerBar.style.top = '';
      headerBar.style.left = '';
      headerBar.style.width = '';
      headerBar.style.zIndex = '';
      headerBar.style.borderRadius = '';
      headerBar.style.boxShadow = '';
    }

    if (isStickyRef.current !== shouldBeSticky) {
      isStickyRef.current = shouldBeSticky;
      setIsHeaderSticky(shouldBeSticky);
    }
  }, []);

  useEffect(() => {
    const mainEl = document.getElementById('main-content');
    const scrollTarget = mainEl || window;

    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;
      updateHeaderPosition();
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    scrollTarget.addEventListener('scroll', updateHeaderPosition, { passive: true });

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      scrollTarget.removeEventListener('scroll', updateHeaderPosition);
    };
  }, [updateHeaderPosition]);

  return (
    <section className="members-home" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Zarządzaj uczestnikami kursu — edytuj rangi, odznaki, walutę i postęp."
      />

      <SubNav
        ariaLabel={nav.ariaLabel}
        items={nav.items}
        className="members-home__sub-nav"
      />

      <div className="members-home__content">
        <div ref={cardRef} className="members-table-card">

          <div
            ref={headerBarRef}
            className={`members-table-header-bar${isHeaderSticky ? ' members-table-header-bar--sticky' : ''}`}
          >
            <div ref={headerScrollRef} className="members-table-header-scroll">
              <table className="members-table members-table--header">
                <MembersTableColgroup />
                <thead className="members-table__head">
                  <tr>
                    <th className="members-table__th members-table__th--position" scope="col">
                      Pozycja
                    </th>
                    <th className="members-table__th members-table__th--user" scope="col">
                      Członek grupy
                    </th>
                    <th className="members-table__th members-table__th--rank" scope="col">
                      Ranga
                    </th>
                    <th className="members-table__th members-table__th--currency" scope="col">
                      Waluta
                    </th>
                    <th className="members-table__th members-table__th--total" scope="col">
                      Zgromadzona
                    </th>
                    <th className="members-table__th members-table__th--actions" scope="col">
                      <span className="visually-hidden">Akcje</span>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <div
            ref={bodyScrollRef}
            className="members-table-viewport"
            onScroll={syncHeaderScroll}
          >
            <table className="members-table members-table--body">
              <MembersTableColgroup />
              <tbody className="members-table__body">
                {paginatedMembers.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    onDelete={handleDelete}
                    onMenuAction={handleMenuAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="members-home__pagination">
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={handlePageChange}
              ariaLabel="Nawigacja stron listy uczestników"
            />
          </div>
        )}
      </div>
    </section>
  );
}
