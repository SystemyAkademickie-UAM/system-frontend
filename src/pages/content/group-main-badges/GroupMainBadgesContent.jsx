import { useMemo, useState } from 'react';
import {
  BADGE_RARITY,
  BADGE_RARITY_LABELS,
  SearchBar,
} from '../../../components/ui/index.js';
import { useGroupCurrency } from '../../../context/GroupCurrencyContext.jsx';
import BadgeTreasuryCard from './BadgeTreasuryCard.jsx';
import {
  filterTreasuryBadges,
  LECTURER_SORT_OPTIONS,
  sortTreasuryBadges,
  STUDENT_SORT_OPTIONS,
  TREASURY_SORT,
} from './badgeTreasuryModel.js';
import { useGroupMainBadges } from './useGroupMainBadges.js';
import './GroupMainBadgesContent.css';

const RARITY_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: BADGE_RARITY.common, label: BADGE_RARITY_LABELS.common },
  { id: BADGE_RARITY.uncommon, label: BADGE_RARITY_LABELS.uncommon },
  { id: BADGE_RARITY.rare, label: BADGE_RARITY_LABELS.rare },
  { id: BADGE_RARITY.epic, label: BADGE_RARITY_LABELS.epic },
];

const UNLOCK_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'earned', label: 'Odblokowane' },
  { id: 'unearned', label: 'Zablokowane' },
];

export default function GroupMainBadgesContent() {
  const { symbol } = useGroupCurrency();
  const {
    badges,
    earnersByBadgeId,
    studentAccountId,
    isLoading,
    error,
    isStudentView,
  } = useGroupMainBadges();

  const defaultSort = isStudentView ? TREASURY_SORT.unlockFirst : TREASURY_SORT.qualityDesc;
  const sortOptions = isStudentView ? STUDENT_SORT_OPTIONS : LECTURER_SORT_OPTIONS;

  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [unlockFilter, setUnlockFilter] = useState('all');
  const [sortBy, setSortBy] = useState(defaultSort);

  const visibleBadges = useMemo(() => {
    const filtered = filterTreasuryBadges(badges, {
      searchQuery,
      rarityFilter,
      unlockFilter: isStudentView ? unlockFilter : 'all',
    });

    return sortTreasuryBadges(filtered, sortBy);
  }, [badges, searchQuery, rarityFilter, unlockFilter, sortBy, isStudentView]);

  if (isLoading) {
    return <p className="badge-treasury__message" role="status">Ładowanie skarbca odznak…</p>;
  }

  if (error) {
    return (
      <p className="badge-treasury__message badge-treasury__message--error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="badge-treasury" aria-label="Skarbiec odznak">
      <div className="badge-treasury__top">
        <header className="badge-treasury__header">
          <p className="badge-treasury__eyebrow">Skarbiec</p>
          <h1 className="badge-treasury__title">Odznaki kursu</h1>
        </header>

        <div className="badge-treasury__controls">
          <SearchBar
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Szukaj odznaki…"
            name="badge-treasury-search"
            className="badge-treasury__search"
            aria-label="Szukaj odznaki po nazwie"
          />

          <div className="badge-treasury__filters" role="group" aria-label="Filtr rzadkości">
            {RARITY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={[
                  'badge-treasury__filter',
                  rarityFilter === filter.id ? 'badge-treasury__filter--active' : '',
                ].join(' ')}
                onClick={() => setRarityFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isStudentView ? (
            <div className="badge-treasury__filters" role="group" aria-label="Filtr odblokowania">
              {UNLOCK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={[
                    'badge-treasury__filter',
                    unlockFilter === filter.id ? 'badge-treasury__filter--active' : '',
                  ].join(' ')}
                  onClick={() => setUnlockFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          ) : null}

          <label className="badge-treasury__sort-wrap">
            <span className="badge-treasury__sort-label">Sortuj</span>
            <select
              id="badge-treasury-sort"
              className="badge-treasury__sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {badges.length === 0 ? (
        <p className="badge-treasury__empty">W tym kursie nie ma jeszcze żadnych odznak.</p>
      ) : visibleBadges.length === 0 ? (
        <p className="badge-treasury__empty">Brak odznak spełniających wybrane filtry.</p>
      ) : (
        <div className="badge-treasury__grid">
          {visibleBadges.map((badge) => (
            <BadgeTreasuryCard
              key={badge.id}
              badge={badge}
              earnersByBadgeId={earnersByBadgeId}
              excludeAccountId={isStudentView ? studentAccountId : null}
              currencySymbol={symbol}
              isStudentView={isStudentView}
            />
          ))}
        </div>
      )}
    </section>
  );
}
